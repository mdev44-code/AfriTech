"use client";

import { useRouter, useSearchParams } from "next/navigation";

import { Select } from "@/components/ui/select";
import {
  DEVIS_DISPLAY_STATUSES,
  DEVIS_DISPLAY_STATUS_LABELS,
} from "@/lib/data/devis";

export function DevisStatusFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentStatus = searchParams.get("status") ?? "";

  function handleChange(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set("status", value);
    } else {
      params.delete("status");
    }
    router.push(`/admin/devis${params.toString() ? `?${params.toString()}` : ""}`);
  }

  return (
    <Select
      value={currentStatus}
      onChange={(event) => handleChange(event.target.value)}
      className="max-w-xs"
    >
      <option value="">Tous les statuts</option>
      {DEVIS_DISPLAY_STATUSES.map((status) => (
        <option key={status} value={status}>
          {DEVIS_DISPLAY_STATUS_LABELS[status]}
        </option>
      ))}
    </Select>
  );
}
