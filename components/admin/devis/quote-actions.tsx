"use client";

import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { markQuoteAccepted, markQuoteRejected } from "@/lib/actions/devis";

interface QuoteActionsProps {
  quoteRequestId: string;
}

export function QuoteActions({ quoteRequestId }: QuoteActionsProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleAccept() {
    setError(null);
    startTransition(async () => {
      const result = await markQuoteAccepted(quoteRequestId);
      if (!result.success) setError(result.error ?? "Une erreur est survenue.");
    });
  }

  function handleReject() {
    setError(null);
    startTransition(async () => {
      const result = await markQuoteRejected(quoteRequestId);
      if (!result.success) setError(result.error ?? "Une erreur est survenue.");
    });
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-3">
        <Button
          type="button"
          disabled={isPending}
          onClick={handleAccept}
          className="bg-emerald-600 hover:bg-emerald-500"
        >
          Marquer comme accepté
        </Button>
        <Button
          type="button"
          variant="destructive"
          disabled={isPending}
          onClick={handleReject}
        >
          Marquer comme refusé
        </Button>
      </div>
      {error ? <p className="text-sm text-red-400">{error}</p> : null}
    </div>
  );
}
