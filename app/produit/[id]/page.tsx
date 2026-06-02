import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

type Props = { params: { id: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const produit = await prisma.produit.findUnique({ where: { id: parseInt(params.id) } });
  if (!produit) return { title: 'Produit introuvable — SCS' };
  return {
    title: `${produit.nom} — Super Climat Shop`,
    description: produit.description?.substring(0, 160) ?? '',
  };
}

const catLabels: Record<string, string> = {
  pieces_rechange: 'Pièces Électroménager',
  chaud_froid: 'Chaud & Froid',
  joints_frigidaires: 'Joints Réfrigérateur',
};
const catUrls: Record<string, string> = {
  pieces_rechange: '/pieces-rechange',
  chaud_froid: '/chaud-froid',
  joints_frigidaires: '/joints-frigidaires',
};
const catIcons: Record<string, string> = {
  pieces_rechange: 'fa-gear',
  chaud_froid: 'fa-snowflake',
  joints_frigidaires: 'fa-ring',
};

function formatPrice(price: unknown): string {
  const num = typeof price === 'object' && price !== null
    ? parseFloat(price.toString())
    : Number(price);
  if (num === 0) return 'Sur devis';
  return num.toLocaleString('fr-TN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export default async function ProduitPage({ params }: Props) {
  const id = parseInt(params.id);
  if (!id) notFound();

  const produit = await prisma.produit.findUnique({ where: { id } });
  if (!produit) notFound();

  const catLabel = catLabels[produit.categorie] ?? produit.categorie;
  const catUrl = catUrls[produit.categorie] ?? '/';
  const icon = catIcons[produit.categorie] ?? 'fa-box';

  const dateStr = produit.date_ajout.toLocaleDateString('fr-TN', {
    day: '2-digit', month: '2-digit', year: 'numeric'
  });

  return (
    <>
      <Header />
      <main>
        {/* Breadcrumb */}
        <section style={{ marginTop: 72, background: 'var(--bg-light)', padding: '24px 0' }}>
          <div className="container">
            <nav className="breadcrumb" aria-label="Fil d'Ariane" style={{ color: 'var(--text-muted)' }}>
              <Link href="/" style={{ color: 'var(--text-muted)' }}>Accueil</Link>
              <i className="fa-solid fa-chevron-right"></i>
              <Link href={catUrl} style={{ color: 'var(--text-muted)' }}>{catLabel}</Link>
              <i className="fa-solid fa-chevron-right"></i>
              <span>{produit.nom}</span>
            </nav>
          </div>
        </section>

        {/* Product detail */}
        <section className="section-sm" aria-label="Détail produit">
          <div className="container">
            <div className="product-detail">
              {/* Image */}
              <div className="product-detail-img">
                {produit.image ? (
                  <Image
                    src={produit.image}
                    alt={produit.nom}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    style={{ objectFit: 'contain' }}
                    priority
                  />
                ) : (
                  <div className="product-detail-img-placeholder">
                    <i className={`fa-solid ${icon}`}></i>
                    <p style={{ fontSize: '.8rem', color: 'var(--text-muted)', marginTop: 12 }}>Image non disponible</p>
                  </div>
                )}
              </div>

              {/* Info */}
              <div>
                <div className="product-detail-cat">
                  <i className="fa-solid fa-tag"></i>{' '}
                  {catLabel}
                  {produit.sous_categorie && (
                    <> · {produit.sous_categorie.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}</>
                  )}
                </div>
                <h1>{produit.nom}</h1>
                <div className="product-detail-price">
                  {formatPrice(produit.prix)} {Number(produit.prix) !== 0 && <span style={{ fontSize: '1rem', fontWeight: 500, color: 'var(--text-muted)' }}>DT</span>}
                </div>
                <p className="product-detail-desc">
                  {(produit.description ?? '').split('\n').map((line, i) => (
                    <span key={i}>{line}<br /></span>
                  ))}
                </p>

                <div className="product-detail-actions">
                  <button className="btn btn-primary btn-quote" id="produit-devis-btn" data-product={produit.nom}>
                    <i className="fa-solid fa-paper-plane"></i> Demander un Devis
                  </button>
                  <Link href="/contact" className="btn btn-outline" id="produit-contact-btn">
                    <i className="fa-solid fa-phone"></i> Nous contacter
                  </Link>
                </div>

                <div className="product-meta">
                  <div className="product-meta-item">
                    <i className="fa-solid fa-calendar-alt"></i>
                    <span>Ajouté le {dateStr}</span>
                  </div>
                  <div className="product-meta-item">
                    <i className="fa-solid fa-shield-check"></i>
                    <span>Produit vérifié — Qualité garantie</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Back link */}
            <div style={{ marginTop: 48 }}>
              <Link href={catUrl} className="btn btn-outline" id="produit-retour-btn">
                <i className="fa-solid fa-arrow-left"></i> Retour au catalogue
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
