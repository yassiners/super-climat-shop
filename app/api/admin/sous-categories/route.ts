import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Categorie } from '@prisma/client';

// GET all sous-categories (optionally filtered by categorie)
export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const cat = searchParams.get('categorie') ?? '';

  const where = cat && Object.values(Categorie).includes(cat as Categorie)
    ? { categorie: cat as Categorie }
    : {};

  const sousCategories = await (prisma as any).sousCategorie.findMany({
    where,
    orderBy: [{ categorie: 'asc' }, { label: 'asc' }],
  });

  return NextResponse.json(sousCategories);
}

// POST create sous-categorie
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });

  try {
    const body = await request.json();
    const { slug, label, categorie, icon } = body;

    if (!slug || !label || !categorie || !Object.values(Categorie).includes(categorie as Categorie)) {
      return NextResponse.json({ error: 'Données invalides. Slug, label et catégorie sont requis.' }, { status: 400 });
    }

    // Validate slug format
    if (!/^[a-z0-9_]+$/.test(slug)) {
      return NextResponse.json({ error: 'Le slug ne doit contenir que des lettres minuscules, chiffres et underscores.' }, { status: 400 });
    }

    // Check for duplicate slug
    const existing = await (prisma as any).sousCategorie.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json({ error: 'Ce slug existe déjà.' }, { status: 409 });
    }

    const sc = await (prisma as any).sousCategorie.create({
      data: {
        slug,
        label,
        categorie: categorie as Categorie,
        icon: icon || null,
      },
    });

    return NextResponse.json({ success: true, sousCategorie: sc });
  } catch (error) {
    console.error('Create sous-categorie error:', error);
    return NextResponse.json({ error: 'Erreur interne.' }, { status: 500 });
  }
}
