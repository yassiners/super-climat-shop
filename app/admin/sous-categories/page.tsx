'use client';

import { useState, useEffect, useCallback } from 'react';
import AdminSidebar from '@/components/AdminSidebar';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface SousCategorie {
  id: number;
  slug: string;
  label: string;
  categorie: string;
  icon: string | null;
}

const catLabels: Record<string, string> = {
  pieces_rechange: 'Pièces Électroménager',
  chaud_froid: 'Chaud & Froid',
  joints_frigidaires: 'Joints Réfrigérateur',
};

const catColors: Record<string, string> = {
  pieces_rechange: 'badge-primary',
  chaud_froid: 'badge-accent',
  joints_frigidaires: 'badge-green',
};

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_|_$/g, '');
}

export default function SousCategoriesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [sousCategories, setSousCategories] = useState<SousCategorie[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');

  // Form state
  const [editId, setEditId] = useState<number | null>(null);
  const [formSlug, setFormSlug] = useState('');
  const [formLabel, setFormLabel] = useState('');
  const [formCat, setFormCat] = useState('');
  const [formIcon, setFormIcon] = useState('');
  const [autoSlug, setAutoSlug] = useState(true);

  // Delete confirmation
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const username = session?.user?.name ?? 'Admin';

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/sous-categories');
      if (res.ok) {
        const data = await res.json();
        setSousCategories(data);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
      return;
    }
    fetchData();
  }, [status, router, fetchData]);

  function resetForm() {
    setEditId(null);
    setFormSlug('');
    setFormLabel('');
    setFormCat('');
    setFormIcon('');
    setAutoSlug(true);
  }

  function handleLabelChange(val: string) {
    setFormLabel(val);
    if (autoSlug) {
      setFormSlug(slugify(val));
    }
  }

  function startEdit(sc: SousCategorie) {
    setEditId(sc.id);
    setFormSlug(sc.slug);
    setFormLabel(sc.label);
    setFormCat(sc.categorie);
    setFormIcon(sc.icon ?? '');
    setAutoSlug(false);
    setMsg('');
    setError('');
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMsg('');
    setError('');

    const payload = {
      slug: formSlug,
      label: formLabel,
      categorie: formCat,
      icon: formIcon || null,
    };

    try {
      const url = editId
        ? `/api/admin/sous-categories/${editId}`
        : '/api/admin/sous-categories';
      const method = editId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (res.ok) {
        setMsg(editId ? 'Sous-catégorie modifiée.' : 'Sous-catégorie ajoutée.');
        resetForm();
        fetchData();
      } else {
        setError(data.error ?? 'Erreur.');
      }
    } catch {
      setError('Erreur réseau.');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: number) {
    setSaving(true);
    setMsg('');
    setError('');
    try {
      const res = await fetch(`/api/admin/sous-categories/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (res.ok) {
        setMsg('Sous-catégorie supprimée.');
        setDeleteId(null);
        fetchData();
      } else {
        setError(data.error ?? 'Erreur.');
      }
    } catch {
      setError('Erreur réseau.');
    } finally {
      setSaving(false);
    }
  }

  // Group by categorie
  const grouped = sousCategories.reduce<Record<string, SousCategorie[]>>((acc, sc) => {
    if (!acc[sc.categorie]) acc[sc.categorie] = [];
    acc[sc.categorie].push(sc);
    return acc;
  }, {});

  if (status === 'loading' || loading) {
    return (
      <div className="admin-layout" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: '2rem', color: 'var(--primary)' }}></i>
      </div>
    );
  }

  return (
    <div className="admin-layout">
      <AdminSidebar activePage="sous-categories" username={username} />

      <div className="admin-main">
        <div className="admin-topbar">
          <h1 className="admin-topbar-title">
            <i className="fa-solid fa-layer-group" style={{ color: 'var(--primary)', marginRight: 8 }}></i>
            Sous-Catégories
          </h1>
          <div className="admin-topbar-right">
            <div className="admin-user">
              <div className="admin-user-avatar">{username.charAt(0).toUpperCase()}</div>
              <span>{username}</span>
            </div>
          </div>
        </div>

        <div className="admin-content">
          {/* Alerts */}
          {msg && (
            <div className="alert alert-success" data-dismiss="4000">
              <i className="fa-solid fa-check-circle"></i> {msg}
            </div>
          )}
          {error && (
            <div className="alert alert-error">
              <i className="fa-solid fa-triangle-exclamation"></i> {error}
            </div>
          )}

          {/* Add/Edit Form */}
          <div className="admin-card" style={{ padding: '24px 28px', marginBottom: 24 }}>
            <h3 style={{
              fontSize: '1rem', fontWeight: 700, color: 'var(--text-dark)',
              marginBottom: 20, paddingBottom: 14, borderBottom: '1px solid var(--border)',
              display: 'flex', alignItems: 'center', gap: 8,
            }}>
              <i className={`fa-solid ${editId ? 'fa-pen' : 'fa-circle-plus'}`} style={{ color: 'var(--primary)' }}></i>
              {editId ? 'Modifier la sous-catégorie' : 'Ajouter une sous-catégorie'}
            </h3>

            <form onSubmit={handleSubmit} id="scForm">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label htmlFor="sc-label">Libellé <span className="req">*</span></label>
                  <input
                    type="text" className="form-control" id="sc-label"
                    placeholder="Ex : Gaz Réfrigérant"
                    value={formLabel} onChange={e => handleLabelChange(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  <label htmlFor="sc-slug">Slug <span className="req">*</span></label>
                  <input
                    type="text" className="form-control" id="sc-slug"
                    placeholder="Ex : gaz_refrigerant"
                    value={formSlug}
                    onChange={e => { setAutoSlug(false); setFormSlug(e.target.value); }}
                    required
                    pattern="^[a-z0-9_]+$"
                    title="Lettres minuscules, chiffres et underscores uniquement"
                  />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 16 }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label htmlFor="sc-cat">Catégorie parente <span className="req">*</span></label>
                  <select
                    className="form-control" id="sc-cat"
                    value={formCat} onChange={e => setFormCat(e.target.value)}
                    required
                  >
                    <option value="">— Choisir —</option>
                    <option value="pieces_rechange">Pièces Électroménager</option>
                    <option value="chaud_froid">Chaud &amp; Froid</option>
                    <option value="joints_frigidaires">Joints Réfrigérateur</option>
                  </select>
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  <label htmlFor="sc-icon">Icône FontAwesome</label>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <input
                      type="text" className="form-control" id="sc-icon"
                      placeholder="Ex : fa-solid fa-flask"
                      value={formIcon} onChange={e => setFormIcon(e.target.value)}
                    />
                    {formIcon && <i className={formIcon} style={{ fontSize: '1.2rem', color: 'var(--primary)' }}></i>}
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
                <button type="submit" className="btn btn-primary btn-sm" disabled={saving} id="sc-submit-btn">
                  <i className={`fa-solid ${editId ? 'fa-floppy-disk' : 'fa-plus'}`}></i>
                  {saving ? 'En cours...' : editId ? 'Enregistrer' : 'Ajouter'}
                </button>
                {editId && (
                  <button type="button" className="btn btn-outline btn-sm" onClick={resetForm} id="sc-cancel-btn">
                    <i className="fa-solid fa-xmark"></i> Annuler
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Table grouped by category */}
          {Object.entries(catLabels).map(([catKey, catLabel]) => {
            const items = grouped[catKey] ?? [];
            return (
              <div className="admin-card" key={catKey} style={{ marginBottom: 24 }}>
                <div className="admin-card-header">
                  <h3>
                    <span className={`badge ${catColors[catKey]}`} style={{ marginRight: 10 }}>
                      {catLabel}
                    </span>
                    <span style={{ fontSize: '.82rem', color: 'var(--text-muted)', fontWeight: 400 }}>
                      {items.length} sous-catégorie(s)
                    </span>
                  </h3>
                </div>
                <div style={{ overflowX: 'auto' }}>
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th style={{ width: 50 }}>ID</th>
                        <th>Libellé</th>
                        <th>Slug</th>
                        <th>Icône</th>
                        <th style={{ width: 140 }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.length === 0 ? (
                        <tr>
                          <td colSpan={5} style={{ textAlign: 'center', padding: 32, color: 'var(--text-muted)' }}>
                            Aucune sous-catégorie.
                          </td>
                        </tr>
                      ) : items.map(sc => (
                        <tr key={sc.id}>
                          <td style={{ color: 'var(--text-muted)', fontSize: '.82rem' }}>{sc.id}</td>
                          <td style={{ fontWeight: 600, color: 'var(--text-dark)' }}>{sc.label}</td>
                          <td>
                            <code style={{
                              background: 'var(--bg-light)', padding: '3px 8px', borderRadius: 4,
                              fontSize: '.82rem', color: 'var(--primary)',
                            }}>
                              {sc.slug}
                            </code>
                          </td>
                          <td>
                            {sc.icon ? (
                              <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <i className={sc.icon} style={{ fontSize: '1rem', color: 'var(--primary)' }}></i>
                                <span style={{ fontSize: '.78rem', color: 'var(--text-muted)' }}>{sc.icon}</span>
                              </span>
                            ) : (
                              <span style={{ color: 'var(--text-muted)', fontSize: '.82rem' }}>—</span>
                            )}
                          </td>
                          <td>
                            <div className="action-btns">
                              <button
                                className="btn-table btn-table-edit" title="Modifier"
                                onClick={() => startEdit(sc)}
                              >
                                <i className="fa-solid fa-pen"></i>
                              </button>
                              {deleteId === sc.id ? (
                                <>
                                  <button
                                    className="btn-table btn-table-delete" title="Confirmer"
                                    onClick={() => handleDelete(sc.id)}
                                    disabled={saving}
                                  >
                                    <i className="fa-solid fa-check"></i>
                                  </button>
                                  <button
                                    className="btn-table btn-table-view" title="Annuler"
                                    onClick={() => setDeleteId(null)}
                                  >
                                    <i className="fa-solid fa-xmark"></i>
                                  </button>
                                </>
                              ) : (
                                <button
                                  className="btn-table btn-table-delete" title="Supprimer"
                                  onClick={() => setDeleteId(sc.id)}
                                >
                                  <i className="fa-solid fa-trash"></i>
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
