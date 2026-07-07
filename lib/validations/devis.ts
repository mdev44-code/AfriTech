import { z } from "zod";

export const PROJECT_TYPES = [
  {
    value: "web",
    label: "Site web",
    description: "Vitrine, e-commerce ou plateforme sur-mesure.",
  },
  {
    value: "mobile",
    label: "Application mobile",
    description: "iOS, Android ou cross-platform.",
  },
  {
    value: "automatisation",
    label: "Automatisation",
    description: "Workflows et intégrations métier.",
  },
  {
    value: "ia",
    label: "Intégration IA",
    description: "Assistants, agents et outils IA sur-mesure.",
  },
  {
    value: "autre",
    label: "Autre",
    description: "Un besoin différent ? Parlons-en.",
  },
] as const;

export const BUDGET_RANGES = [
  { value: "moins-5k", label: "Moins de 5 000 €" },
  { value: "5k-15k", label: "5 000 € – 15 000 €" },
  { value: "15k-30k", label: "15 000 € – 30 000 €" },
  { value: "plus-30k", label: "Plus de 30 000 €" },
  { value: "non-defini", label: "Je ne sais pas encore" },
] as const;

export const devisFormSchema = z.object({
  projectType: z.string().min(1, "Sélectionnez un type de projet."),
  budget: z.string().min(1, "Sélectionnez un budget approximatif."),
  description: z
    .string()
    .min(30, "Décrivez votre besoin en au moins 30 caractères.")
    .max(2000, "La description est limitée à 2000 caractères."),
  fullName: z.string().min(2, "Votre nom est requis."),
  email: z.string().email("Adresse email invalide."),
  company: z.string().optional(),
  phone: z.string().optional(),
});

export type DevisFormValues = z.infer<typeof devisFormSchema>;

export const DEVIS_FORM_DEFAULT_VALUES: DevisFormValues = {
  projectType: "",
  budget: "",
  description: "",
  fullName: "",
  email: "",
  company: "",
  phone: "",
};

export const DEVIS_STEPS = [
  { id: "project-type", title: "Type de projet", fields: ["projectType"] },
  { id: "budget", title: "Budget", fields: ["budget"] },
  { id: "description", title: "Votre besoin", fields: ["description"] },
  {
    id: "contact",
    title: "Coordonnées",
    fields: ["fullName", "email", "company", "phone"],
  },
] as const satisfies ReadonlyArray<{
  id: string;
  title: string;
  fields: readonly (keyof DevisFormValues)[];
}>;
