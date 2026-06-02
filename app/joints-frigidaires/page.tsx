import { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import JointsFrigidairesClient from './JointsClient';

// Revalidate every 60 seconds — serves cached HTML instantly
export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Joints Réfrigérateur — Super Climat Shop',
  description:
    'Joints réfrigérateur sur mesure à Sousse — joints magnétiques, PVC haute qualité pour réfrigérateurs, congélateurs, vitrines réfrigérées. Découpe personnalisée.',
};

export default async function JointsFrigidairesPage() {
  const produits = await prisma.produit.findMany({
    where: { categorie: 'joints_frigidaires' },
    orderBy: { date_ajout: 'desc' },
  });

  return <JointsFrigidairesClient produits={produits} />;
}
