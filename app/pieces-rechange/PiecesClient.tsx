'use client';

import { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { Produit } from '@prisma/client';

interface SousCategorieRow {
  id: number;
  slug: string;
  label: string;
  categorie: string;
  icon: string | null;
}

interface PiecesClientProps {
  produits: Produit[];
  sousCategories: SousCategorieRow[];
}

const defaultIcon = 'fa-solid fa-tag';

export default function PiecesClient({ produits, sousCategories }: PiecesClientProps) {
  const [activeCat, setActiveCat] = useState<string>('all');

  const filtered = activeCat === 'all'
    ? produits
    : produits.filter((p) => p.sous_categorie === activeCat);

  return (
    <>
      <Header />
      <main>
        {/* Page Banner */}
        <section className="page-banner" aria-label="Pièces électroménager">
          <div className="container">
            <nav className="breadcrumb" aria-label="Fil d'Ariane">
              <Link href="/">Accueil</Link>
              <i className="fa-solid fa-chevron-right"></i>
              <span>Pièces Électroménager</span>
            </nav>
            <h1><i className="fa-solid fa-gear"></i> Pièces Électroménager</h1>
          </div>
        </section>

        <section className="section" aria-label="Catalogue pièces électroménager">
          <div className="container">
            {/* Filtres */}
            <div className="filter-tabs" role="tablist" aria-label="Filtrer par appareil">
              <button
                className={`filter-tab ${activeCat === 'all' ? 'active' : ''}`}
                id="tab-all"
                onClick={() => setActiveCat('all')}
              >
                <i className="fa-solid fa-grip"></i> Tout voir
              </button>
              {sousCategories.map((sc: SousCategorieRow) => (
                <button
                  key={sc.slug}
                  className={`filter-tab ${activeCat === sc.slug ? 'active' : ''}`}
                  id={`tab-${sc.slug}`}
                  onClick={() => setActiveCat(sc.slug)}
                >
                  <i className={sc.icon || defaultIcon}></i> {sc.label}
                </button>
              ))}
            </div>

            {/* Grille produits */}
            {filtered.length === 0 ? (
              <div className="empty-state" id="emptyState">
                <i className="fa-solid fa-box-open"></i>
                <p>Aucun produit trouvé dans cette catégorie.</p>
              </div>
            ) : (
              <div className="product-grid" id="productGrid">
                {filtered.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* CTA */}
        <section className="cta-section" aria-label="Appel à l'action">
          <div className="container">
            <h2>Vous ne trouvez pas la pièce ?</h2>
            <p>Contactez-nous avec la référence de votre appareil et nous vous trouverons la pièce compatible.</p>
            <div className="actions">
              <Link href="/contact" className="btn btn-white" id="pieces-cta-btn">
                <i className="fa-solid fa-envelope"></i> Demander une pièce spécifique
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
