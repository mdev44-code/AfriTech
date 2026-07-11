import type { Currency } from "@prisma/client";

export const CURRENCIES = ["EUR", "USD", "XOF"] as const satisfies readonly Currency[];

export const CURRENCY_LABELS: Record<Currency, string> = {
  EUR: "Euro (€)",
  USD: "Dollar (US$)",
  XOF: "Franc CFA (FCFA)",
};

export const CURRENCY_SYMBOLS: Record<Currency, string> = {
  EUR: "€",
  USD: "US$",
  XOF: "FCFA",
};

export const DEFAULT_CURRENCY: Currency = "XOF";

/**
 * Intl formats fr-FR currency amounts with a narrow no-break space (U+202F)
 * as the thousands separator. Base PDF fonts don't have that glyph and
 * render it as a stray "/", so it's normalized to a regular space here.
 */
export function formatCurrency(value: number, currency: Currency = DEFAULT_CURRENCY): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency,
  })
    .format(value)
    .replace(/[  ]/g, " ");
}
