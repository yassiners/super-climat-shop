import { Metadata } from 'next';
import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import AdminSidebar from '@/components/AdminSidebar';

export const metadata: Metadata = {
  title: 'Dashboard — Admin SCS',
  robots: { index: false, follow: false },
};

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/admin/login');

  const username = session.user?.name ?? 'Admin';
  const initial  = username.charAt(0).toUpperCase();

  const [totalProduits, pieces, chaudfroid, joints, contacts] = await Promise.all([
    prisma.produit.count(),
    prisma.produit.count({ where: { categorie: 'pieces_rechange' } }),
    prisma.produit.count({ where: { categorie: 'chaud_froid' } }),
    prisma.produit.count({ where: { categorie: 'joints_frigidaires' } }),
    prisma.contact.count(),
  ]);

  const [recentProducts, recentContacts] = await Promise.all([
    prisma.produit.findMany({ orderBy: { date_ajout: 'desc' }, take: 5 }),
    prisma.contact.findMany({ orderBy: { date_envoi: 'desc' }, take: 5 }),
  ]);

  return (
    <div className="admin-layout">
      <AdminSidebar activePage="dashboard" username={username} />

      <div className="admin-main">
        <div className="admin-topbar">
          <h1 className="admin-topbar-title">
            <i className="fa-solid fa-gauge" style={{ color: 'var(--primary)', marginRight: 8 }}></i>
            Dashboard
          </h1>
          <div className="admin-topbar-right">
            <div className="admin-user">
              <div className="admin-user-avatar">{initial}</div>
              <span>{username}</span>
            </div>
          </div>
        </div>

        <div className="admin-content">
          {/* Stats Grid */}
          <div className="admin-stats-grid">
            <div className="stat-card">
              <div className="stat-icon primary"><i className="fa-solid fa-boxes-stacked"></i></div>
              <div className="stat-info">
                <div className="stat-number">{totalProduits}</div>
                <div className="stat-label">Produits Total</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon accent"><i className="fa-solid fa-gear"></i></div>
              <div className="stat-info">
                <div className="stat-number">{pieces}</div>
                <div className="stat-label">Pièces Électroménager</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon orange"><i className="fa-solid fa-snowflake"></i></div>
              <div className="stat-info">
                <div className="stat-number">{chaudfroid}</div>
                <div className="stat-label">Chaud &amp; Froid</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon green"><i className="fa-solid fa-ring"></i></div>
              <div className="stat-info">
                <div className="stat-number">{joints}</div>
                <div className="stat-label">Joints Réfrigérateur</div>
              </div>
            </div>
          </div>

          {/* Two columns */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: 24 }}>
            {/* Derniers produits */}
            <div className="admin-card">
              <div className="admin-card-header">
                <h3>
                  <i className="fa-solid fa-clock-rotate-left" style={{ color: 'var(--primary)', marginRight: 8 }}></i>
                  Derniers Produits
                </h3>
                <Link href="/admin/produits/ajouter" className="btn btn-primary btn-sm" id="db-add-btn">
                  <i className="fa-solid fa-plus"></i> Ajouter
                </Link>
              </div>
              <table className="admin-table">
                <thead>
                  <tr><th>Nom</th><th>Catégorie</th><th>Prix</th><th>Action</th></tr>
                </thead>
                <tbody>
                  {recentProducts.length === 0 ? (
                    <tr>
                      <td colSpan={4} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: 32 }}>
                        Aucun produit
                      </td>
                    </tr>
                  ) : recentProducts.map(p => (
                    <tr key={p.id}>
                      <td style={{ maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.nom}</td>
                      <td>
                        <span className={`badge ${
                          p.categorie === 'pieces_rechange' ? 'badge-primary'
                          : p.categorie === 'chaud_froid'   ? 'badge-accent'
                          : 'badge-green'
                        }`}>
                          {p.categorie === 'pieces_rechange' ? 'Pièces'
                           : p.categorie === 'chaud_froid'   ? 'Chaud/Froid'
                           : 'Joints'}
                        </span>
                      </td>
                      <td><strong>{Number(p.prix).toFixed(2).replace('.', ',')} DT</strong></td>
                      <td>
                        <Link href={`/admin/produits/${p.id}/modifier`} className="btn-table btn-table-edit">
                          <i className="fa-solid fa-pen"></i>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Derniers contacts */}
            <div className="admin-card">
              <div className="admin-card-header">
                <h3>
                  <i className="fa-solid fa-envelope" style={{ color: 'var(--primary)', marginRight: 8 }}></i>
                  Contacts Récents
                </h3>
                <span className="badge badge-primary">{contacts} total</span>
              </div>
              {recentContacts.length === 0 ? (
                <div style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '.875rem' }}>
                  Aucun message reçu
                </div>
              ) : (
                <div style={{ padding: 0 }}>
                  {recentContacts.map(c => (
                    <div key={c.id} style={{ padding: '16px 24px', borderTop: '1px solid var(--border)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                        <strong style={{ fontSize: '.88rem', color: 'var(--text-dark)' }}>{c.nom}</strong>
                        <small style={{ color: 'var(--text-muted)' }}>
                          {c.date_envoi.toLocaleDateString('fr-TN', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                        </small>
                      </div>
                      <div style={{ fontSize: '.8rem', color: 'var(--text-muted)' }}>{c.email}</div>
                      {c.sujet && (
                        <div style={{ fontSize: '.78rem', color: 'var(--primary)', marginTop: 4, fontWeight: 600 }}>
                          {c.sujet}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Quick actions */}
          <div className="admin-card" style={{ marginTop: 24, padding: 28 }}>
            <h3 style={{ fontSize: '.975rem', fontWeight: 700, color: 'var(--text-dark)', marginBottom: 20 }}>
              Actions Rapides
            </h3>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <Link href="/admin/produits/ajouter" className="btn btn-primary" id="qa-add-btn">
                <i className="fa-solid fa-circle-plus"></i> Ajouter un produit
              </Link>
              <Link href="/admin/produits" className="btn btn-outline" id="qa-list-btn">
                <i className="fa-solid fa-list"></i> Gérer les produits
              </Link>
              <Link href="/" target="_blank" className="btn btn-outline" id="qa-site-btn">
                <i className="fa-solid fa-eye"></i> Voir le site
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
