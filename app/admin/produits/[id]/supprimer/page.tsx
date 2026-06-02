'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useSession } from 'next-auth/react';

const catLabels: Record<string, string> = {
  pieces_rechange:    'Pièces Électroménager',
  chaud_froid:        'Chaud & Froid',
  joints_frigidaires: 'Joints Réfrigérateur',
};

interface ProduitData {
  id: number;
  nom: string;
  categorie: string;
  prix: number;
  image: string | null;
}

export default function SupprimerProduitPage({ params }: { params: { id: string } }) {
  useSession(); // ensure session is loaded
  const router = useRouter();
  const [produit,      setProduit]      = useState<ProduitData | null>(null);
  const [deleteError,  setDeleteError]  = useState('');
  const [loading,      setLoading]      = useState(false);

  useEffect(() => {
    fetch(`/api/admin/produits/${params.id}`)
      .then(r => { if (!r.ok) throw new Error(); return r.json(); })
      .then((data: ProduitData) => setProduit(data))
      .catch(() => router.push('/admin/produits'));
  }, [params.id, router]);

  async function handleDelete() {
    if (!produit) return;
    if (!confirm(`Confirmer la suppression de « ${produit.nom} » ?`)) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/produits/${params.id}`, { method: 'DELETE' });
      if (res.ok) {
        router.push('/admin/produits?msg=deleted');
      } else {
        const data = await res.json();
        setDeleteError(data.error ?? 'Erreur lors de la suppression.');
      }
    } catch {
      setDeleteError('Erreur réseau.');
    } finally {
      setLoading(false);
    }
  }

  if (!produit) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: '2rem', color: 'var(--primary)' }}></i>
      </div>
    );
  }

  if (deleteError) {
    return (
      <div style={{ maxWidth: 500, margin: '60px auto', padding: 24 }}>
        <div className="alert alert-error">
          <i className="fa-solid fa-triangle-exclamation"></i> {deleteError}
        </div>
        <Link href="/admin/produits" className="btn btn-outline">
          <i className="fa-solid fa-arrow-left"></i> Retour à la liste
        </Link>
      </div>
    );
  }

  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      minHeight: '100vh', padding: 24,
    }}>
      <div className="delete-card">
        <div className="delete-icon"><i className="fa-solid fa-trash-can"></i></div>
        <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-dark)', marginBottom: 12 }}>
          Confirmer la suppression
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '.925rem', lineHeight: 1.65, marginBottom: 8 }}>
          Êtes-vous sûr de vouloir supprimer le produit :
        </p>
        <p style={{ fontWeight: 700, color: 'var(--text-dark)', fontSize: '1rem', marginBottom: 8 }}>
          «&nbsp;{produit.nom}&nbsp;»
        </p>
        <p style={{ color: 'var(--text-muted)', fontSize: '.82rem', marginBottom: produit.image ? 24 : 32 }}>
          Catégorie : {catLabels[produit.categorie] ?? produit.categorie}<br />
          Prix : {Number(produit.prix).toFixed(2).replace('.', ',')} DT
          {produit.image && (
            <>
              <br />
              <span style={{ color: 'var(--accent)', fontWeight: 600 }}>
                <i className="fa-solid fa-triangle-exclamation"></i> L&apos;image associée sera également supprimée.
              </span>
            </>
          )}
        </p>

        {produit.image && (
          <Image
            src={produit.image} alt="Image produit" width={150} height={100}
            style={{ objectFit: 'cover', borderRadius: 8, margin: '0 auto 28px', display: 'block', boxShadow: 'var(--shadow-sm)' }}
          />
        )}

        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button onClick={handleDelete} className="btn btn-accent" id="confirm-delete-btn" disabled={loading}>
            <i className="fa-solid fa-trash-can"></i>{' '}
            {loading ? 'Suppression...' : 'Oui, supprimer'}
          </button>
          <Link href="/admin/produits" className="btn btn-outline" id="cancel-delete-btn">
            <i className="fa-solid fa-xmark"></i> Annuler
          </Link>
        </div>
      </div>
    </div>
  );
}
