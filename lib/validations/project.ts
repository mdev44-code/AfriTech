import { z } from "zod";

export const PROJECT_CATEGORIES = ["Web", "Mobile", "Automatisation", "IA"] as const;
export type ProjectCategory = (typeof PROJECT_CATEGORIES)[number];

export const PROJECT_STATUSES = ["DRAFT", "PUBLISHED"] as const;
export type ProjectStatusValue = (typeof PROJECT_STATUSES)[number];

export const PROJECT_STATUS_LABELS: Record<ProjectStatusValue, string> = {
  DRAFT: "Brouillon",
  PUBLISHED: "Publié",
};

export const projectFormSchema = z.object({
  title: z.string().min(2, "Le titre doit faire au moins 2 caractères."),
  description: z.string().min(10, "La description doit faire au moins 10 caractères."),
  category: z.enum(PROJECT_CATEGORIES),
  technologies: z.string().optional(),
  images: z.array(z.string().url()),
  demoUrl: z
    .string()
    .optional()
    .refine((value) => !value || /^https?:\/\//.test(value), {
      message: "Le lien doit commencer par http:// ou https://",
    }),
  year: z
    .number()
    .int()
    .min(2000, "Année invalide.")
    .max(2100, "Année invalide."),
  status: z.enum(PROJECT_STATUSES),
  featured: z.boolean(),
});

export type ProjectFormValues = z.infer<typeof projectFormSchema>;

export const PROJECT_FORM_DEFAULT_VALUES: ProjectFormValues = {
  title: "",
  description: "",
  category: "Web",
  technologies: "",
  images: [],
  demoUrl: undefined,
  year: new Date().getFullYear(),
  status: "DRAFT",
  featured: false,
};

export function parseTechnologies(value?: string): string[] {
  if (!value) return [];
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}
