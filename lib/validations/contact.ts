import { z } from "zod";

export const contactSchema = z.object({
  fullName: z.string().min(2, "Votre nom est requis."),
  email: z.string().email("Adresse email invalide."),
  message: z
    .string()
    .min(10, "Votre message doit contenir au moins 10 caractères.")
    .max(1000, "Le message est limité à 1000 caractères."),
});

export type ContactFormValues = z.infer<typeof contactSchema>;

export const CONTACT_DEFAULT_VALUES: ContactFormValues = {
  fullName: "",
  email: "",
  message: "",
};
