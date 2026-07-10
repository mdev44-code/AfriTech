import { z } from "zod";

export const quoteLineSchema = z.object({
  label: z.string().min(1, "Le libellé est requis."),
  quantity: z.number().int().min(1, "La quantité doit être au moins 1."),
  price: z.number().min(0, "Le prix doit être positif."),
});

export type QuoteLineValues = z.infer<typeof quoteLineSchema>;

export const quoteFormSchema = z.object({
  lines: z.array(quoteLineSchema).min(1, "Ajoutez au moins une ligne."),
  conditions: z.string().max(4000, "Les conditions sont limitées à 4000 caractères.").optional(),
});

export type QuoteFormValues = z.infer<typeof quoteFormSchema>;

export const QUOTE_FORM_DEFAULT_VALUES: QuoteFormValues = {
  lines: [{ label: "", quantity: 1, price: 0 }],
  conditions: "",
};
