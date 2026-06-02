import { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { prisma } from '@/lib/prisma';

// Revalidate every 60 seconds — serves cached HTML instantly
export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Accueil — Super Climat Shop',
  description:
    'Super Climat Shop à Sousse — spécialiste pièces électroménager, équipements chaud & froid, joints réfrigérateur sur mesure. Qualité & expertise de 20 ans et depuis 2006.',
};

async function getFeaturedProducts() {
  try {
    const categories = ['pieces_rechange', 'chaud_froid', 'joints_frigidaires'] as const;
    const results = await Promise.all(
      categories.map((cat) =>
        prisma.produit.findMany({
          where: { categorie: cat },
          orderBy: { date_ajout: 'desc' },
          take: 2,
        })
      )
    );
    return results.flat();
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const featured = await getFeaturedProducts();

  return (
    <>
      <Header />
      <main>

        {/* ======================================================
            HERO
        ====================================================== */}
        <section className="hero" id="hero" aria-label="Bannière principale">
          <div className="hero-bg-circle-1"></div>
          <div className="hero-bg-circle-2"></div>
          <div className="container">
            <div className="hero-grid">
              {/* Content */}
              <div className="hero-content">
                <div className="hero-badge">
                  <i className="fa-solid fa-award"></i>
                  Votre spécialiste à Sousse depuis 2006
                </div>
                <h1 className="hero-title">
                  Pièces &amp; Équipements<br />
                  <span className="accent-word">Froid &amp; Électroménager</span>
                </h1>
                <p className="hero-subtitle">
                  Super Climat Shop — votre partenaire de confiance pour les pièces électroménager, équipements chaud &amp; froid, et joints réfrigérateur sur mesure.
                </p>
                <div className="hero-actions">
                  <Link href="/pieces-rechange" className="btn btn-white" id="hero-catalog-btn">
                    <i className="fa-solid fa-grip"></i> Voir le Catalogue
                  </Link>
                  <Link href="/contact" className="btn btn-outline-white" id="hero-devis-btn">
                    <i className="fa-solid fa-paper-plane"></i> Demander un Devis
                  </Link>
                </div>
                <div className="hero-stats">
                  <div>
                    <div className="hero-stat-num"><span className="counter" data-target="500" data-suffix="+">500+</span></div>
                    <div className="hero-stat-label">Produits en Stock</div>
                  </div>
                  <div>
                    <div className="hero-stat-num"><span className="counter" data-target="20" data-suffix=" ans">20 ans</span></div>
                    <div className="hero-stat-label">D&apos;expérience</div>
                  </div>
                  <div>
                    <div className="hero-stat-num"><span className="counter" data-target="2000" data-suffix="+">2000+</span></div>
                    <div className="hero-stat-label">Clients Satisfaits</div>
                  </div>
                </div>
              </div>

              {/* Floating card */}
              <div>
                <div className="hero-card">
                  <div className="hero-card-title">Nos 3 Pôles d&apos;activité</div>
                  <div className="hero-card-item">
                    <div className="hero-card-icon"><i className="fa-solid fa-gear"></i></div>
                    <div>
                      <div className="hero-card-text">Pièces électroménager</div>
                    </div>
                  </div>
                  <div className="hero-card-item">
                    <div className="hero-card-icon"><i className="fa-solid fa-temperature-arrow-down"></i></div>
                    <div>
                      <div className="hero-card-text">Équipements Chaud &amp; Froid</div>
                      <div className="hero-card-sub">Compresseurs · Gaz · Thermostats</div>
                    </div>
                  </div>
                  <div className="hero-card-item">
                    <div className="hero-card-icon"><i className="fa-solid fa-ring"></i></div>
                    <div>
                      <div className="hero-card-text">Joints Réfrigérateur</div>
                      <div className="hero-card-sub">Sur mesure · Tous profils</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ======================================================
            3 PÔLES D'ACTIVITÉ
        ====================================================== */}
        <section className="section" id="activites" aria-label="Nos activités">
          <div className="container">
            <div className="section-header animate-fade-up">
              <span className="section-tag">Ce que nous faisons</span>
              <h2 className="section-title">Nos <span>3 Pôles</span> d&apos;Activité</h2>
              <p className="section-subtitle">Tout ce dont vous avez besoin pour l&apos;entretien et la réparation de vos appareils électroménagers et systèmes de climatisation.</p>
              <div className="divider"></div>
            </div>
            <div className="poles-grid">
              <div className="pole-card animate-fade-up animate-delay-1">
                <div className="pole-icon blue"><i className="fa-solid fa-gear"></i></div>
                <h3>Pièces électroménager</h3>
                <p>Pièces de rechange et accessoires pour vos appareils électroménagers. Marques disponibles : Braun, Moulinex.</p>
                <Link href="/pieces-rechange" className="pole-link" id="pole-pieces-link">
                  Explorer le catalogue <i className="fa-solid fa-arrow-right"></i>
                </Link>
              </div>
              <div className="pole-card animate-fade-up animate-delay-2">
                <div className="pole-icon red"><i className="fa-solid fa-temperature-arrow-down"></i></div>
                <h3>Chaud &amp; Froid</h3>
                <p>Compresseurs hermétiques, gaz réfrigérants (R22, R134a, R410a, R600a), thermostats capillaires et pressostats pour réfrigération commerciale et domestique.</p>
                <Link href="/chaud-froid" className="pole-link" id="pole-cf-link">
                  Voir les équipements <i className="fa-solid fa-arrow-right"></i>
                </Link>
              </div>
              <div className="pole-card animate-fade-up animate-delay-3">
                <div className="pole-icon green"><i className="fa-solid fa-ring"></i></div>
                <h3>Joints Réfrigérateur</h3>
                <p>Joints magnétiques de porte sur mesure pour réfrigérateurs, congélateurs et vitrines réfrigérées. PVC haute qualité, tous profils disponibles, découpe personnalisée.</p>
                <Link href="/joints-frigidaires" className="pole-link" id="pole-joints-link">
                  Service sur mesure <i className="fa-solid fa-arrow-right"></i>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ======================================================
            PRODUITS VEDETTES
        ====================================================== */}
        {featured.length > 0 && (
          <section className="section featured-section" id="produits-vedettes" aria-label="Produits vedettes">
            <div className="container">
              <div className="section-header animate-fade-up">
                <span className="section-tag">Sélection du moment</span>
                <h2 className="section-title">Produits <span>Vedettes</span></h2>
                <p className="section-subtitle">Découvrez notre sélection de produits les plus demandés, disponibles immédiatement en stock.</p>
                <div className="divider"></div>
              </div>
              <div className="product-grid mb-32">
                {featured.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
              <div style={{ textAlign: 'center' }}>
                <Link href="/pieces-rechange" className="btn btn-primary" id="all-products-btn">
                  <i className="fa-solid fa-grip"></i> Voir tout le catalogue
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* ======================================================
            POURQUOI NOUS CHOISIR
        ====================================================== */}
        <section className="section" id="avantages" style={{ background: 'var(--bg-light)' }} aria-label="Nos avantages">
          <div className="container">
            <div className="section-header animate-fade-up">
              <span className="section-tag">Nos engagements</span>
              <h2 className="section-title">Pourquoi choisir <span>SCS</span> ?</h2>
              <div className="divider"></div>
            </div>
            <div className="why-grid">
              <div className="why-card animate-fade-up animate-delay-1">
                <div className="why-icon"><i className="fa-solid fa-shield-check"></i></div>
                <h4>Qualité Garantie</h4>
                <p>Pièces d&apos;origine ou équivalent OEM. Chaque produit est vérifié avant expédition.</p>
              </div>
              <div className="why-card animate-fade-up animate-delay-3">
                <div className="why-icon"><i className="fa-solid fa-screwdriver-wrench"></i></div>
                <h4>Expertise Technique</h4>
                <p>Notre équipe vous conseille sur les références compatibles avec vos appareils.</p>
              </div>
              <div className="why-card animate-fade-up animate-delay-4">
                <div className="why-icon"><i className="fa-solid fa-ruler-combined"></i></div>
                <h4>Sur Mesure</h4>
                <p>Joints réfrigérateur découpés à vos dimensions exactes. Profils et couleurs au choix.</p>
              </div>
            </div>
          </div>
        </section>

        {/* ======================================================
            CTA
        ====================================================== */}
        <section className="cta-section" aria-label="Appel à l'action">
          <div className="container">
            <h2>Besoin d&apos;un devis personnalisé ?</h2>
            <p>Contactez-nous dès aujourd&apos;hui et obtenez une réponse dans les 2 heures ouvrables.</p>
            <div className="actions">
              <Link href="/contact" className="btn btn-white" id="cta-contact-btn">
                <i className="fa-solid fa-envelope"></i> Nous contacter
              </Link>
              <a href="tel:+21673202651" className="btn btn-outline-white" id="cta-phone-btn">
                <i className="fa-solid fa-phone"></i> Appeler maintenant
              </a>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
