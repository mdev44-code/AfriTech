import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import {
  getQuoteRequestById,
  getDisplayStatus,
  getBudgetLabel,
  getProjectTypeLabel,
} from "@/lib/data/devis";
import { DevisStatusBadge } from "@/components/admin/devis/status-badge";
import { QuoteForm } from "@/components/admin/devis/quote-form";
import { QuoteActions } from "@/components/admin/devis/quote-actions";
import { QUOTE_FORM_DEFAULT_VALUES } from "@/lib/validations/quote";

export const metadata: Metadata = {
  title: "Détail devis — Admin Afritech",
};

interface AdminDevisDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminDevisDetailPage({
  params,
}: AdminDevisDetailPageProps) {
  const { id } = await params;
  const quoteRequest = await getQuoteRequestById(id);

  if (!quoteRequest) {
    notFound();
  }

  const displayStatus = getDisplayStatus(quoteRequest);
  const quote = quoteRequest.quote;
  const isLocked = quote?.status === "SENT" || quote?.status === "ACCEPTED" || quote?.status === "REJECTED";

  const defaultValues = quote
    ? {
        lines: quote.lines.map((line) => ({
          label: line.label,
          quantity: line.quantity,
          price: Number(line.price),
        })),
        currency: quote.currency,
        conditions: quote.conditions ?? "",
      }
    : QUOTE_FORM_DEFAULT_VALUES;

  return (
    <div className="space-y-6">
      <Link
        href="/admin/devis"
        className="inline-flex items-center gap-2 text-sm text-text-secondary transition-colors hover:text-text-primary"
      >
        <ArrowLeft className="h-4 w-4" /> Retour aux devis
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-text-primary">
            {quoteRequest.name}
          </h1>
          <p className="mt-1 text-sm text-text-secondary">
            {quoteRequest.email}
            {quoteRequest.phone ? ` · ${quoteRequest.phone}` : ""}
          </p>
        </div>
        <DevisStatusBadge status={displayStatus} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-xl border border-white/5 bg-surface p-6 lg:col-span-1">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-text-secondary">
            Demande
          </h2>
          <dl className="space-y-3 text-sm">
            <div>
              <dt className="text-text-secondary">Type de projet</dt>
              <dd className="text-text-primary">{getProjectTypeLabel(quoteRequest.projectType)}</dd>
            </div>
            <div>
              <dt className="text-text-secondary">Budget</dt>
              <dd className="text-text-primary">{getBudgetLabel(quoteRequest.budget)}</dd>
            </div>
            <div>
              <dt className="text-text-secondary">Reçue le</dt>
              <dd className="text-text-primary">
                {quoteRequest.createdAt.toLocaleDateString("fr-FR", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })}
              </dd>
            </div>
            <div>
              <dt className="text-text-secondary">Description</dt>
              <dd className="whitespace-pre-line text-text-primary">
                {quoteRequest.description}
              </dd>
            </div>
            {quote?.sentAt ? (
              <div>
                <dt className="text-text-secondary">Devis envoyé le</dt>
                <dd className="text-text-primary">
                  {quote.sentAt.toLocaleDateString("fr-FR", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
                </dd>
              </div>
            ) : null}
          </dl>
        </div>

        <div className="rounded-xl border border-white/5 bg-surface p-6 lg:col-span-2">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-text-secondary">
            {isLocked ? "Devis" : "Composer le devis"}
          </h2>
          <QuoteForm
            quoteRequestId={quoteRequest.id}
            defaultValues={defaultValues}
            readOnly={Boolean(isLocked)}
          />
          {quote?.status === "SENT" ? (
            <div className="mt-6 border-t border-white/5 pt-6">
              <QuoteActions quoteRequestId={quoteRequest.id} />
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
