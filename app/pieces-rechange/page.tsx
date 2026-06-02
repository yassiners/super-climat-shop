import { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import PiecesClient from './PiecesClient';

interface SousCategorieRow {
  id: number;
  slug: string;
  label: string;
  categorie: string;
  icon: string | null;
}

// Fully static — rebuilt every 60 seconds in the background
export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Pièces Électroménager — Super Climat Shop',
  description:
    'Catalogue de pièces électroménager à Sousse. Pièces de rechange et accessoires pour vos petits appareils. Marques exclusives : Braun, Moulinex.',
};

export default async function PiecesRechangePage() {
  // Fetch ALL data at build time — no per-request DB queries
  const [sousCategories, produits] = await Promise.all([
    (prisma as any).sousCategorie.findMany({
      where: { categorie: 'pieces_rechange' },
      orderBy: { label: 'asc' },
    }) as Promise<SousCategorieRow[]>,
    prisma.produit.findMany({
      where: { categorie: 'pieces_rechange' },
      orderBy: { date_ajout: 'desc' },
    }),
  ]);

  return <PiecesClient produits={produits} sousCategories={sousCategories} />;
}
