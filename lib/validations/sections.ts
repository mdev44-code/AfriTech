import { z } from "zod";

export const BUILTIN_SECTION_TYPES = [
  "hero",
  "tech-marquee",
  "services",
  "process",
  "projects",
  "why-afritech",
  "faq",
  "contact",
] as const;

export type BuiltinSectionType = (typeof BUILTIN_SECTION_TYPES)[number];

export const builtinContentSchema = z.object({
  title: z
    .string()
    .min(1, "Le titre est requis.")
    .max(200, "Le titre est limité à 200 caractères.")
    .optional(),
  description: z
    .string()
    .min(1, "La description est requise.")
    .max(500, "La description est limitée à 500 caractères.")
    .optional(),
});

export type BuiltinContent = z.infer<typeof builtinContentSchema>;

export const richTextContentSchema = z.object({
  title: z.string().min(2, "Le titre est requis."),
  body: z
    .string()
    .min(10, "Le contenu doit faire au moins 10 caractères.")
    .max(4000, "Le contenu est limité à 4000 caractères."),
});

export const ctaContentSchema = z.object({
  title: z.string().min(2, "Le titre est requis."),
  description: z
    .string()
    .min(10, "La description doit faire au moins 10 caractères.")
    .max(500, "La description est limitée à 500 caractères."),
  buttonLabel: z.string().min(1, "Le libellé du bouton est requis."),
  buttonHref: z
    .string()
    .min(1, "Le lien du bouton est requis.")
    .refine(
      (value) => value.startsWith("/") || /^https?:\/\//.test(value),
      "Le lien doit être une URL absolue ou un chemin commençant par /."
    ),
});

export const imageTextContentSchema = z.object({
  title: z.string().min(2, "Le titre est requis."),
  body: z
    .string()
    .min(10, "Le contenu doit faire au moins 10 caractères.")
    .max(2000, "Le contenu est limité à 2000 caractères."),
  imageUrl: z.string().url("L'URL de l'image est invalide."),
  imagePosition: z.enum(["left", "right"]).default("right"),
});

export const CUSTOM_SECTION_TEMPLATES = {
  "custom-rich-text": {
    label: "Bloc texte riche",
    schema: richTextContentSchema,
  },
  "custom-cta": {
    label: "Bandeau CTA",
    schema: ctaContentSchema,
  },
  "custom-image-text": {
    label: "Image + texte",
    schema: imageTextContentSchema,
  },
} as const;

export type CustomSectionType = keyof typeof CUSTOM_SECTION_TEMPLATES;

export const CUSTOM_SECTION_TYPES = Object.keys(
  CUSTOM_SECTION_TEMPLATES
) as CustomSectionType[];

export function isCustomSectionType(value: string): value is CustomSectionType {
  return (CUSTOM_SECTION_TYPES as string[]).includes(value);
}

export const createSectionSchema = z.object({
  name: z
    .string()
    .min(2, "Le titre doit faire au moins 2 caractères.")
    .max(80, "Le titre est limité à 80 caractères."),
  type: z.enum(CUSTOM_SECTION_TYPES as [CustomSectionType, ...CustomSectionType[]]),
  content: z.record(z.string(), z.unknown()),
});

export type CreateSectionInput = z.infer<typeof createSectionSchema>;
