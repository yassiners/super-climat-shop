# Super Climat Shop — Next.js

Application e-commerce **Super Climat Shop** (SCS) migrée de PHP/MySQL vers **Next.js 14 + Supabase (PostgreSQL) + Prisma ORM**.

## Stack technique

| Couche | Technologie |
|---|---|
| Framework | Next.js 14 (App Router) |
| Base de données | Supabase PostgreSQL |
| ORM | Prisma 5 |
| Auth Admin | NextAuth.js v4 + bcrypt |
| Images produits | Supabase Storage |
| Déploiement | Vercel |

## Structure

```
app/
├── page.tsx                    # Accueil
├── pieces-rechange/page.tsx    # Pièces de rechange
├── chaud-froid/page.tsx        # Chaud & Froid
├── joints-frigidaires/page.tsx # Joints frigidaires
├── produit/[id]/page.tsx       # Détail produit
├── contact/page.tsx            # Contact & Devis
├── admin/
│   ├── login/page.tsx          # Login admin (NextAuth)
│   ├── dashboard/page.tsx      # Dashboard stats
│   ├── produits/               # CRUD produits
│   └── logout/route.ts         # Déconnexion
└── api/
    ├── auth/[...nextauth]/     # NextAuth handler
    ├── contact/route.ts        # Formulaire contact
    └── admin/produits/         # API CRUD produits
```


