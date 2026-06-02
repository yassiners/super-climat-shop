import { PrismaClient, Categorie } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Démarrage du seed...');

  // ─── Admin ────────────────────────────────────────────────────────────────
  const hashedPassword = await bcrypt.hash('admin123', 12);
  const admin = await prisma.admin.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      password: hashedPassword,
    },
  });
  console.log(`✅ Admin créé : ${admin.username} (mot de passe : admin123)`);

  // ─── Produits ─────────────────────────────────────────────────────────────
  const produits = [
    // PIÈCES DE RECHANGE — Lave-linge
    { nom: 'Pompe de vidange Lave-linge Samsung', categorie: Categorie.pieces_rechange, sous_categorie: 'lave_linge', description: 'Pompe de vidange compatible Samsung WF séries. Tension 220V, débit 13 L/min. Garantie 6 mois.', prix: 35.00 },
    { nom: 'Résistance chauffante Lave-linge Ariston', categorie: Categorie.pieces_rechange, sous_categorie: 'lave_linge', description: 'Résistance 1950 W pour Ariston/Indesit AVSD, WMG, WMF. Remplacement facile.', prix: 22.50 },
    { nom: 'Balai de charbon moteur universel', categorie: Categorie.pieces_rechange, sous_categorie: 'lave_linge', description: 'Jeu de 2 balais de charbon 6×9mm pour moteurs de lave-linge universels. Haute durabilité.', prix: 8.00 },
    { nom: 'Joint de tambour lave-linge Bosch', categorie: Categorie.pieces_rechange, sous_categorie: 'lave_linge', description: 'Joint de tambour avant pour Bosch/Siemens 60cm. Feutre haute densité. Montage facile.', prix: 18.00 },
    // PIÈCES DE RECHANGE — Réfrigérateurs
    { nom: 'Thermostat réfrigérateur Beko No-Frost', categorie: Categorie.pieces_rechange, sous_categorie: 'refrigerateurs', description: 'Thermostat réglable -18°C à +8°C pour Beko No-Frost. Connexion universelle.', prix: 18.00 },
    { nom: 'Carte électronique contrôleur Whirlpool', categorie: Categorie.pieces_rechange, sous_categorie: 'refrigerateurs', description: 'Module électronique de commande pour réfrigérateurs Whirlpool. 100% original. Garantie 3 mois.', prix: 95.00 },
    { nom: 'Ventilateur évaporateur réfrigérateur', categorie: Categorie.pieces_rechange, sous_categorie: 'refrigerateurs', description: 'Moteur + hélice pour compartiment congélateur. Silencieux, 12V DC. Compatible multi-marques.', prix: 32.00 },
    { nom: 'Thermostat capillaire réfrigérateur K59', categorie: Categorie.pieces_rechange, sous_categorie: 'refrigerateurs', description: 'Thermostat K59 bimétal avec capillaire 1.20m. Réglage ≈ 4°C. Large compatibilité.', prix: 14.50 },
    // PIÈCES DE RECHANGE — Climatiseurs
    { nom: 'Moteur ventilateur split 12000BTU', categorie: Categorie.pieces_rechange, sous_categorie: 'climatiseurs', description: 'Moteur de ventilateur unité intérieure split 12000 BTU. 25W, 220V. Compatible universellement.', prix: 45.00 },
    { nom: 'Télécommande universelle climatiseur', categorie: Categorie.pieces_rechange, sous_categorie: 'climatiseurs', description: 'Compatible +2000 modèles. Pré-programmée. Rétroéclairage. Piles incluses.', prix: 28.00 },
    { nom: 'Carte PCB unité intérieure Gree', categorie: Categorie.pieces_rechange, sous_categorie: 'climatiseurs', description: 'Carte électronique principale pour unités intérieures Gree 9000–24000 BTU. Garantie 6 mois.', prix: 120.00 },
    { nom: 'Capteur température ambiant NTC', categorie: Categorie.pieces_rechange, sous_categorie: 'climatiseurs', description: 'Sonde NTC 10KΩ pour climatiseurs. Longueur câble 1m. Résistance ±1%.', prix: 7.50 },
    // CHAUD & FROID — Compresseurs
    { nom: 'Compresseur R134a 1/4HP Embraco', categorie: Categorie.chaud_froid, sous_categorie: 'compresseurs', description: 'Compresseur hermétique Embraco pour réfrigérateur domestique. R134a, 1/4 HP, 220V-50Hz. Idéal 150–250L.', prix: 285.00 },
    { nom: 'Compresseur R410a 9000BTU Highly', categorie: Categorie.chaud_froid, sous_categorie: 'compresseurs', description: 'Compresseur rotatif Highly pour climatiseurs R410a. 9000 BTU, 220V monophasé. Très silencieux.', prix: 420.00 },
    { nom: 'Compresseur R22 1/3HP Tecumseh', categorie: Categorie.chaud_froid, sous_categorie: 'compresseurs', description: 'Compresseur hermétique Tecumseh R22 1/3 HP. Pour chambres froides -20°C. Robuste.', prix: 350.00 },
    { nom: 'Compresseur scroll R407C 12000BTU', categorie: Categorie.chaud_froid, sous_categorie: 'compresseurs', description: 'Compresseur scroll pour groupes de climatisation commerciale. R407C, triphasé 380V.', prix: 780.00 },
    // CHAUD & FROID — Gaz réfrigérant
    { nom: 'Gaz réfrigérant R22 bouteille 13.6kg', categorie: Categorie.chaud_froid, sous_categorie: 'gaz_refrigerant', description: 'Réfrigérant R22 13.6 kg. Pour systèmes anciens. Pureté 99.9%. Bouteille rechargeable.', prix: 120.00 },
    { nom: 'Gaz réfrigérant R410a bouteille 11.3kg', categorie: Categorie.chaud_froid, sous_categorie: 'gaz_refrigerant', description: 'R410a 11.3 kg. Sans chlore, HFC. Pour climatiseurs modernes. Conforme normes européennes.', prix: 145.00 },
    { nom: 'Gaz réfrigérant R134a bouteille 12kg', categorie: Categorie.chaud_froid, sous_categorie: 'gaz_refrigerant', description: 'R134a 12 kg pour réfrigérateurs et congélateurs domestiques. Zéro ODP.', prix: 98.00 },
    { nom: 'Gaz réfrigérant R600a (Isobutane) 6kg', categorie: Categorie.chaud_froid, sous_categorie: 'gaz_refrigerant', description: 'R600a naturel 6 kg pour réfrigérateurs domestiques modernes. Très basse consommation.', prix: 75.00 },
    // CHAUD & FROID — Thermostats
    { nom: 'Thermostat capillaire T85 universel', categorie: Categorie.chaud_froid, sous_categorie: 'thermostats', description: 'Thermostat capillaire réglable -30°C à +30°C. Connexion 2 fils. Congélateurs & chambres froides.', prix: 25.00 },
    { nom: 'Pressostat haute/basse pression', categorie: Categorie.chaud_froid, sous_categorie: 'thermostats', description: 'Pressostat dual HP/BP. Haute 28 bar, Basse 2 bar. Réarmement manuel. Climatisation pro.', prix: 42.00 },
    { nom: 'Thermostat électronique digital STC-1000', categorie: Categorie.chaud_froid, sous_categorie: 'thermostats', description: 'Contrôleur temp. -50°C à +99°C, sonde NTC incluse. Sortie relais 10A. Affichage LED.', prix: 35.00 },
    // JOINTS FRIGIDAIRES
    { nom: 'Joint magnétique réfrigérateur 55×142 cm', categorie: Categorie.joints_frigidaires, sous_categorie: 'joint_sur_mesure', description: 'Joint porte réfrigérateur PVC souple haute qualité. Couleur blanc. Découpe sur mesure possible.', prix: 45.00 },
    { nom: 'Joint congélateur armoire 60×150 cm', categorie: Categorie.joints_frigidaires, sous_categorie: 'joint_sur_mesure', description: 'Joint magnétique congélateur armoire. Grande adhérence, résistance -40°C. Livraison sur mesure.', prix: 55.00 },
    { nom: 'Joint vitrine réfrigérée super marché', categorie: Categorie.joints_frigidaires, sous_categorie: 'joint_sur_mesure', description: 'Joint panoramique pour vitrines réfrigérées commerciales. Profil renforcé. Sur mesure.', prix: 85.00 },
    { nom: 'Joint porte four universel Ariston', categorie: Categorie.joints_frigidaires, sous_categorie: 'joint_universel', description: 'Joint porte four fibre de verre. Résistance jusqu\'à 300°C. Compatible Ariston, Indesit, Candy.', prix: 28.00 },
    { nom: 'Kit joint complet réfrigérateur double porte', categorie: Categorie.joints_frigidaires, sous_categorie: 'joint_universel', description: 'Kit complet 2 joints (réfrigérateur + congélateur) pour appareils double porte. Blanc, semi-rigide.', prix: 70.00 },
  ];

  // Delete existing products and re-seed (idempotent)
  const existingCount = await prisma.produit.count();
  if (existingCount === 0) {
    for (const p of produits) {
      await prisma.produit.create({ data: p });
    }
    console.log(`✅ ${produits.length} produits insérés`);
  } else {
    console.log(`ℹ️  ${existingCount} produits déjà présents — seed ignoré`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
