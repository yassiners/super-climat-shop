import { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import ChaudFroidClient from './ChaudFroidClient';

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
  title: 'Chaud & Froid — Super Climat Shop',
  description:
    'Équipements chaud & froid à Sousse — compresseurs hermétiques, gaz réfrigérants R22 R134a R410a, thermostats capillaires, pressostats. Vente professionnelle.',
};

export default async function ChaudFroidPage() {
  // Fetch ALL data at build time — no per-request DB queries
  const [sousCategories, produits] = await Promise.all([
    (prisma as any).sousCategorie.findMany({
      where: { categorie: 'chaud_froid' },
      orderBy: { label: 'asc' },
    }) as Promise<SousCategorieRow[]>,
    prisma.produit.findMany({
      where: { categorie: 'chaud_froid' },
      orderBy: { date_ajout: 'desc' },
    }),
  ]);

  return <ChaudFroidClient produits={produits} sousCategories={sousCategories} />;
}
