'use client';

import { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { Produit } from '@prisma/client';

interface JointsPageClientProps {
  produits: Produit[];
}

export default function JointsFrigidairesClient({ produits }: JointsPageClientProps) {
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setSuccess('');
    setError('');

    const form = e.currentTarget;
    const formData = new FormData(form);

    const nom = formData.get('nom') as string;
    const email = formData.get('email') as string;
    const telephone = formData.get('telephone') as string;
    const dimensions = formData.get('dimensions') as string;
    const msg = formData.get('message') as string;
    const full_message = dimensions ? `Dimensions demandées : ${dimensions}\n\n${msg}` : msg;

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nom, email, telephone, sujet: 'Joints sur mesure', message: full_message, produit_ref: dimensions }),
      });
      if (res.ok) {
        setSuccess('Votre demande a bien été envoyée ! Nous vous répondrons dans les 2h ouvrables.');
        form.reset();
      } else {
        setError("Erreur lors de l'envoi. Veuillez réessayer.");
      }
    } catch {
      setError("Erreur lors de l'envoi. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Header />
      <main>
        {/* Page Banner */}
        <section className="page-banner" aria-label="Joints réfrigérateur sur mesure">
          <div className="container">
            <nav className="breadcrumb" aria-label="Fil d'Ariane">
              <Link href="/">Accueil</Link>
              <i className="fa-solid fa-chevron-right"></i>
              <span>Joints Réfrigérateur</span>
            </nav>
            <h1><i className="fa-solid fa-ring"></i> Joints Réfrigérateur</h1>
            <p>Service sur mesure · PVC haute qualité · Tous profils disponibles</p>
          </div>
        </section>


        {/* Produits en stock */}
        {produits.length > 0 && (
          <section className="section" aria-label="Joints réfrigérateur en stock">
            <div className="container">
              <div className="section-header animate-fade-up">
                <span className="section-tag">Disponible immédiatement</span>
                <h2 className="section-title">Joints <span>En Stock</span></h2>
                <div className="divider"></div>
              </div>
              <div className="product-grid">
                {produits.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Formulaire devis joint sur mesure */}
        <section className="section" style={{ background: 'var(--bg-light)' }} id="devis-joints" aria-label="Formulaire de devis joint sur mesure">
          <div className="container" style={{ maxWidth: 800 }}>
            <div className="section-header animate-fade-up" style={{ textAlign: 'left', marginBottom: 36 }}>
              <span className="section-tag">Devis Gratuit</span>
              <h2 className="section-title">Commander un Joint <span>Sur Mesure</span></h2>
              <p className="section-subtitle" style={{ margin: 0 }}>
                Remplissez le formulaire ci-dessous avec les dimensions de votre joint original. Nous vous rappelons pour confirmer et vous donner le tarif.
              </p>
            </div>

            {success && <div className="alert alert-success" data-dismiss="6000"><i className="fa-solid fa-check-circle"></i> {success}</div>}
            {error && <div className="alert alert-error"><i className="fa-solid fa-triangle-exclamation"></i> {error}</div>}

            <div className="form-card animate-fade-up">
              <form onSubmit={handleSubmit} id="jointsForm">
                <input type="hidden" name="source" value="joints_form" />
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="j-nom">Nom complet <span className="req">*</span></label>
                    <input type="text" className="form-control" id="j-nom" name="nom" required placeholder="Ex : Ahmed Ben Ali" />
                  </div>
                  <div className="form-group">
                    <label htmlFor="j-tel">Téléphone <span className="req">*</span></label>
                    <input type="tel" className="form-control" id="j-tel" name="telephone" required placeholder="+216 xx xxx xxx" />
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="j-email">Email <span className="req">*</span></label>
                  <input type="email" className="form-control" id="j-email" name="email" required placeholder="votre@email.tn" />
                </div>
                <div className="form-group">
                  <label htmlFor="j-dimensions">Dimensions du joint (Largeur × Hauteur en cm)</label>
                  <input type="text" className="form-control" id="j-dimensions" name="dimensions" placeholder="Ex : 55 × 142 cm" />
                </div>
                <div className="form-group">
                  <label htmlFor="j-message">Description &amp; précisions <span className="req">*</span></label>
                  <textarea className="form-control" id="j-message" name="message" required
                    placeholder="Marque et modèle de votre réfrigérateur, profil du joint, couleur souhaitée, quantité..."></textarea>
                </div>
                <button type="submit" className="btn btn-primary btn-lg" id="joints-submit-btn" disabled={loading}>
                  <i className="fa-solid fa-paper-plane"></i> {loading ? 'Envoi...' : 'Envoyer ma demande'}
                </button>
              </form>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
