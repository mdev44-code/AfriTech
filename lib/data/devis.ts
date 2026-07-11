import type { QuoteRequest, Quote, QuoteLine } from "@prisma/client";

import { db } from "@/lib/db";
import { BUDGET_RANGES, PROJECT_TYPES } from "@/lib/validations/devis";

export function getProjectTypeLabel(value: string): string {
  return PROJECT_TYPES.find((type) => type.value === value)?.label ?? value;
}

export function getBudgetLabel(value: string | null): string {
  if (!value) return "—";
  return BUDGET_RANGES.find((range) => range.value === value)?.label ?? value;
}

export const DEVIS_DISPLAY_STATUSES = [
  "NOUVEAU",
  "EN_COURS",
  "ENVOYE",
  "ACCEPTE",
  "REFUSE",
] as const;

export type DevisDisplayStatus = (typeof DEVIS_DISPLAY_STATUSES)[number];

export const DEVIS_DISPLAY_STATUS_LABELS: Record<DevisDisplayStatus, string> = {
  NOUVEAU: "Nouveau",
  EN_COURS: "En cours",
  ENVOYE: "Devis envoyé",
  ACCEPTE: "Accepté",
  REFUSE: "Refusé",
};

export type QuoteRequestWithQuote = QuoteRequest & {
  quote: (Quote & { lines: QuoteLine[] }) | null;
};

export function getDisplayStatus(quoteRequest: {
  status: QuoteRequest["status"];
  quote: { status: Quote["status"] } | null;
}): DevisDisplayStatus {
  if (!quoteRequest.quote) {
    return quoteRequest.status === "IN_PROGRESS" ? "EN_COURS" : "NOUVEAU";
  }

  switch (quoteRequest.quote.status) {
    case "DRAFT":
      return "EN_COURS";
    case "SENT":
      return "ENVOYE";
    case "ACCEPTED":
      return "ACCEPTE";
    case "REJECTED":
      return "REFUSE";
    case "EXPIRED":
      return "ENVOYE";
  }
}

export async function listQuoteRequests(
  displayStatus?: DevisDisplayStatus,
): Promise<QuoteRequestWithQuote[]> {
  const all = await db.quoteRequest.findMany({
    orderBy: { createdAt: "desc" },
    include: { quote: { include: { lines: true } } },
  });

  if (!displayStatus) return all;

  return all.filter((item) => getDisplayStatus(item) === displayStatus);
}

export async function getQuoteRequestById(
  id: string,
): Promise<QuoteRequestWithQuote | null> {
  return db.quoteRequest.findUnique({
    where: { id },
    include: { quote: { include: { lines: true } } },
  });
}
