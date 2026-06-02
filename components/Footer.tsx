import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <>
      {/* Quote Modal */}
      <div className="modal-overlay" id="quoteModal" role="dialog" aria-modal="true" aria-labelledby="quoteModalTitle" style={{ display: 'none' }}>
        <div className="modal-box">
          <div className="modal-header">
            <h3 id="quoteModalTitle"><i className="fa-solid fa-paper-plane" style={{ color: 'var(--primary)', marginRight: 8 }}></i>Demande de Devis</h3>
            <button className="modal-close" id="modalClose" aria-label="Fermer"><i className="fa-solid fa-xmark"></i></button>
          </div>
          <form method="POST" action="/api/contact" id="quoteForm">
            <input type="hidden" name="source" value="modal" />
            <div className="form-group">
              <label htmlFor="qNom">Votre nom <span className="req">*</span></label>
              <input type="text" className="form-control" id="qNom" name="nom" required />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="qEmail">Email <span className="req">*</span></label>
                <input type="email" className="form-control" id="qEmail" name="email" required placeholder="email@exemple.tn" />
              </div>
              <div className="form-group">
                <label htmlFor="qTel">Téléphone</label>
                <input type="tel" className="form-control" id="qTel" name="telephone" placeholder="+216 xx xxx xxx" />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="modalProdName">Produit référencé</label>
              <input type="text" className="form-control" id="modalProdName" name="produit_ref" placeholder="Référence ou nom du produit" />
            </div>
            <div className="form-group">
              <label htmlFor="qMessage">Message <span className="req">*</span></label>
              <textarea className="form-control" id="qMessage" name="message" required placeholder="Décrivez votre besoin ou demandez un prix..." style={{ minHeight: 100 }}></textarea>
            </div>
            <button type="submit" className="btn btn-primary btn-block" id="quoteSubmitBtn">
              <i className="fa-solid fa-paper-plane"></i> Envoyer la demande
            </button>
          </form>
        </div>
      </div>

      {/* Footer */}
      <footer className="footer" role="contentinfo">
        <div className="container">
          <div className="footer-grid">
            {/* Brand */}
            <div>
              <div className="footer-brand">
                <Image src="/images/logo.png" alt="Logo SCS" width={42} height={42} style={{ objectFit: 'contain' }} />
                <span className="footer-brand-name">Super Climat Shop</span>
              </div>
              <p className="footer-desc">
                Votre spécialiste en pièces électroménager, équipements chaud &amp; froid, et joints réfrigérateur sur mesure à Sousse, Tunisie. Qualité et expertise de 20 ans et depuis 2006.
              </p>
              <div className="footer-socials">
                <a href="#" className="footer-social-link" aria-label="Facebook"><i className="fab fa-facebook-f"></i></a>
                <a href="#" className="footer-social-link" aria-label="Instagram"><i className="fab fa-instagram"></i></a>
                <a href="#" className="footer-social-link" aria-label="WhatsApp"><i className="fab fa-whatsapp"></i></a>
              </div>
            </div>

            {/* Navigation */}
            <div className="footer-col">
              <h5>Navigation</h5>
              <ul className="footer-links">
                <li><Link href="/">Accueil</Link></li>
                <li><Link href="/pieces-rechange">Pièces électroménager</Link></li>
                <li><Link href="/chaud-froid">Chaud &amp; Froid</Link></li>
                <li><Link href="/joints-frigidaires">Joints Réfrigérateur</Link></li>
                <li><Link href="/contact">Contact &amp; Devis</Link></li>
              </ul>
            </div>

            {/* Catégories */}
            <div className="footer-col">
              <h5>Nos Produits</h5>
              <ul className="footer-links">
                <li><Link href="/pieces-rechange?cat=lave_linge">Pièces Lave-linge</Link></li>
                <li><Link href="/pieces-rechange?cat=refrigerateurs">Pièces Réfrigérateurs</Link></li>
                <li><Link href="/pieces-rechange?cat=climatiseurs">Pièces Climatiseurs</Link></li>
                <li><Link href="/chaud-froid?cat=compresseurs">Compresseurs</Link></li>
                <li><Link href="/joints-frigidaires">Joints sur Mesure</Link></li>
              </ul>
            </div>

            {/* Contact */}
            <div className="footer-col">
              <h5>Contact</h5>
              <div className="footer-contact-item">
                <i className="fa-solid fa-location-dot"></i>
                <span>Super Climat Shop (SCS Sousse), RJJJ+FMW, Bd Tahar Sfar, Sousse</span>
              </div>
              <div className="footer-contact-item">
                <i className="fa-solid fa-phone"></i>
                <span>+216 73 202 651</span>
              </div>
              <div className="footer-contact-item">
                <i className="fa-solid fa-envelope"></i>
                <span>superclimatshop@gmail.com</span>
              </div>
              <div className="footer-contact-item">
                <i className="fa-solid fa-clock"></i>
                <span>Lun – ven : 8h00 – 18h00   sam : 8h00 – 14h00</span>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', flexWrap: 'wrap', gap: 8 }}>
            <span>&copy; {year} Super Climat Shop — Tous droits réservés.</span>
            <span>Fait avec <span style={{ color: '#e25555' }}>♥</span> à Sousse, Tunisie</span>
            <Link href="/admin/login" id="admin-access-link"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: '.75rem', color: 'rgba(255,255,255,.3)', transition: 'color .3s' }}>
              <i className="fa-solid fa-lock" style={{ fontSize: '.65rem' }}></i> Espace Admin
            </Link>
          </div>
        </div>
      </footer>
    </>
  );
}
