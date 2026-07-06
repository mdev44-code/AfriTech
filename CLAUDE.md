# CLAUDE.md — Projet Afritech

Ce fichier est lu automatiquement par Claude Code au début de chaque session. Il centralise le contexte du projet pour garder des réponses cohérentes tout au long du développement.

## Vue d'ensemble du projet

Afritech est une agence de création de logiciels web/mobile, d'automatisation et d'intégration d'IA. Ce dépôt contient :
- Une **landing page publique** (vitrine, projets, demande de devis, prise de rendez-vous)
- Un **dashboard administrateur** (gestion des sections, projets, devis, rendez-vous)

Design cible : fond noir, high-level, motion design soigné (inspiration chatflowai.co), 100% responsive.

## Stack technique

- Next.js 15 (App Router), TypeScript strict
- Tailwind CSS + shadcn/ui pour les composants de base
- Framer Motion pour les animations d'interface, GSAP + ScrollTrigger pour les animations liées au scroll
- Prisma ORM + PostgreSQL
- NextAuth.js pour l'authentification admin
- Resend pour les emails transactionnels
- `@react-pdf/renderer` pour la génération des PDF de devis
- React Hook Form + Zod pour tous les formulaires
- Déploiement cible : Vercel

## Palette de couleurs (à utiliser dans `tailwind.config.ts`)

```
--color-background: #0A0A0C   /* fond global, toujours noir */
--color-surface: #141419      /* cartes, surfaces légèrement surélevées */
--color-brand-blue: #153A63   /* bleu Afritech — identité, bordures, titres secondaires */
--color-brand-blue-light: #2C6CB8  /* variante claire du bleu, sur fond noir */
--color-accent: #F2A93B       /* ambre — CTA, liens actifs, highlights, animations */
--color-accent-hover: #FFC266
--color-text-primary: #F5F5F2
--color-text-secondary: #8A8F98
```

Règle stricte : jamais de fond blanc ou clair dans l'application. Le noir (`--color-background`) est la base partout, y compris dans le dashboard admin.

## Structure des dossiers

```
/app
  /(marketing)        → landing page publique
  /admin              → dashboard admin (protégé)
  /api                → route handlers
/components
  /ui                 → composants shadcn/ui
  /marketing          → composants spécifiques à la landing page
  /admin              → composants spécifiques au dashboard
  /shared             → composants réutilisés partout
/lib
  /db.ts              → client Prisma
  /auth.ts            → config NextAuth
  /validations         → schémas Zod
/prisma
  schema.prisma
```

## Conventions de code

- Composants en `PascalCase`, fichiers en `kebab-case`
- Server Components par défaut ; `"use client"` uniquement si interactivité/hooks nécessaires
- Toute logique métier (accès DB, envoi d'email, génération PDF) dans `/lib`, jamais directement dans les composants
- Validation systématique des inputs utilisateur avec Zod avant toute écriture en base
- Pas de `any` — typer explicitement, y compris les retours de fonctions async
- Un composant = une responsabilité ; découper plutôt que faire des fichiers de 300+ lignes

## Principes de motion design

- Toute animation se déclenche au scroll (intersection observer), jamais seulement au chargement
- Durée standard des transitions : 300-600ms, easing `cubic-bezier(0.16, 1, 0.3, 1)`
- Toujours respecter `prefers-reduced-motion`
- Les micro-interactions (hover boutons/cartes) utilisent l'ambre (`--color-accent`) comme couleur de feedback

## Commandes utiles

```
npm run dev              # serveur de développement
npm run build             # build de production
npm run lint              # ESLint
npx prisma studio         # explorer la base de données
npx prisma migrate dev    # créer/appliquer une migration
```

## Workflow Git

- Un commit par fonctionnalité stable et testée localement
- Messages de commit clairs en français, format : `feat: ajout du formulaire de devis`, `fix: correction animation hero`
- Ne jamais commit de `.env` ou de secrets

## État du projet

_(à mettre à jour au fil de l'avancement)_
- [x] Phase 0 — Setup
- [ ] Phase 1 — Landing page statique
- [ ] Phase 2 — Modèle de données
- [ ] Phase 3 — Formulaires connectés
- [ ] Phase 4 — Authentification admin
- [ ] Phase 5 — Dashboard : structure + Overview
- [ ] Phase 6 — CRUD Projets
- [ ] Phase 7 — Gestion des devis
- [ ] Phase 8 — Gestion des rendez-vous
- [ ] Phase 9 — CMS dynamique des sections
- [ ] Phase 10 — Polish, performance, SEO, QA
- [ ] Phase 11 — Déploiement