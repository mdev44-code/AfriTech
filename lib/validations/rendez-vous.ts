import { z } from "zod";

export const rendezVousContactSchema = z.object({
  fullName: z.string().min(2, "Votre nom est requis."),
  email: z.string().email("Adresse email invalide."),
  phone: z.string().optional(),
  message: z
    .string()
    .max(500, "Le message est limité à 500 caractères.")
    .optional(),
});

export type RendezVousContactValues = z.infer<typeof rendezVousContactSchema>;

export const RENDEZ_VOUS_CONTACT_DEFAULT_VALUES: RendezVousContactValues = {
  fullName: "",
  email: "",
  phone: "",
  message: "",
};

export const rendezVousBookingSchema = rendezVousContactSchema.extend({
  scheduledAt: z.string().datetime({ message: "Créneau invalide." }),
});

export type RendezVousBookingValues = z.infer<typeof rendezVousBookingSchema>;
