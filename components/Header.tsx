'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function Header() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const isActive = (page: string) => {
    if (page === 'index') return pathname === '/';
    if (page === 'pieces') return pathname.startsWith('/pieces-rechange');
    if (page === 'chaud_froid') return pathname.startsWith('/chaud-froid');
    if (page === 'joints') return pathname.startsWith('/joints-frigidaires');
    if (page === 'contact') return pathname.startsWith('/contact');
    return false;
  };

  return (
    <header>
      <nav className="navbar" id="mainNav" role="navigation" aria-label="Navigation principale">
        <div className="navbar-container">
          {/* Brand */}
          <Link href="/" className="navbar-brand" aria-label="Super Climat Shop — Accueil">
            <Image src="/images/logo.png" alt="Logo Super Climat Shop" width={46} height={46} style={{ objectFit: 'contain' }} />
            <div className="brand-text">
              <span className="brand-name">Super Climat Shop</span>
              <span className="brand-tagline">Spécialiste froid &amp; électroménager</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="navbar-nav" aria-label="Menu principal">
            <Link href="/" id="nav-accueil" className={isActive('index') ? 'active' : ''}>Accueil</Link>
            <Link href="/pieces-rechange" id="nav-pieces" className={isActive('pieces') ? 'active' : ''}>Pièces Électroménager</Link>
            <Link href="/chaud-froid" id="nav-cf" className={isActive('chaud_froid') ? 'active' : ''}>Chaud &amp; Froid</Link>
            <Link href="/joints-frigidaires" id="nav-joints" className={isActive('joints') ? 'active' : ''}>Joints Réfrigérateur</Link>
            <Link href="/contact" id="nav-contact" className={`nav-cta ${isActive('contact') ? 'active' : ''}`}>
              <i className="fa-solid fa-envelope"></i> Contact &amp; Devis
            </Link>
          </nav>

          {/* Mobile Toggle */}
          <button 
            className={`navbar-toggle ${isMobileMenuOpen ? 'active' : ''}`} 
            id="navToggle" 
            aria-label="Ouvrir le menu" 
            aria-expanded={isMobileMenuOpen}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <span></span><span></span><span></span>
          </button>
        </div>

        {/* Mobile Menu */}
        <div className={`navbar-mobile ${isMobileMenuOpen ? 'open' : ''}`} id="mobileMenu" aria-hidden={!isMobileMenuOpen}>
          <Link href="/" className={isActive('index') ? 'active' : ''}><i className="fa-solid fa-house"></i> Accueil</Link>
          <Link href="/pieces-rechange" className={isActive('pieces') ? 'active' : ''}><i className="fa-solid fa-gear"></i> Pièces Électroménager</Link>
          <Link href="/chaud-froid" className={isActive('chaud_froid') ? 'active' : ''}><i className="fa-solid fa-snowflake"></i> Chaud &amp; Froid</Link>
          <Link href="/joints-frigidaires" className={isActive('joints') ? 'active' : ''}><i className="fa-solid fa-circle-dot"></i> Joints Réfrigérateur</Link>
          <Link href="/contact" className={isActive('contact') ? 'active' : ''}><i className="fa-solid fa-envelope"></i> Contact &amp; Devis</Link>
        </div>
      </nav>
    </header>
  );
}
