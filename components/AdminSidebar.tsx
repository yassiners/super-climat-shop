'use client';

import Link from 'next/link';
import Image from 'next/image';
import { signOut } from 'next-auth/react';
import { useState } from 'react';

interface AdminSidebarProps {
  activePage: 'dashboard' | 'produits' | 'ajouter' | 'messages' | 'sous-categories';
  username: string;
}

export default function AdminSidebar({ activePage, username }: AdminSidebarProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button 
        className="admin-mobile-toggle" 
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle menu"
      >
        <i className={`fa-solid ${isOpen ? 'fa-xmark' : 'fa-bars'}`}></i>
      </button>

      {/* Overlay to close sidebar on click outside */}
      {isOpen && (
        <div 
          className="admin-sidebar-overlay" 
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      <aside className={`admin-sidebar ${isOpen ? 'open' : ''}`} aria-label="Menu d'administration">
      <div className="sidebar-brand">
        <div className="sidebar-logo">
          <Image
            src="/images/logo.png"
            alt="Logo SCS"
            width={38}
            height={38}
            style={{ objectFit: 'contain' }}
            onError={(e) => { (e.target as HTMLImageElement).src = '/images/logo.svg'; }}
          />
          <div>
            <div className="sidebar-brand-name">Super Climat Shop</div>
            <div className="sidebar-brand-sub">Administration</div>
          </div>
        </div>
      </div>

      <nav className="sidebar-nav">
        <div className="sidebar-section-label">Principal</div>
        <Link
          href="/admin/dashboard"
          className={`sidebar-nav-link ${activePage === 'dashboard' ? 'active' : ''}`}
          id="sb-dashboard"
        >
          <i className="fa-solid fa-gauge"></i> Dashboard
        </Link>
        <Link
          href="/admin/messages"
          className={`sidebar-nav-link ${activePage === 'messages' ? 'active' : ''}`}
          id="sb-messages"
        >
          <i className="fa-solid fa-envelope"></i> Messages
        </Link>

        <div className="sidebar-section-label">Catalogue</div>
        <Link
          href="/admin/produits"
          className={`sidebar-nav-link ${activePage === 'produits' ? 'active' : ''}`}
          id="sb-produits"
        >
          <i className="fa-solid fa-boxes-stacked"></i> Produits
        </Link>
        <Link
          href="/admin/produits/ajouter"
          className={`sidebar-nav-link ${activePage === 'ajouter' ? 'active' : ''}`}
          id="sb-add"
        >
          <i className="fa-solid fa-circle-plus"></i> Ajouter un produit
        </Link>
        <Link
          href="/admin/sous-categories"
          className={`sidebar-nav-link ${activePage === 'sous-categories' ? 'active' : ''}`}
          id="sb-sous-categories"
        >
          <i className="fa-solid fa-layer-group"></i> Sous-catégories
        </Link>

        <div className="sidebar-section-label">Site</div>
        <Link href="/" target="_blank" className="sidebar-nav-link" id="sb-site">
          <i className="fa-solid fa-arrow-up-right-from-square"></i> Voir le site
        </Link>
      </nav>

      <div className="sidebar-footer">
        <button
          onClick={() => signOut({ callbackUrl: '/admin/login?logout=1' })}
          className="sidebar-logout"
          id="sb-logout"
          style={{ background: 'none', border: 'none', cursor: 'pointer', width: '100%', textAlign: 'left' }}
        >
          <i className="fa-solid fa-right-from-bracket"></i> Déconnexion
        </button>
      </div>
    </aside>
    </>
  );
}
