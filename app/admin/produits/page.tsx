import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import AdminSidebar from '@/components/AdminSidebar';
import { Categorie } from '@prisma/client';

export const metadata: Metadata = {
  title: 'Produits — Admin SCS',
  robots: { index: false, follow: false },
};

const catLabels: Record<string, string> = {
  pieces_rechange: 'Pièces Électroménager',
  chaud_froid: 'Chaud & Froid',
  joints_frigidaires: 'Joints Réfrigérateur',
};

type Props = {
  searchParams: { page?: string; cat?: string; q?: string; msg?: string };
};

export default async function AdminProduitsPage({ searchParams }: Props) {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/admin/login');

  const username = session.user?.name ?? 'Admin';
  const initial  = username.charAt(0).toUpperCase();

  const perPage  = 10;
  const page     = Math.max(1, parseInt(searchParams.page ?? '1'));
  const filterCat = searchParams.cat && Object.values(Categorie).includes(searchParams.cat as Categorie)
    ? (searchParams.cat as Categorie)
    : null;
  const search = searchParams.q ?? '';
  const msg    = searchParams.msg ?? '';

  const where = {
    ...(filterCat ? { categorie: filterCat } : {}),
    ...(search
      ? { OR: [
          { nom:         { contains: search, mode: 'insensitive' as const } },
          { description: { contains: search, mode: 'insensitive' as const } },
        ]}
      : {}),
  };

  const [total, produits] = await Promise.all([
    prisma.produit.count({ where }),
    prisma.produit.findMany({
      where,
      orderBy: { date_ajout: 'desc' },
      skip:  (page - 1) * perPage,
      take:  perPage,
    }),
  ]);

  const pages = Math.ceil(total / perPage);

  return (
    <div className="admin-layout">
      <AdminSidebar activePage="produits" username={username} />

      <div className="admin-main">
        <div className="admin-topbar">
          <h1 className="admin-topbar-title">
            <i className="fa-solid fa-boxes-stacked" style={{ color: 'var(--primary)', marginRight: 8 }}></i>
            Gestion des Produits
          </h1>
          <div className="admin-topbar-right">
            <Link href="/admin/produits/ajouter" className="btn btn-primary btn-sm" id="produits-add-btn">
              <i className="fa-solid fa-plus"></i> Nouveau Produit
            </Link>
            <div className="admin-user">
              <div className="admin-user-avatar">{initial}</div>
              <span>{username}</span>
            </div>
          </div>
        </div>

        <div className="admin-content">
          {/* Alerts */}
          {msg === 'added'   && <div className="alert alert-success" data-dismiss="4000"><i className="fa-solid fa-check-circle"></i> Produit ajouté avec succès.</div>}
          {msg === 'updated' && <div className="alert alert-success" data-dismiss="4000"><i className="fa-solid fa-check-circle"></i> Produit modifié avec succès.</div>}
          {msg === 'deleted' && <div className="alert alert-success" data-dismiss="4000"><i className="fa-solid fa-check-circle"></i> Produit supprimé avec succès.</div>}

          {/* Filters */}
          <div className="admin-card" style={{ padding: '20px 24px', marginBottom: 24 }}>
            <form method="GET" action="" id="filterForm"
              style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
              <input
                type="text" name="q" className="form-control"
                placeholder="Rechercher un produit..."
                defaultValue={search} id="search-input"
                style={{ maxWidth: 280, padding: '10px 16px' }}
              />
              <select name="cat" className="form-control" id="cat-filter"
                style={{ maxWidth: 220, padding: '10px 16px' }}
                defaultValue={filterCat ?? ''}>
                <option value="">Toutes catégories</option>
                {Object.entries(catLabels).map(([v, l]) => (
                  <option key={v} value={v}>{l}</option>
                ))}
              </select>
              <button type="submit" className="btn btn-primary btn-sm" id="filter-submit-btn">
                <i className="fa-solid fa-magnifying-glass"></i> Filtrer
              </button>
              {(filterCat || search) && (
                <Link href="/admin/produits" className="btn btn-outline btn-sm" id="filter-clear-btn">
                  <i className="fa-solid fa-xmark"></i> Réinitialiser
                </Link>
              )}
              <span style={{ marginLeft: 'auto', fontSize: '.82rem', color: 'var(--text-muted)' }}>
                {total} produit(s)
              </span>
            </form>
          </div>

          {/* Table */}
          <div className="admin-card">
            <div className="admin-card-header">
              <h3>
                Liste des Produits
                {filterCat ? ` — ${catLabels[filterCat]}` : ''}
              </h3>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th style={{ width: 56 }}>Image</th>
                    <th>Nom</th>
                    <th>Catégorie</th>
                    <th>Sous-cat.</th>
                    <th>Prix (DT)</th>
                    <th>Ajouté le</th>
                    <th style={{ width: 160 }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {produits.length === 0 ? (
                    <tr>
                      <td colSpan={7} style={{ textAlign: 'center', padding: 48, color: 'var(--text-muted)' }}>
                        <i className="fa-solid fa-box-open"
                           style={{ fontSize: '2rem', display: 'block', marginBottom: 12, opacity: .3 }}></i>
                        Aucun produit trouvé.
                      </td>
                    </tr>
                  ) : produits.map(p => (
                    <tr key={p.id}>
                      <td>
                        {p.image ? (
                          <Image
                            src={p.image} className="table-img" alt=""
                            width={48} height={48}
                            style={{ objectFit: 'cover', borderRadius: 6 }}
                          />
                        ) : (
                          <div className="table-img-placeholder">
                            <i className="fa-solid fa-image"></i>
                          </div>
                        )}
                      </td>
                      <td style={{ fontWeight: 600, color: 'var(--text-dark)', maxWidth: 220 }}>{p.nom}</td>
                      <td>
                        <span className={`badge ${
                          p.categorie === 'pieces_rechange' ? 'badge-primary'
                          : p.categorie === 'chaud_froid'   ? 'badge-accent'
                          : 'badge-green'
                        }`}>
                          {catLabels[p.categorie] ?? p.categorie}
                        </span>
                      </td>
                      <td style={{ fontSize: '.82rem', color: 'var(--text-muted)' }}>
                        {p.sous_categorie
                          ? p.sous_categorie.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
                          : '—'}
                      </td>
                      <td style={{ fontWeight: 700, color: 'var(--primary)' }}>
                        {Number(p.prix).toFixed(2).replace('.', ',')}
                      </td>
                      <td style={{ fontSize: '.82rem', color: 'var(--text-muted)' }}>
                        {p.date_ajout.toLocaleDateString('fr-TN', {
                          day: '2-digit', month: '2-digit', year: 'numeric',
                        })}
                      </td>
                      <td>
                        <div className="action-btns">
                          <Link href={`/produit/${p.id}`} target="_blank"
                            className="btn-table btn-table-view" title="Voir sur le site">
                            <i className="fa-solid fa-eye"></i>
                          </Link>
                          <Link href={`/admin/produits/${p.id}/modifier`}
                            className="btn-table btn-table-edit" title="Modifier">
                            <i className="fa-solid fa-pen"></i>
                          </Link>
                          <Link href={`/admin/produits/${p.id}/supprimer`}
                            className="btn-table btn-table-delete" title="Supprimer"
                            data-confirm={`Confirmer la suppression de « ${p.nom} » ?`}>
                            <i className="fa-solid fa-trash"></i>
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pages > 1 && (
              <div style={{
                padding: '20px 24px',
                borderTop: '1px solid var(--border)',
                display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center',
              }}>
                {Array.from({ length: pages }, (_, i) => i + 1).map(i => (
                  <Link
                    key={i}
                    href={`?page=${i}&cat=${filterCat ?? ''}&q=${search}`}
                    className={`btn-table ${i === page ? 'btn-table-edit' : 'btn-table-view'}`}
                    style={{ width: 36, height: 36, justifyContent: 'center', display: 'inline-flex', alignItems: 'center' }}
                  >
                    {i}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
