# 🛠️ Choix Technologiques — Super Climat Shop (SCS)

> Ce document explique les raisons du choix de chaque technologie utilisée dans le projet **Super Climat Shop**, un site e-commerce de pièces électroménager & froid basé à Sousse, Tunisie.

---

## 📋 Vue d'ensemble de la Stack

| Couche | Technologie | Version |
|---|---|---|
| Framework principal | Next.js | 14.2.3 |
| Langage | TypeScript | ^5 |
| UI / Frontend | React + CSS Vanilla | ^18 |
| ORM | Prisma | ^5.13.0 |
| Base de données | PostgreSQL (via Supabase) | — |
| Stockage fichiers | Supabase Storage | — |
| Authentification | NextAuth.js | ^4.24.7 |
| Hashage mots de passe | bcryptjs | ^2.4.3 |
| Email | Nodemailer | ^7.0.13 |
| Déploiement | Vercel | — |
| Dev local | XAMPP (Node.js) | — |

---

## ⚙️ Frontend

### Next.js 14 (App Router)

**Pourquoi Next.js ?**

Next.js est le framework React le plus mature et le plus adopté en production. Il a été choisi pour plusieurs raisons fondamentales :

- **Rendu hybride (SSR/SSG/ISR)** : Les pages produits et catégories sont rendues côté serveur (`Server Components`), ce qui permet un chargement ultra-rapide et une indexation parfaite par les moteurs de recherche (SEO). C'est crucial pour un site commercial dont la visibilité sur Google est vitale.
- **API Routes intégrées** : Next.js permet de créer des routes API (`/app/api/...`) directement dans le projet, sans avoir besoin d'un backend séparé (comme Express ou Laravel). Cela simplifie énormément le déploiement et la maintenance.
- **App Router** : La nouvelle architecture `app/` (introduite en Next.js 13+) permet un découpage précis entre Server Components et Client Components, réduisant la quantité de JavaScript envoyée au navigateur.
- **Server Actions** : Utilisés pour les opérations admin (ajout, modification, suppression de produits), ils permettent d'exécuter du code serveur directement depuis un composant React, sans écrire une route API explicite.
- **Déploiement natif sur Vercel** : Next.js est développé par Vercel, la plateforme sur laquelle le site est hébergé. La compatibilité est parfaite et le déploiement est automatisé.

---

### TypeScript

**Pourquoi TypeScript ?**

TypeScript est utilisé à la place de JavaScript pur pour toute la base de code (`.ts` / `.tsx`).

- **Sécurité des types** : Les erreurs de type sont détectées à la compilation, pas en production. Cela évite des bugs silencieux comme passer `undefined` à une fonction qui attend un `string`.
- **Autocomplétion et refactoring** : L'IDE reconnaît les structures Prisma (modèles `Produit`, `Admin`, etc.), ce qui accélère le développement et réduit les erreurs.
- **Cohérence avec l'écosystème** : Next.js, Prisma et NextAuth sont nativement typés. Tout s'intègre naturellement.
- **Maintenance à long terme** : Un code fortement typé est plus facile à maintenir et à faire évoluer.

---

### React 18

**Pourquoi React ?**

React est la bibliothèque UI choisie par Next.js. React 18 apporte :

- **Concurrent Features** : Amélioration des performances de rendu.
- **Server Components** : Composants qui s'exécutent uniquement sur le serveur, sans JavaScript côté client.
- **Écosystème riche** : Bibliothèques, hooks, patterns — React est le standard de facto pour les applications web modernes.

---

### CSS Vanilla + Google Fonts + Font Awesome

**Pourquoi pas Tailwind ou un framework CSS ?**

- **Contrôle total** : Un fichier CSS centralisé (`/public/css/style.css`) donne un contrôle complet sur le design sans dépendre d'une syntaxe propriétaire.
- **Performances** : Pas de bibliothèque CSS volumineuse à charger. Seul le CSS nécessaire est présent.
- **Maintenabilité** : Les règles CSS sont lisibles et modifiables sans connaissance de Tailwind/Bootstrap.
- **Google Fonts (Inter)** : Police moderne, professionnelle et lisible, choisie pour renforcer la crédibilité visuelle du site.
- **Font Awesome 6** : Bibliothèque d'icônes complète pour les icônes de navigation, catégories, et interface admin.

---

## 🗄️ Base de Données

### PostgreSQL

**Pourquoi PostgreSQL ?**

PostgreSQL est la base de données relationnelle open-source la plus avancée et fiable disponible.

- **Relationnel et structuré** : Les données du site (produits, catégories, sous-catégories, contacts, admins) sont naturellement relationnelles. Un modèle SQL est plus adapté qu'une base NoSQL (comme MongoDB) pour ce type de données.
- **Support des types avancés** : Énumérations (`enum Categorie`), types décimaux précis (`Decimal(10,2)` pour les prix), texte long (`Text` pour les descriptions).
- **Fiabilité et transactions ACID** : Garantit l'intégrité des données même en cas de pannes.
- **Compatibilité Prisma & Supabase** : PostgreSQL est le moteur natif de Supabase, avec un support complet dans Prisma.

---

### Supabase

**Pourquoi Supabase ?**

Supabase est une plateforme Backend-as-a-Service (BaaS) open-source construite sur PostgreSQL.

- **Hébergement PostgreSQL managé** : Pas besoin de gérer un serveur de base de données. Supabase s'occupe des sauvegardes, de la disponibilité et de la sécurité.
- **Double URL de connexion** :
  - `DATABASE_URL` : URL de connexion via PgBouncer (pooler de connexions) — utilisée par Prisma Client en production pour éviter de saturer les connexions.
  - `DIRECT_URL` : Connexion directe à PostgreSQL — utilisée par les migrations Prisma (`prisma db push`).
- **Supabase Storage** : Service de stockage de fichiers (images produits) intégré à Supabase. Les images sont uploadées avec la clé de service (`SUPABASE_SERVICE_KEY`) et accessibles publiquement via URL CDN.
- **Row-Level Security (RLS)** : Supabase permet d'activer des politiques de sécurité au niveau des lignes pour protéger les données sensibles (table `admins`).
- **Gratuit pour les projets de petite taille** : Le plan gratuit de Supabase est suffisant pour ce type de site vitrine/e-commerce.
- **Interface d'administration** : Dashboard web pour visualiser et gérer les données directement.

---

## 🔐 Authentification & Sécurité

### NextAuth.js (v4)

**Pourquoi NextAuth ?**

NextAuth.js est la solution d'authentification de référence pour les applications Next.js.

- **Intégration native Next.js** : Gère les sessions, les tokens JWT et les redirections sans configuration complexe.
- **Stratégie JWT** : Les sessions sont stockées dans des cookies JWT signés, sans base de données de sessions. Durée de vie de 30 minutes pour limiter les risques de détournement.
- **CredentialsProvider** : Permet une authentification par nom d'utilisateur/mot de passe custom, adaptée à un admin unique (`scsadmin`).
- **Protection des routes via Middleware** : Le fichier `middleware.ts` intercepte toutes les requêtes vers `/admin/*` et vérifie la présence d'un token valide avant d'autoriser l'accès.
- **Pages d'authentification personnalisées** : Redirection automatique vers `/admin/login` en cas d'accès non autorisé.

---

### bcryptjs

**Pourquoi bcrypt ?**

- **Hashage sécurisé des mots de passe** : Les mots de passe des admins ne sont jamais stockés en clair dans la base de données. bcrypt applique un sel aléatoire et un algorithme de hachage résistant aux attaques par force brute.
- **bcryptjs vs bcrypt natif** : La version pure JavaScript (`bcryptjs`) évite les dépendances aux binaires natifs Node.js, ce qui facilite le déploiement sur Vercel (environnement sans accès au compilateur).

---

## 📧 Email

### Nodemailer

**Pourquoi Nodemailer ?**

- **Envoi d'emails depuis Node.js** : Utilisé pour envoyer les messages soumis via le formulaire de contact à l'adresse email de la boutique.
- **Flexible** : Compatible avec n'importe quel serveur SMTP (Gmail, Mailgun, etc.).
- **Léger** : Pas de dépendance externe lourde, juste une configuration SMTP.

---

## 🗂️ ORM

### Prisma

**Pourquoi Prisma ?**

Prisma est l'ORM (Object-Relational Mapper) le plus moderne pour Node.js/TypeScript.

- **Schéma déclaratif** (`schema.prisma`) : La structure de la base de données est définie en un seul fichier source de vérité. Les migrations sont générées automatiquement.
- **Client typé auto-généré** : Après `prisma generate`, un client TypeScript est créé. Chaque requête est typée — impossible de demander un champ qui n'existe pas.
- **Singleton en dev** : Le fichier `lib/prisma.ts` exporte une instance singleton du client Prisma pour éviter les connexions multiples en mode hot-reload (`next dev`).
- **Migrations simples** : `prisma db push` synchronise le schéma avec la base de données sans écrire de SQL à la main.
- **Prisma Studio** : Interface graphique pour visualiser et modifier les données pendant le développement.

---

## 🚀 Déploiement

### Vercel

**Pourquoi Vercel ?**

- **Plateforme officielle de Next.js** : Vercel est créé par la même équipe que Next.js. Support natif de toutes les fonctionnalités (Server Components, Server Actions, Edge Middleware).
- **Déploiement sans configuration** : Connexion au repository → build automatique → mise en ligne. Variables d'environnement gérées via le dashboard.
- **Serverless Functions** : Les routes API et Server Actions sont automatiquement convertis en fonctions serverless scalables.
- **CDN global** : Les assets statiques (CSS, JS, images) sont distribués via un réseau mondial, assurant des temps de chargement rapides pour les visiteurs tunisiens et internationaux.
- **Previews automatiques** : Chaque déploiement génère une URL de prévisualisation unique.

---

## 🏠 Développement Local

### XAMPP

**Pourquoi XAMPP ?**

- **Environnement local déjà en place** : XAMPP est utilisé comme serveur de développement sur la machine locale. Le projet Next.js est placé dans `htdocs/scs-next` et lancé via `npm run dev`.
- **Note** : XAMPP sert ici uniquement de dossier de travail. Le serveur Apache/MySQL intégré à XAMPP n'est **pas** utilisé — Next.js tourne sur son propre serveur de développement (port 3000).

---

## 📐 Architecture Globale

```
┌─────────────────────────────────────────────┐
│                NAVIGATEUR                   │
│         (HTML + CSS + JS minimal)           │
└──────────────────┬──────────────────────────┘
                   │ HTTPS
┌──────────────────▼──────────────────────────┐
│              VERCEL (CDN + Edge)            │
│  ┌────────────────────────────────────────┐ │
│  │         Next.js 14 (App Router)        │ │
│  │  ┌─────────────┐  ┌─────────────────┐ │ │
│  │  │   Pages     │  │   API Routes    │ │ │
│  │  │  (SSR/SSG)  │  │  /api/admin/.. │ │ │
│  │  └─────────────┘  └────────┬────────┘ │ │
│  │                            │           │ │
│  │  ┌─────────────────────────▼─────────┐│ │
│  │  │     Prisma Client (TypeScript)    ││ │
│  │  └─────────────────────────┬─────────┘│ │
│  └────────────────────────────┼──────────┘ │
└───────────────────────────────┼────────────┘
                                │
┌───────────────────────────────▼────────────┐
│              SUPABASE                       │
│  ┌──────────────────┐  ┌────────────────┐  │
│  │  PostgreSQL DB   │  │    Storage     │  │
│  │ (produits, admins│  │  (images PNG)  │  │
│  │  contacts, etc.) │  └────────────────┘  │
│  └──────────────────┘                      │
└────────────────────────────────────────────┘
```

---

## 🧩 Pourquoi cette combinaison en particulier ?

| Critère | Justification |
|---|---|
| **Simplicité** | Une seule codebase (front + back + API) — pas de projet séparé backend |
| **Performance** | SSR pour le SEO + Serverless pour la scalabilité |
| **Sécurité** | JWT signé, bcrypt, RLS Supabase, middleware de protection |
| **Coût** | Stack entièrement gratuite pour ce niveau de trafic (Vercel Free + Supabase Free) |
| **Maintenance** | TypeScript + Prisma = moins de bugs, meilleure lisibilité |
| **Déploiement** | `npx vercel --prod` suffit — aucune infrastructure à gérer |

---

*Document rédigé le 17 mai 2026 — Super Climat Shop v1.0*
