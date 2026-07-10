"use client";

import { useState, useTransition } from "react";
import type { Appointment, AppointmentStatus } from "@prisma/client";

import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import {
  cancelAppointment,
  updateAppointmentStatus,
} from "@/lib/actions/rendez-vous";
import { APPOINTMENT_STATUS_LABELS } from "@/lib/data/rendez-vous";

const NON_CANCELLED_STATUSES: Exclude<AppointmentStatus, "CANCELLED">[] = [
  "PENDING",
  "CONFIRMED",
  "COMPLETED",
];

interface AppointmentActionsProps {
  appointment: Appointment;
}

export function AppointmentActions({ appointment }: AppointmentActionsProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const isCancelled = appointment.status === "CANCELLED";

  function handleStatusChange(value: string) {
    setError(null);
    startTransition(async () => {
      const result = await updateAppointmentStatus(
        appointment.id,
        value as Exclude<AppointmentStatus, "CANCELLED">,
      );
      if (!result.success) setError(result.error ?? "Une erreur est survenue.");
    });
  }

  function handleCancel() {
    setError(null);
    startTransition(async () => {
      const result = await cancelAppointment(appointment.id);
      if (!result.success) setError(result.error ?? "Une erreur est survenue.");
    });
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center gap-3">
        <Select
          value={isCancelled ? appointment.status : appointment.status}
          disabled={isPending || isCancelled}
          onChange={(event) => handleStatusChange(event.target.value)}
          className="max-w-[180px]"
        >
          {isCancelled ? (
            <option value="CANCELLED">
              {APPOINTMENT_STATUS_LABELS.CANCELLED}
            </option>
          ) : null}
          {NON_CANCELLED_STATUSES.map((status) => (
            <option key={status} value={status}>
              {APPOINTMENT_STATUS_LABELS[status]}
            </option>
          ))}
        </Select>
        <Button
          type="button"
          variant="destructive"
          size="sm"
          disabled={isPending || isCancelled}
          onClick={handleCancel}
        >
          Annuler le rendez-vous
        </Button>
      </div>
      {error ? <p className="text-sm text-red-400">{error}</p> : null}
    </div>
  );
}
