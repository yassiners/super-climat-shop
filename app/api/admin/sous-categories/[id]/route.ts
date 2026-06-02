import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Categorie } from '@prisma/client';

// PUT update sous-categorie
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });

  try {
    const id = parseInt(params.id);
    if (isNaN(id)) return NextResponse.json({ error: 'ID invalide.' }, { status: 400 });

    const existing = await (prisma as any).sousCategorie.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ error: 'Sous-catégorie introuvable.' }, { status: 404 });

    const body = await request.json();
    const { slug, label, categorie, icon } = body;

    if (!slug || !label || !categorie || !Object.values(Categorie).includes(categorie as Categorie)) {
      return NextResponse.json({ error: 'Données invalides.' }, { status: 400 });
    }

    if (!/^[a-z0-9_]+$/.test(slug)) {
      return NextResponse.json({ error: 'Le slug ne doit contenir que des lettres minuscules, chiffres et underscores.' }, { status: 400 });
    }

    // Check slug uniqueness (excluding current)
    const duplicate = await (prisma as any).sousCategorie.findFirst({
      where: { slug, id: { not: id } },
    });
    if (duplicate) {
      return NextResponse.json({ error: 'Ce slug existe déjà.' }, { status: 409 });
    }

    const sc = await (prisma as any).sousCategorie.update({
      where: { id },
      data: {
        slug,
        label,
        categorie: categorie as Categorie,
        icon: icon || null,
      },
    });

    return NextResponse.json({ success: true, sousCategorie: sc });
  } catch (error) {
    console.error('Update sous-categorie error:', error);
    return NextResponse.json({ error: 'Erreur interne.' }, { status: 500 });
  }
}

// DELETE sous-categorie
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });

  try {
    const id = parseInt(params.id);
    if (isNaN(id)) return NextResponse.json({ error: 'ID invalide.' }, { status: 400 });

    const existing = await (prisma as any).sousCategorie.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ error: 'Sous-catégorie introuvable.' }, { status: 404 });

    await (prisma as any).sousCategorie.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete sous-categorie error:', error);
    return NextResponse.json({ error: 'Erreur interne.' }, { status: 500 });
  }
}
