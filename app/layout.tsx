import type { Metadata } from 'next';
import Script from 'next/script';
import { Analytics } from '@vercel/analytics/react';

export const metadata: Metadata = {
  title: 'Super Climat Shop | Pièces Électroménager & Froid à Sousse',
  description:
    'Super Climat Shop (SCS) à Sousse, Tunisie — spécialiste en pièces électroménager, équipements chaud & froid et joints réfrigérateur sur mesure.',
  keywords: ['pièces rechange', 'électroménager', 'climatiseur', 'réfrigérateur', 'sousse', 'tunisie'],
  openGraph: {
    siteName: 'Super Climat Shop',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/images/logo.png" type="image/png" />
        {/* DNS prefetch for external CDNs */}
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://cdnjs.cloudflare.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        {/* Font Awesome — preconnect hints keep it fast without hiding icons */}
        <link rel="preconnect" href="https://cdnjs.cloudflare.com" />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
        />
        <link rel="stylesheet" href="/css/style.css" />
      </head>
      <body>
        {children}
        <Analytics />
        <Script src="/js/main.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}
