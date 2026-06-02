import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { uploadProductImage } from '@/lib/supabase';
import { Categorie } from '@prisma/client';

// GET all products (admin)
export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const page = Math.max(1, parseInt(searchParams.get('page') ?? '1'));
  const perPage = 10;
  const cat = searchParams.get('cat') ?? '';
  const q = searchParams.get('q') ?? '';

  const where = {
    ...(cat && Object.values(Categorie).includes(cat as Categorie) ? { categorie: cat as Categorie } : {}),
    ...(q ? { OR: [{ nom: { contains: q } }, { description: { contains: q } }] } : {}),
  };

  const [total, produits] = await Promise.all([
    prisma.produit.count({ where }),
    prisma.produit.findMany({
      where,
      orderBy: { date_ajout: 'desc' },
      skip: (page - 1) * perPage,
      take: perPage,
    }),
  ]);

  return NextResponse.json({ produits, total, pages: Math.ceil(total / perPage) });
}

// POST create product
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });

  try {
    const formData = await request.formData();
    const nom = formData.get('nom') as string;
    const categorie = formData.get('categorie') as string;
    const sous_categorie = formData.get('sous_categorie') as string;
    const description = formData.get('description') as string;
    const prixStr = formData.get('prix') as string;
    const prix = prixStr ? parseFloat(prixStr.replace(',', '.')) : 0;
    const imageFile = formData.get('image') as File | null;

    if (!nom || !categorie || !Object.values(Categorie).includes(categorie as Categorie)) {
      return NextResponse.json({ error: 'Données invalides.' }, { status: 400 });
    }

    let imageUrl: string | null = null;

    if (imageFile && imageFile.size > 0) {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
      if (!allowedTypes.includes(imageFile.type)) {
        return NextResponse.json({ error: 'Format image non supporté.' }, { status: 400 });
      }
      if (imageFile.size > 5 * 1024 * 1024) {
        return NextResponse.json({ error: "L'image ne doit pas dépasser 5 Mo." }, { status: 400 });
      }

      const ext = imageFile.name.split('.').pop()?.toLowerCase() ?? 'jpg';
      const filename = `prod_${Date.now()}_${Math.random().toString(36).substring(2)}.${ext}`;
      const buffer = Buffer.from(await imageFile.arrayBuffer());
      imageUrl = await uploadProductImage(buffer, filename, imageFile.type);
    }

    const produit = await prisma.produit.create({
      data: {
        nom,
        categorie: categorie as Categorie,
        sous_categorie: sous_categorie || null,
        description: description || null,
        prix,
        image: imageUrl,
      },
    });

    return NextResponse.json({ success: true, produit });
  } catch (error) {
    console.error('Create product error:', error);
    return NextResponse.json({ error: 'Erreur interne.' }, { status: 500 });
  }
}
