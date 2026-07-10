"use client";

import { X } from "lucide-react";
import type { Appointment } from "@prisma/client";

import { AppointmentStatusBadge } from "@/components/admin/rendez-vous/status-badge";
import { AppointmentActions } from "@/components/admin/rendez-vous/appointment-actions";

interface AppointmentDetailPanelProps {
  appointment: Appointment | null;
  onClose: () => void;
}

function formatDateTime(date: Date): string {
  return date.toLocaleString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "UTC",
  });
}

export function AppointmentDetailPanel({
  appointment,
  onClose,
}: AppointmentDetailPanelProps) {
  if (!appointment) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/60"
        onClick={onClose}
        aria-hidden="true"
      />
      <aside className="fixed inset-y-0 right-0 z-50 w-full max-w-sm overflow-y-auto border-l border-white/5 bg-surface p-6 shadow-xl">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-lg font-semibold text-text-primary">
              {appointment.name}
            </h2>
            <p className="mt-1 text-sm text-text-secondary">
              {appointment.email}
              {appointment.phone ? ` · ${appointment.phone}` : ""}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-text-secondary transition-colors hover:text-white"
            aria-label="Fermer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-6 space-y-4 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-text-secondary">Statut</span>
            <AppointmentStatusBadge status={appointment.status} />
          </div>
          <div>
            <p className="text-text-secondary">Créneau</p>
            <p className="mt-1 text-text-primary">
              {formatDateTime(appointment.scheduledAt)}
            </p>
          </div>
          {appointment.message ? (
            <div>
              <p className="text-text-secondary">Message</p>
              <p className="mt-1 whitespace-pre-line text-text-primary">
                {appointment.message}
              </p>
            </div>
          ) : null}
        </div>

        <div className="mt-8 border-t border-white/5 pt-6">
          <AppointmentActions appointment={appointment} />
        </div>
      </aside>
    </>
  );
}
