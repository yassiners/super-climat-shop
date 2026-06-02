'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AdminSidebar from '@/components/AdminSidebar';
import { useSession } from 'next-auth/react';

interface SousCategorieItem {
  id: number;
  slug: string;
  label: string;
  categorie: string;
  icon: string | null;
}

export default function AjouterProduitPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [errors,     setErrors]     = useState<string[]>([]);
  const [loading,    setLoading]    = useState(false);
  const [selectedCat, setSelectedCat] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');
  const [allSousCats, setAllSousCats] = useState<SousCategorieItem[]>([]);

  const username = session?.user?.name ?? 'Admin';

  // Fetch subcategories from API
  useEffect(() => {
    fetch('/api/admin/sous-categories')
      .then(r => r.ok ? r.json() : [])
      .then((data: SousCategorieItem[]) => setAllSousCats(data))
      .catch(() => {});
  }, []);

  const filteredSousCats = selectedCat
    ? allSousCats.filter(sc => sc.categorie === selectedCat)
    : [];

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) setPreviewUrl(URL.createObjectURL(file));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setErrors([]);

    const formData = new FormData(e.currentTarget);
    try {
      const res  = await fetch('/api/admin/produits', { method: 'POST', body: formData });
      const data = await res.json();
      if (res.ok) {
        router.push('/admin/produits?msg=added');
      } else {
        setErrors([data.error ?? "Erreur lors de l'ajout."]);
      }
    } catch {
      setErrors(['Erreur réseau. Veuillez réessayer.']);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="admin-layout">
      <AdminSidebar activePage="ajouter" username={username} />

      <div className="admin-main">
        <div className="admin-topbar">
          <h1 className="admin-topbar-title">
            <i className="fa-solid fa-circle-plus" style={{ color: 'var(--primary)', marginRight: 8 }}></i>
            Ajouter un Produit
          </h1>
          <div className="admin-topbar-right">
            <Link href="/admin/produits" className="btn btn-outline btn-sm" id="back-btn">
              <i className="fa-solid fa-arrow-left"></i> Retour
            </Link>
            <div className="admin-user">
              <div className="admin-user-avatar">{username.charAt(0).toUpperCase()}</div>
              <span>{username}</span>
            </div>
          </div>
        </div>

        <div className="admin-content">
          {errors.length > 0 && (
            <div className="alert alert-error">
              <i className="fa-solid fa-triangle-exclamation"></i>
              <ul style={{ margin: 0, paddingLeft: 16 }}>
                {errors.map((e, i) => <li key={i}>{e}</li>)}
              </ul>
            </div>
          )}

          <form onSubmit={handleSubmit} encType="multipart/form-data" id="addProductForm">
            <div className="admin-form-card">
              <h3 style={{
                fontSize: '1rem', fontWeight: 700, color: 'var(--text-dark)',
                marginBottom: 28, paddingBottom: 16, borderBottom: '1px solid var(--border)',
              }}>
                Informations du Produit
              </h3>

              <div className="form-group">
                <label htmlFor="p-nom">Nom du produit <span className="req">*</span></label>
                <input type="text" className="form-control" id="p-nom" name="nom" required
                  placeholder="Ex : Compresseur R410a 9000BTU Highly" />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="p-cat">Catégorie <span className="req">*</span></label>
                  <select
                    className="form-control" id="p-cat" name="categorie" required
                    value={selectedCat} onChange={e => setSelectedCat(e.target.value)}
                  >
                    <option value="">— Choisir —</option>
                    <option value="pieces_rechange">Pièces Électroménager</option>
                    <option value="chaud_froid">Chaud &amp; Froid</option>
                    <option value="joints_frigidaires">Joints Réfrigérateur</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="p-subcat">Sous-catégorie</label>
                  <select className="form-control" id="p-subcat" name="sous_categorie">
                    {!selectedCat ? (
                      <option value="">— Sélectionner d&apos;abord la catégorie —</option>
                    ) : (
                      <>
                        <option value="">— Sous-catégorie —</option>
                        {filteredSousCats.map(sc => (
                          <option key={sc.slug} value={sc.slug}>{sc.label}</option>
                        ))}
                      </>
                    )}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="p-prix">Prix (DT)</label>
                <input type="number" className="form-control" id="p-prix" name="prix"
                  min="0" step="0.01" placeholder="0.00" style={{ maxWidth: 220 }} />
              </div>

              <div className="form-group">
                <label htmlFor="p-desc">Description</label>
                <textarea className="form-control" id="p-desc" name="description" rows={5}
                  placeholder="Description détaillée, compatibilité, spécifications techniques..."></textarea>
              </div>

              <div className="form-group">
                <label>Image du produit</label>
                <input type="file" name="image" id="imageFile" accept="image/*"
                  onChange={handleImageChange} style={{ display: 'none' }} />
                <div className="upload-zone" id="uploadZone"
                  onClick={() => document.getElementById('imageFile')?.click()}>
                  <i className="fa-solid fa-cloud-arrow-up"></i>
                  <p>Cliquez ou glissez une image ici <span>(JPG, PNG, WEBP — max 5 Mo)</span></p>
                </div>
                {previewUrl && (
                  <img id="uploadPreview" className="upload-preview" src={previewUrl} alt="Aperçu"
                    style={{ display: 'block', marginTop: 12, maxWidth: 200 }} />
                )}
              </div>

              <div style={{ display: 'flex', gap: 12, paddingTop: 20, borderTop: '1px solid var(--border)' }}>
                <button type="submit" className="btn btn-primary" id="add-submit-btn" disabled={loading}>
                  <i className="fa-solid fa-floppy-disk"></i>{' '}
                  {loading ? 'Enregistrement...' : 'Enregistrer le produit'}
                </button>
                <Link href="/admin/produits" className="btn btn-outline" id="add-cancel-btn">Annuler</Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

