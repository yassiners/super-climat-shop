import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const sousCategories = [
    // Pièces de Rechange
    { slug: 'lave_linge',     label: 'Lave-linge',      categorie: 'pieces_rechange' as const, icon: 'fa-solid fa-shirt' },
    { slug: 'refrigerateurs', label: 'Réfrigérateurs',   categorie: 'pieces_rechange' as const, icon: 'fa-solid fa-box' },
    { slug: 'climatiseurs',   label: 'Climatiseurs',     categorie: 'pieces_rechange' as const, icon: 'fa-solid fa-wind' },
    // Chaud & Froid
    { slug: 'compresseurs',    label: 'Compresseurs',     categorie: 'chaud_froid' as const, icon: 'fa-solid fa-circle-nodes' },
    { slug: 'gaz_refrigerant', label: 'Gaz Réfrigérant',  categorie: 'chaud_froid' as const, icon: 'fa-solid fa-flask' },
    { slug: 'thermostats',     label: 'Thermostats',      categorie: 'chaud_froid' as const, icon: 'fa-solid fa-gauge' },
    // Joints Réfrigérateur
    { slug: 'joint_sur_mesure', label: 'Sur mesure',  categorie: 'joints_frigidaires' as const, icon: 'fa-solid fa-ruler-combined' },
    { slug: 'joint_universel',  label: 'Universel',   categorie: 'joints_frigidaires' as const, icon: 'fa-solid fa-circle-dot' },
  ];

  for (const sc of sousCategories) {
    await (prisma as any).sousCategorie.upsert({
      where: { slug: sc.slug },
      update: { label: sc.label, categorie: sc.categorie, icon: sc.icon },
      create: sc,
    });
  }

  console.log(`✅ Seeded ${sousCategories.length} sous-catégories.`);
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
