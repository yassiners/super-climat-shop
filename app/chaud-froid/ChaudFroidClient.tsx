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

interface ChaudFroidClientProps {
  produits: Produit[];
  sousCategories: SousCategorieRow[];
}

const defaultIcon = 'fa-solid fa-tag';

export default function ChaudFroidClient({ produits, sousCategories }: ChaudFroidClientProps) {
  const [activeCat, setActiveCat] = useState<string>('all');

  const filtered = activeCat === 'all'
    ? produits
    : produits.filter((p) => p.sous_categorie === activeCat);

  return (
    <>
      <Header />
      <main>
        {/* Page Banner */}
        <section className="page-banner" aria-label="Équipements chaud et froid">
          <div className="container">
            <nav className="breadcrumb" aria-label="Fil d'Ariane">
              <Link href="/">Accueil</Link>
              <i className="fa-solid fa-chevron-right"></i>
              <span>Chaud &amp; Froid</span>
            </nav>
            <h1><i className="fa-solid fa-temperature-arrow-down"></i> Chaud &amp; Froid</h1>
            <p>Compresseurs · Gaz Réfrigérants · Thermostats &amp; Pressostats — usage professionnel &amp; domestique</p>
          </div>
        </section>

        {/* Catalogue */}
        <section className="section" aria-label="Catalogue chaud et froid">
          <div className="container">
            <div className="filter-tabs" role="tablist">
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

            {filtered.length === 0 ? (
              <div className="empty-state">
                <i className="fa-solid fa-box-open"></i>
                <p>Aucun produit disponible.</p>
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
            <h2>Besoin d&apos;un équipement spécifique ?</h2>
            <p>Nous pouvons commander tout compresseur ou réfrigérant sur devis. Réponse sous 24h.</p>
            <div className="actions">
              <Link href="/contact" className="btn btn-white" id="cf-cta-btn">
                <i className="fa-solid fa-envelope"></i> Demander un devis
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
