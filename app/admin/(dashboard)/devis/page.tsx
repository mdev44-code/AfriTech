import type { Metadata } from "next";
import Link from "next/link";

import {
  listQuoteRequests,
  getDisplayStatus,
  getBudgetLabel,
  getProjectTypeLabel,
  DEVIS_DISPLAY_STATUSES,
  type DevisDisplayStatus,
} from "@/lib/data/devis";
import { DevisStatusFilter } from "@/components/admin/devis/status-filter";
import { DevisStatusBadge } from "@/components/admin/devis/status-badge";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";

export const metadata: Metadata = {
  title: "Devis — Admin Afritech",
};

interface AdminDevisPageProps {
  searchParams: Promise<{ status?: string }>;
}

function isDevisDisplayStatus(value: string): value is DevisDisplayStatus {
  return (DEVIS_DISPLAY_STATUSES as readonly string[]).includes(value);
}

export default async function AdminDevisPage({
  searchParams,
}: AdminDevisPageProps) {
  const { status } = await searchParams;
  const filter = status && isDevisDisplayStatus(status) ? status : undefined;
  const quoteRequests = await listQuoteRequests(filter);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-text-primary">Devis</h1>
        <p className="mt-1 text-sm text-text-secondary">
          Demandes de devis reçues depuis le site public.
        </p>
      </div>

      <DevisStatusFilter />

      <div className="rounded-xl border border-white/5 bg-surface">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Client</TableHead>
              <TableHead>Projet</TableHead>
              <TableHead>Budget</TableHead>
              <TableHead>Reçue le</TableHead>
              <TableHead>Statut</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {quoteRequests.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-text-secondary">
                  Aucune demande de devis pour ce filtre.
                </TableCell>
              </TableRow>
            ) : (
              quoteRequests.map((quoteRequest) => (
                <TableRow key={quoteRequest.id}>
                  <TableCell>
                    <Link
                      href={`/admin/devis/${quoteRequest.id}`}
                      className="font-medium text-text-primary hover:text-brand-blue-light"
                    >
                      {quoteRequest.name}
                    </Link>
                    <p className="text-xs text-text-secondary">
                      {quoteRequest.email}
                    </p>
                  </TableCell>
                  <TableCell>{getProjectTypeLabel(quoteRequest.projectType)}</TableCell>
                  <TableCell>{getBudgetLabel(quoteRequest.budget)}</TableCell>
                  <TableCell>
                    {quoteRequest.createdAt.toLocaleDateString("fr-FR", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </TableCell>
                  <TableCell>
                    <DevisStatusBadge status={getDisplayStatus(quoteRequest)} />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
