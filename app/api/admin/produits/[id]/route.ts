import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { uploadProductImage, deleteProductImage } from '@/lib/supabase';
import { Categorie } from '@prisma/client';

type Params = { params: { id: string } };

// GET single product
export async function GET(_: NextRequest, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });

  const produit = await prisma.produit.findUnique({ where: { id: parseInt(params.id) } });
  if (!produit) return NextResponse.json({ error: 'Produit introuvable.' }, { status: 404 });

  return NextResponse.json(produit);
}

// PUT update product
export async function PUT(request: NextRequest, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });

  const id = parseInt(params.id);
  const existing = await prisma.produit.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: 'Produit introuvable.' }, { status: 404 });

  try {
    const formData = await request.formData();
    const nom = formData.get('nom') as string;
    const categorie = formData.get('categorie') as string;
    const sous_categorie = formData.get('sous_categorie') as string;
    const description = formData.get('description') as string;
    const prixStr = formData.get('prix') as string;
    const prix = prixStr ? parseFloat(prixStr.replace(',', '.')) : 0;
    const imageFile = formData.get('image') as File | null;
    const removeImage = formData.get('remove_image') === '1';

    let imageUrl = existing.image;

    if (removeImage && existing.image) {
      const filename = existing.image.split('/').pop()!;
      await deleteProductImage(filename).catch(() => {});
      imageUrl = null;
    } else if (imageFile && imageFile.size > 0) {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
      if (!allowedTypes.includes(imageFile.type)) {
        return NextResponse.json({ error: 'Format image non supporté.' }, { status: 400 });
      }
      const ext = imageFile.name.split('.').pop()?.toLowerCase() ?? 'jpg';
      const filename = `prod_${Date.now()}_${Math.random().toString(36).substring(2)}.${ext}`;
      const buffer = Buffer.from(await imageFile.arrayBuffer());
      imageUrl = await uploadProductImage(buffer, filename, imageFile.type);

      // Delete old image
      if (existing.image) {
        const oldFilename = existing.image.split('/').pop()!;
        await deleteProductImage(oldFilename).catch(() => {});
      }
    }

    const produit = await prisma.produit.update({
      where: { id },
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
    console.error('Update product error:', error);
    return NextResponse.json({ error: 'Erreur interne.' }, { status: 500 });
  }
}

// DELETE product
export async function DELETE(_: NextRequest, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });

  const id = parseInt(params.id);
  const existing = await prisma.produit.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: 'Produit introuvable.' }, { status: 404 });

  // Delete image from Supabase Storage
  if (existing.image) {
    const filename = existing.image.split('/').pop()!;
    await deleteProductImage(filename).catch(() => {});
  }

  await prisma.produit.delete({ where: { id } });

  return NextResponse.json({ success: true });
}
