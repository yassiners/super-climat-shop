'use client';

import { SessionProvider } from 'next-auth/react';
import { useEffect } from 'react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  // Set admin-body class on the root <body> element
  useEffect(() => {
    document.body.classList.add('admin-body');
    return () => {
      document.body.classList.remove('admin-body');
    };
  }, []);

  return <SessionProvider>{children}</SessionProvider>;
}
