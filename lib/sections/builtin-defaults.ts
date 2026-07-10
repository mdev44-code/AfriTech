import type { BuiltinSectionType } from "@/lib/validations/sections";

export interface BuiltinDefaultContent {
  title: string;
  description: string;
}

export const BUILTIN_DEFAULT_CONTENT: Partial<
  Record<BuiltinSectionType, BuiltinDefaultContent>
> = {
  hero: {
    title: "Des logiciels sur-mesure,\npropulsés par l'IA.",
    description:
      "Afritech conçoit des applications web et mobiles, automatise vos processus et intègre l'IA pour accélérer votre croissance.",
  },
  services: {
    title: "Nos services",
    description:
      "Des solutions complètes pour transformer vos idées en produits digitaux performants.",
  },
  process: {
    title: "Notre process",
    description:
      "Une méthode claire, en 5 étapes, du premier échange jusqu'au support continu.",
  },
  projects: {
    title: "Projets réalisés",
    description:
      "Un aperçu des produits que nous concevons pour nos clients, tous secteurs confondus.",
  },
  "why-afritech": {
    title: "Pourquoi Afritech",
    description: "Ce qui distingue notre approche, en quelques chiffres.",
  },
  faq: {
    title: "Questions fréquentes",
    description: "Tout ce qu'il faut savoir avant de démarrer votre projet.",
  },
  contact: {
    title: "Discutons de votre projet",
    description:
      "Une question, un besoin précis ou juste envie d'échanger ? Écrivez-nous, ou passez directement par l'une de nos démarches dédiées.",
  },
};

export function isEditableBuiltinType(
  type: BuiltinSectionType
): type is keyof typeof BUILTIN_DEFAULT_CONTENT {
  return type in BUILTIN_DEFAULT_CONTENT;
}
