import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  await prisma.quoteLine.deleteMany();
  await prisma.quote.deleteMany();
  await prisma.quoteRequest.deleteMany();
  await prisma.appointment.deleteMany();
  await prisma.section.deleteMany();
  await prisma.project.deleteMany();
  await prisma.user.deleteMany();

  await prisma.user.createMany({
    data: [
      {
        email: "admin@afritech.dev",
        password: await bcrypt.hash("SuperAdmin!2026", 10),
        role: "SUPERADMIN",
      },
      {
        email: "fatou.diallo@afritech.dev",
        password: await bcrypt.hash("Admin!2026", 10),
        role: "ADMIN",
      },
      {
        email: "ismael.toure@afritech.dev",
        password: await bcrypt.hash("Editeur!2026", 10),
        role: "EDITOR",
      },
    ],
  });

  await prisma.project.createMany({
    data: [
      {
        title: "Kolibri Pay",
        slug: "kolibri-pay",
        description:
          "Application mobile de paiement mobile money multi-opérateurs pour l'Afrique de l'Ouest, avec réconciliation automatique et tableau de bord marchand.",
        category: "Mobile",
        technologies: ["React Native", "Node.js", "PostgreSQL", "Stripe Connect"],
        images: [
          "https://images.afritech.dev/projects/kolibri-pay/cover.jpg",
          "https://images.afritech.dev/projects/kolibri-pay/dashboard.jpg",
        ],
        demoUrl: "https://kolibri-pay.demo.afritech.dev",
        year: 2025,
        status: "PUBLISHED",
        featured: true,
      },
      {
        title: "MarchéConnect",
        slug: "marche-connect",
        description:
          "Marketplace e-commerce B2B mettant en relation producteurs agricoles locaux et distributeurs, avec gestion de stock en temps réel.",
        category: "Web",
        technologies: ["Next.js", "TypeScript", "Prisma", "Tailwind CSS"],
        images: ["https://images.afritech.dev/projects/marche-connect/cover.jpg"],
        demoUrl: "https://marche-connect.demo.afritech.dev",
        year: 2025,
        status: "PUBLISHED",
        featured: true,
      },
      {
        title: "FluxRH",
        slug: "flux-rh",
        description:
          "Automatisation du processus de recrutement : tri des CV, planification d'entretiens et relances candidats sans intervention manuelle.",
        category: "Automatisation",
        technologies: ["Python", "n8n", "OpenAI API", "PostgreSQL"],
        images: ["https://images.afritech.dev/projects/flux-rh/cover.jpg"],
        demoUrl: null,
        year: 2024,
        status: "PUBLISHED",
        featured: false,
      },
      {
        title: "AssistPro",
        slug: "assist-pro",
        description:
          "Chatbot d'assistance client basé sur un modèle de langage, intégré au CRM existant pour répondre en langage naturel aux tickets de premier niveau.",
        category: "IA",
        technologies: ["Next.js", "OpenAI API", "LangChain", "Redis"],
        images: ["https://images.afritech.dev/projects/assist-pro/cover.jpg"],
        demoUrl: "https://assist-pro.demo.afritech.dev",
        year: 2024,
        status: "PUBLISHED",
        featured: true,
      },
      {
        title: "TontineDigitale",
        slug: "tontine-digitale",
        description:
          "Plateforme de gestion de tontines communautaires avec suivi des cotisations, rappels automatiques et historique transparent.",
        category: "Web",
        technologies: ["Next.js", "Prisma", "PostgreSQL", "Resend"],
        images: ["https://images.afritech.dev/projects/tontine-digitale/cover.jpg"],
        demoUrl: null,
        year: 2023,
        status: "PUBLISHED",
        featured: false,
      },
      {
        title: "LogistiTrack",
        slug: "logisti-track",
        description:
          "Suivi de flotte de livraison en temps réel avec optimisation d'itinéraires et notifications SMS aux clients finaux.",
        category: "Mobile",
        technologies: ["Flutter", "Node.js", "MongoDB", "Twilio"],
        images: ["https://images.afritech.dev/projects/logisti-track/cover.jpg"],
        demoUrl: null,
        year: 2026,
        status: "DRAFT",
        featured: false,
      },
    ],
  });

  const pendingRequest = await prisma.quoteRequest.create({
    data: {
      projectType: "Application mobile",
      budget: "5000-10000€",
      description:
        "Nous souhaitons une application mobile pour gérer les réservations de notre salon de coiffure, avec paiement en ligne et rappels automatiques.",
      name: "Aminata Cissé",
      email: "aminata.cisse@example.com",
      phone: "+221771234567",
      status: "PENDING",
    },
  });

  const inProgressRequest = await prisma.quoteRequest.create({
    data: {
      projectType: "Site vitrine",
      budget: "1000-3000€",
      description:
        "Refonte complète du site vitrine de notre cabinet d'architecture, avec portfolio de projets et formulaire de contact.",
      name: "Moussa Bamba",
      email: "moussa.bamba@example.com",
      phone: "+22507080910",
      status: "IN_PROGRESS",
    },
  });

  const quotedRequest = await prisma.quoteRequest.create({
    data: {
      projectType: "Automatisation",
      budget: "3000-5000€",
      description:
        "Automatiser la génération de nos factures mensuelles et leur envoi par email à partir de notre tableur existant.",
      name: "Chantal Mbeki",
      email: "chantal.mbeki@example.com",
      phone: "+27821234567",
      status: "QUOTED",
    },
  });

  const closedRequest = await prisma.quoteRequest.create({
    data: {
      projectType: "Plateforme e-commerce",
      budget: "10000-20000€",
      description:
        "Boutique en ligne pour la vente de produits artisanaux avec paiement mobile money et gestion multi-vendeurs.",
      name: "Ibrahim Konaté",
      email: "ibrahim.konate@example.com",
      phone: "+22391234567",
      status: "CLOSED",
    },
  });

  await prisma.quote.create({
    data: {
      quoteRequestId: quotedRequest.id,
      total: 3850,
      status: "SENT",
      sentAt: new Date("2026-06-15T10:00:00Z"),
      lines: {
        create: [
          { label: "Analyse des besoins et cadrage", price: 450, quantity: 1 },
          { label: "Développement du script de génération de factures", price: 1800, quantity: 1 },
          { label: "Intégration envoi automatique par email", price: 900, quantity: 1 },
          { label: "Tests et mise en production", price: 700, quantity: 1 },
        ],
      },
    },
  });

  await prisma.quote.create({
    data: {
      quoteRequestId: closedRequest.id,
      total: 14500,
      status: "ACCEPTED",
      sentAt: new Date("2026-05-02T09:30:00Z"),
      lines: {
        create: [
          { label: "UX/UI design de la boutique", price: 2500, quantity: 1 },
          { label: "Développement plateforme e-commerce", price: 8000, quantity: 1 },
          { label: "Intégration paiement mobile money", price: 2500, quantity: 1 },
          { label: "Espace vendeurs et gestion des commissions", price: 1500, quantity: 1 },
        ],
      },
    },
  });

  await prisma.appointment.createMany({
    data: [
      {
        name: "Aminata Cissé",
        email: "aminata.cisse@example.com",
        scheduledAt: new Date("2026-07-15T09:00:00Z"),
        status: "PENDING",
      },
      {
        name: "Moussa Bamba",
        email: "moussa.bamba@example.com",
        scheduledAt: new Date("2026-07-12T14:30:00Z"),
        status: "CONFIRMED",
      },
      {
        name: "Chantal Mbeki",
        email: "chantal.mbeki@example.com",
        scheduledAt: new Date("2026-06-20T11:00:00Z"),
        status: "COMPLETED",
      },
      {
        name: "Ibrahim Konaté",
        email: "ibrahim.konate@example.com",
        scheduledAt: new Date("2026-06-25T16:00:00Z"),
        status: "CANCELLED",
      },
    ],
  });

  await prisma.section.createMany({
    data: [
      {
        name: "Hero",
        type: "hero",
        order: 1,
        visible: true,
        content: {
          title: "On construit vos logiciels, sites et automatisations",
          subtitle: "Agence de création web/mobile, automatisation et intégration IA",
          ctaLabel: "Demander un devis",
        },
      },
      {
        name: "Bandeau technologies",
        type: "tech-marquee",
        order: 2,
        visible: true,
        content: {},
      },
      {
        name: "Nos services",
        type: "services",
        order: 3,
        visible: true,
        content: {
          items: [
            { title: "Applications web", description: "Sites et plateformes sur mesure" },
            { title: "Applications mobiles", description: "iOS et Android natifs ou cross-platform" },
            { title: "Automatisation", description: "Workflows métier sans intervention manuelle" },
            { title: "Intégration IA", description: "Chatbots, assistants et modèles sur mesure" },
          ],
        },
      },
      {
        name: "Notre process",
        type: "process",
        order: 4,
        visible: true,
        content: {
          steps: [
            { title: "Cadrage", description: "Analyse des besoins et devis" },
            { title: "Conception", description: "Maquettes et architecture technique" },
            { title: "Développement", description: "Sprints itératifs avec démos régulières" },
            { title: "Livraison", description: "Déploiement et accompagnement" },
          ],
        },
      },
      {
        name: "Projets",
        type: "projects",
        order: 5,
        visible: true,
        content: { limit: 6, filterFeatured: true },
      },
      {
        name: "Pourquoi Afritech",
        type: "why-afritech",
        order: 6,
        visible: true,
        content: {},
      },
      {
        name: "FAQ",
        type: "faq",
        order: 7,
        visible: true,
        content: {
          items: [
            { question: "Combien coûte un projet ?", answer: "Cela dépend du périmètre — demandez un devis gratuit." },
            { question: "Quels sont les délais moyens ?", answer: "Entre 4 et 12 semaines selon la complexité." },
          ],
        },
      },
      {
        name: "Contact",
        type: "contact",
        order: 8,
        visible: true,
        content: { email: "contact@afritech.dev", phone: "+221338001122" },
      },
    ],
  });

  console.log("Seed terminé avec succès.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
