import { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import AdminSidebar from '@/components/AdminSidebar';

export const metadata: Metadata = {
  title: 'Messages — Admin SCS',
  robots: { index: false, follow: false },
};

export default async function AdminMessagesPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/admin/login');

  const username = session.user?.name ?? 'Admin';
  const initial  = username.charAt(0).toUpperCase();

  const contacts = await prisma.contact.findMany({
    orderBy: { date_envoi: 'desc' },
  });

  return (
    <div className="admin-layout">
      <AdminSidebar activePage="messages" username={username} />

      <div className="admin-main">
        <div className="admin-topbar">
          <h1 className="admin-topbar-title">
            <i className="fa-solid fa-envelope" style={{ color: 'var(--primary)', marginRight: 8 }}></i>
            Messages & Devis
          </h1>
          <div className="admin-topbar-right">
            <div className="admin-user">
              <div className="admin-user-avatar">{initial}</div>
              <span>{username}</span>
            </div>
          </div>
        </div>

        <div className="admin-content">
          <div className="admin-card">
            <div className="admin-card-header">
              <h3>
                Boîte de réception
              </h3>
              <span className="badge badge-primary">{contacts.length} total</span>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Nom & Email</th>
                    <th>Téléphone</th>
                    <th>Sujet / Produit Réf</th>
                    <th>Message</th>
                  </tr>
                </thead>
                <tbody>
                  {contacts.length === 0 ? (
                    <tr>
                      <td colSpan={5} style={{ textAlign: 'center', padding: 48, color: 'var(--text-muted)' }}>
                        <i className="fa-solid fa-envelope-open"
                           style={{ fontSize: '2rem', display: 'block', marginBottom: 12, opacity: .3 }}></i>
                        Aucun message reçu.
                      </td>
                    </tr>
                  ) : contacts.map(c => (
                    <tr key={c.id}>
                      <td style={{ whiteSpace: 'nowrap', fontSize: '.85rem' }}>
                        {c.date_envoi.toLocaleDateString('fr-TN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td>
                        <strong>{c.nom}</strong><br />
                        <span style={{ fontSize: '.85rem', color: 'var(--text-muted)' }}>{c.email}</span>
                      </td>
                      <td style={{ whiteSpace: 'nowrap' }}>{c.telephone || '—'}</td>
                      <td>
                        {c.sujet && <strong style={{ display: 'block', color: 'var(--primary)', fontSize: '.85rem' }}>{c.sujet}</strong>}
                        {c.produit_ref && <span style={{ fontSize: '.8rem', color: 'var(--text-muted)' }}>Réf: {c.produit_ref}</span>}
                      </td>
                      <td style={{ maxWidth: 300, fontSize: '.9rem', lineHeight: 1.5 }}>
                        <div style={{ background: 'var(--bg-light)', padding: '10px 14px', borderRadius: 6, border: '1px solid var(--border)' }}>
                          {c.message}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
