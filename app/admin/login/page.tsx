'use client';

import { useState, Suspense, useEffect } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const isTimeout = searchParams.get('timeout') === '1';
  const isLogout  = searchParams.get('logout')  === '1';

  // Add login-page specific body class
  useEffect(() => {
    document.body.classList.add('admin-login-page');
    return () => document.body.classList.remove('admin-login-page');
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const result = await signIn('credentials', {
      username: formData.get('username'),
      password: formData.get('password'),
      redirect: false,
    });

    if (result?.error) {
      setError('Identifiant ou mot de passe incorrect.');
      setLoading(false);
    } else {
      router.push('/admin/dashboard');
    }
  }

  return (
    <div className="login-card">
      <div className="login-logo">
        <Image src="/images/logo.png" alt="Logo SCS" width={64} height={64} onError={(e) => { (e.target as HTMLImageElement).src = '/images/logo.svg'; }} />
        <h2>Administration SCS</h2>
        <p>Super Climat Shop — Espace sécurisé</p>
      </div>

      {isTimeout && (
        <div className="alert alert-warning" data-dismiss="6000">
          <i className="fa-solid fa-clock"></i> Session expirée pour inactivité. Veuillez vous reconnecter.
        </div>
      )}
      {isLogout && (
        <div className="alert alert-info" data-dismiss="4000">
          <i className="fa-solid fa-check-circle"></i> Vous avez bien été déconnecté.
        </div>
      )}
      {error && (
        <div className="alert alert-error" data-dismiss="5000">
          <i className="fa-solid fa-triangle-exclamation"></i> {error}
        </div>
      )}

      <form onSubmit={handleSubmit} id="loginForm" noValidate>
        <div className="form-group">
          <label htmlFor="admin-username">Identifiant</label>
          <div className="login-input-icon">
            <i className="fa-solid fa-user"></i>
            <input
              type="text"
              className="form-control"
              id="admin-username"
              name="username"
              required
              autoComplete="username"
            />
          </div>
        </div>
        <div className="form-group" style={{ marginBottom: 28 }}>
          <label htmlFor="admin-password">Mot de passe</label>
          <div className="login-input-icon">
            <i className="fa-solid fa-lock"></i>
            <input
              type="password"
              className="form-control"
              id="admin-password"
              name="password"
              required
              autoComplete="current-password"
            />
          </div>
        </div>
        <button type="submit" className="btn btn-primary btn-block btn-lg" id="login-submit-btn" disabled={loading}>
          <i className="fa-solid fa-right-to-bracket"></i>{' '}
          {loading ? 'Connexion...' : 'Se connecter'}
        </button>
      </form>

      <p style={{ textAlign: 'center', marginTop: 24, fontSize: '.8rem', color: 'var(--text-muted)' }}>
        <Link href="/" style={{ color: 'var(--primary)', fontWeight: 600 }}>
          <i className="fa-solid fa-arrow-left"></i> Retour au site
        </Link>
      </p>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<div className="login-card" style={{ textAlign: 'center', padding: 40 }}>Chargement...</div>}>
      <LoginForm />
    </Suspense>
  );
}
