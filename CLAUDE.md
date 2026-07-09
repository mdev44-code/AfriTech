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

Règle stricte : **2 couleurs de marque maximum** — le bleu du logo, et le blanc. Pas d'ambre, pas de couleur tierce. Le noir est le fond, pas une "couleur de marque".

```
--color-background: #0A0A0C   /* fond global, toujours noir */
--color-surface: #141419      /* cartes, surfaces légèrement surélevées */
--color-brand-blue: #153A63   /* bleu du logo — identité, bordures, titres, fonds de cartes */
--color-brand-blue-light: #2C6CB8  /* variante claire du bleu — pour rester lisible sur fond noir (liens, icônes, highlights) */
--color-white: #FFFFFF        /* deuxième couleur de marque — CTA principal, texte fort, contours */
--color-text-primary: #F5F5F2
--color-text-secondary: #8A8F98
```

Il n'y a pas de `--color-accent` ambre : c'est corrigé après une première itération de Claude Code qui avait introduit du jaune/ambre par erreur — ce fichier fait foi, pas une réponse ou un code déjà généré.

**Comment utiliser seulement 2 couleurs sans que ce soit fade :**
- CTA principal ("Demander un devis", etc.) : fond **bleu foncé plein** (`--color-brand-blue`), texte **blanc** — fort contraste sur le noir, reprend directement les couleurs du logo.
- CTA secondaire : contour bleu clair (`--color-brand-blue-light`), fond transparent, texte blanc.
- Hover / feedback : le bleu du CTA principal s'éclaircit légèrement vers `--color-brand-blue-light` au survol — jamais une couleur différente.
- Liens actifs, badges, icônes : bleu clair sur fond noir.
- Pas de dégradé multicolore : si un fond animé est utilisé (Hero), il reste dans les nuances de bleu (du bleu foncé vers le bleu clair), jamais vers une autre teinte.

Règle stricte : jamais de fond blanc ou clair en arrière-plan de section. Le noir (`--color-background`) est la base partout, y compris dans le dashboard admin. Le blanc n'est utilisé qu'en texte, boutons pleins et petits accents — jamais en grand aplat de fond.

## Logo

- Le logo existe déjà (fichier fourni par l'utilisateur) et **ne doit jamais être recréé, redessiné ou remplacé par un logo texte généré**.
- Fichier source à placer dans `/public/logo.svg` (idéalement une version vectorielle ; à défaut `/public/logo.png` en haute résolution avec fond transparent).
- Un unique composant `components/shared/Logo.tsx` doit exposer le logo (via `next/image`), avec une prop `variant` ou `size` si une taille différente est nécessaire (header vs footer vs sidebar admin vs favicon). Ne jamais dupliquer le `<img>`/`<Image>` du logo dans plusieurs fichiers : toujours passer par ce composant.
- Utilisé dans : Header (landing page), Footer, Sidebar du dashboard admin, page de connexion `/admin/login`, favicon (`/app/favicon.ico` généré à partir du logo), et image Open Graph (`/app/opengraph-image`).

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
- Les micro-interactions (hover boutons/cartes) restent dans les nuances de bleu ou en blanc (glow, changement de luminosité) — jamais une autre couleur

## Sécurité & variables d'environnement (règle stricte)

- Claude Code ne doit **jamais lire, ouvrir, afficher ou modifier le contenu du fichier `.env`**.
  Ce fichier contient les vraies clés de production/développement et ne doit jamais apparaître
  dans une réponse, un log, un commit ou un fichier généré.
- Toute clé, mot de passe, token ou secret (base de données, Resend, NextAuth, etc.) doit être
  référencé uniquement via `process.env.NOM_DE_LA_VARIABLE`, jamais écrit en dur dans le code.
- Quand une nouvelle variable d'environnement est nécessaire, Claude Code doit :
  1. l'ajouter dans `.env.example` avec une valeur factice (ex: `RESEND_API_KEY=your_key_here`)
  2. me dire explicitement quelle variable ajouter dans mon vrai `.env`, sans jamais la générer
     ou la deviner lui-même
- `.env` doit toujours rester listé dans `.gitignore` — vérifier que c'est bien le cas dès la
  Phase 0 et à chaque fois qu'un fichier de config est touché.
- Si une tâche semble nécessiter de connaître la valeur réelle d'un secret, Claude Code doit
  s'arrêter et me le demander plutôt que d'y accéder ou de le supposer.

## Commandes utiles

```
npm run dev              # serveur de développement
npm run build             # build de production
npm run lint              # ESLint
npx prisma studio         # explorer la base de données
npx prisma migrate dev    # créer/appliquer une migration
```

## Workflow Git

- Le dépôt GitHub existe déjà et contient une branche `development` : **tout le travail de
  développement se fait sur cette branche**, jamais directement sur `main`.
- Avant de commencer une session, vérifier que la branche courante est bien `development`
  (`git branch --show-current`). Si ce n'est pas le cas, basculer dessus (`git checkout development`)
  avant toute modification.
- Dès qu'une fonctionnalité est ajoutée **et testée localement** (le serveur dev tourne, la
  fonctionnalité fonctionne comme attendu, pas d'erreur dans la console/terminal) :
  1. `git add .`
  2. `git commit -m "..."` avec un message clair en français (`feat: ...`, `fix: ...`)
  3. `git push origin development`
- Ne jamais commit ni pousser si la fonctionnalité n'a pas été testée, ou si `.env` ou un
  secret se trouve dans les fichiers modifiés — vérifier avec `git status` avant chaque commit.
- Ne jamais merger `development` dans `main` automatiquement : les mises en production restent
  une décision manuelle.
- Autorisation permanente : Claude Code peut commit et push sur `development` de façon autonome
  après chaque fonctionnalité testée, sans demander confirmation à chaque fois. Les seules
  actions qui nécessitent toujours une confirmation explicite sont : merger vers `main`, modifier
  l'historique (`rebase`, `force push`), ou toute action touchant `.env`/aux secrets.

## État du projet

_(à mettre à jour au fil de l'avancement)_
- [x] Phase 0 — Setup
- [x] Phase 1 — Landing page statique
- [x] Phase 2 — Modèle de données
- [x] Phase 3 — Formulaires connectés
- [x] Phase 4 — Authentification admin
- [ ] Phase 5 — Dashboard : structure + Overview
- [ ] Phase 6 — CRUD Projets
- [ ] Phase 7 — Gestion des devis
- [ ] Phase 8 — Gestion des rendez-vous
- [ ] Phase 9 — CMS dynamique des sections
- [ ] Phase 10 — Polish, performance, SEO, QA
- [ ] Phase 11 — Déploiement