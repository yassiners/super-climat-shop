'use client';

import { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function ContactClient() {
  const [success, setSuccess] = useState('');
  const [error,   setError]   = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setSuccess('');
    setError('');

    const formData = new FormData(e.currentTarget);
    const body = {
      nom:        formData.get('nom'),
      email:      formData.get('email'),
      telephone:  formData.get('telephone'),
      sujet:      formData.get('sujet'),
      message:    formData.get('message'),
      produit_ref: formData.get('produit_ref'),
    };

    if (!body.nom || !body.email || !body.message) {
      setError('Veuillez remplir tous les champs obligatoires (nom, email, message).');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        setSuccess('Message envoyé avec succès ! Nous vous répondrons dans les 24h ouvrables.');
        (e.target as HTMLFormElement).reset();
      } else {
        setError("Erreur lors de l'envoi. Veuillez réessayer ou nous appeler directement.");
      }
    } catch {
      setError("Erreur lors de l'envoi. Veuillez réessayer ou nous appeler directement.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Header />
      <main>
        {/* Page Banner */}
        <section className="page-banner" aria-label="Contact et devis">
          <div className="container">
            <nav className="breadcrumb" aria-label="Fil d'Ariane">
              <Link href="/">Accueil</Link>
              <i className="fa-solid fa-chevron-right"></i>
              <span>Contact &amp; Devis</span>
            </nav>
            <h1><i className="fa-solid fa-envelope"></i> Contact &amp; Devis</h1>
            <p>Nous sommes à votre disposition du lundi au samedi, de 8h à 18h.</p>
          </div>
        </section>

        <section className="section" aria-label="Formulaire de contact">
          <div className="container">
            <div className="contact-grid">

              {/* Info Card */}
              <div className="contact-info-card animate-fade-up">
                <h3>
                  <i className="fa-solid fa-headset" style={{ marginRight: 10, opacity: .8 }}></i>
                  On est là pour vous
                </h3>
                <p>
                  Envoyez-nous un message, passez au magasin, ou appelez-nous directement.
                  Notre équipe est disponible 6 jours sur 7.
                </p>

                <div className="contact-info-item">
                  <div className="contact-info-icon"><i className="fa-solid fa-location-dot"></i></div>
                  <div className="contact-info-text">
                    <h5>Adresse</h5>
                    <p>Super Climat Shop (SCS Sousse),<br />RJJJ+FMW, Bd Tahar Sfar, Sousse</p>
                  </div>
                </div>
                <div className="contact-info-item">
                  <div className="contact-info-icon"><i className="fa-solid fa-phone"></i></div>
                  <div className="contact-info-text">
                    <h5>Téléphone</h5>
                    <p>+216 73 202 651</p>
                  </div>
                </div>
                <div className="contact-info-item">
                  <div className="contact-info-icon"><i className="fa-solid fa-envelope"></i></div>
                  <div className="contact-info-text">
                    <h5>Email</h5>
                    <p>superclimatshop@gmail.com</p>
                  </div>
                </div>
                <div className="contact-info-item">
                  <div className="contact-info-icon"><i className="fa-solid fa-clock"></i></div>
                  <div className="contact-info-text">
                    <h5>Horaires</h5>
                    <p>Lun – Ven : 8h00 – 18h00<br />Sam : 8h00 – 14h00</p>
                  </div>
                </div>

                <div style={{ marginTop: 32, display: 'flex', gap: 10 }}>
                  <a href="tel:+21673202651" id="call-btn" className="btn btn-sm"
                    style={{ background: 'rgba(255,255,255,.15)', color: 'white', border: '1px solid rgba(255,255,255,.3)' }}>
                    <i className="fa-solid fa-phone"></i> Appeler
                  </a>
                </div>
              </div>

              {/* Form */}
              <div className="form-card animate-fade-up animate-delay-2">
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-dark)', marginBottom: 28 }}>
                  <i className="fa-solid fa-paper-plane" style={{ color: 'var(--primary)', marginRight: 8 }}></i>
                  Envoyer un Message
                </h3>

                {success && (
                  <div className="alert alert-success" data-dismiss="8000">
                    <i className="fa-solid fa-check-circle"></i> {success}
                  </div>
                )}
                {error && (
                  <div className="alert alert-error">
                    <i className="fa-solid fa-triangle-exclamation"></i> {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} id="contactForm" noValidate>
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="c-nom">Nom complet <span className="req">*</span></label>
                      <input type="text" className="form-control" id="c-nom" name="nom"
                        required placeholder="Ex : Mohamed Trabelsi" />
                    </div>
                    <div className="form-group">
                      <label htmlFor="c-tel">Téléphone</label>
                      <input type="tel" className="form-control" id="c-tel" name="telephone"
                        placeholder="+216 xx xxx xxx" />
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="c-email">Email <span className="req">*</span></label>
                    <input type="email" className="form-control" id="c-email" name="email"
                      required placeholder="votre@email.tn" />
                  </div>
                  <div className="form-group">
                    <label htmlFor="c-sujet">Sujet</label>
                    <select className="form-control" id="c-sujet" name="sujet">
                      <option value="">— Sélectionner un sujet —</option>
                      <option value="Devis pièces électroménager">Devis pièces électroménager</option>
                      <option value="Devis équipements froid">Devis équipements froid</option>
                      <option value="Joint réfrigérateur sur mesure">Joint réfrigérateur sur mesure</option>
                      <option value="Question technique">Question technique</option>
                      <option value="Autre">Autre</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="c-ref">Référence produit (optionnel)</label>
                    <input type="text" className="form-control" id="c-ref" name="produit_ref"
                      placeholder="Ex : Compresseur R410a 9000BTU" />
                  </div>
                  <div className="form-group">
                    <label htmlFor="c-message">Message <span className="req">*</span></label>
                    <textarea className="form-control" id="c-message" name="message" required
                      placeholder="Décrivez votre besoin, votre appareil, les dimensions…"></textarea>
                  </div>
                  <button type="submit" className="btn btn-primary btn-block btn-lg"
                    id="contact-submit-btn" disabled={loading}>
                    <i className="fa-solid fa-paper-plane"></i>{' '}
                    {loading ? 'Envoi...' : 'Envoyer le message'}
                  </button>
                </form>
              </div>
            </div>

            {/* Google Maps */}
            <div className="map-container animate-fade-up" aria-label="Carte Google Maps — Sousse">
              <iframe
                src="https://maps.google.com/maps?q=Super+Climat+Shop+(SCS+Sousse),+RJJJ%2BFMW,+Bd+Tahar+Sfar,+Sousse&t=&z=15&ie=UTF8&iwloc=&output=embed"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Localisation Super Climat Shop — Sousse, Tunisie"
              ></iframe>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
