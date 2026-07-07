# Afritech

Site web de **Afritech**, agence de création de logiciels web/mobile,
d'automatisation et d'intégration d'IA — landing page publique et dashboard
administrateur.

Design : fond noir, high-level, motion design soigné, 100% responsive.

## Stack technique

- [Next.js 15](https://nextjs.org) (App Router), TypeScript strict
- [Tailwind CSS](https://tailwindcss.com) + [shadcn/ui](https://ui.shadcn.com) pour les composants de base
- [Framer Motion](https://www.framer.com/motion/) pour les animations d'interface, [GSAP](https://gsap.com) + ScrollTrigger pour les animations liées au scroll
- [Prisma ORM](https://www.prisma.io) + PostgreSQL
- [React Hook Form](https://react-hook-form.com) + [Zod](https://zod.dev) pour la validation des formulaires
- Déploiement cible : [Vercel](https://vercel.com)

## État d'avancement

- [x] Landing page — Header (glassmorphism au scroll, menu mobile plein écran)
- [x] Landing page — Hero (animation en cascade, dégradé animé, badges flottants)
- [x] Landing page — Bandeau de technologies en défilement infini
- [x] Landing page — Services (cartes avec tilt 3D et glow au survol)
- [x] Landing page — Process (timeline verticale animée au scroll avec GSAP)
- [x] Landing page — Projets réalisés (grille filtrable par catégorie)
- [x] Landing page — Pourquoi Afritech (compteurs animés)
- [x] Landing page — FAQ (accordéon animé)
- [x] Landing page — Contact (formulaire + coordonnées)
- [x] Landing page — Footer (horloge de Dakar en temps réel, newsletter)
- [x] Page `/devis` — formulaire multi-étapes (UI + validation, sans logique backend)
- [x] Page `/rendez-vous` — calendrier de prise de rendez-vous (UI + validation, sans logique backend)
- [ ] Modèle de données (Prisma)
- [ ] Connexion des formulaires à une base de données / envoi d'emails
- [ ] Authentification admin
- [ ] Dashboard admin (Overview, CRUD Projets, devis, rendez-vous, CMS)
- [ ] Déploiement

## Structure du projet

```
/app
  /(marketing)        → landing page publique (/, /devis, /rendez-vous)
  /admin              → dashboard admin (à venir)
  /api                → route handlers (à venir)
/components
  /ui                 → composants shadcn/ui de base
  /marketing          → composants spécifiques à la landing page
  /admin              → composants du dashboard (à venir)
  /shared             → composants réutilisés partout (ex: Logo)
/lib
  /db.ts              → client Prisma
  /data               → données mock (projets, disponibilités)
  /validations        → schémas Zod
/prisma
  schema.prisma
```

## Prérequis

- Node.js 20+
- Une base de données PostgreSQL (pour les phases à venir)

## Installation

```bash
npm install
```

## Variables d'environnement

Copier `.env.example` en `.env` et renseigner les valeurs nécessaires :

```bash
cp .env.example .env
```

`.env` n'est jamais commité (voir `.gitignore`) et ne doit jamais être partagé.

## Commandes utiles

```bash
npm run dev              # serveur de développement
npm run build             # build de production
npm run lint              # ESLint
npx prisma studio         # explorer la base de données
npx prisma migrate dev    # créer/appliquer une migration
```

Le serveur de développement est disponible sur [http://localhost:3000](http://localhost:3000).

## Workflow Git

Tout le développement se fait sur la branche `development`. Les mises en
production vers `main` restent une décision manuelle.

## Documentation projet

Le fichier [`CLAUDE.md`](./CLAUDE.md) centralise les conventions de code, la
palette de couleurs, les principes de motion design et les règles de sécurité
du projet.
