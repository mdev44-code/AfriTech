"use client";

import { useEffect, useState } from "react";
import type { Appointment } from "@prisma/client";
import { CalendarDays, List } from "lucide-react";

import { cn } from "@/lib/utils";
import { AppointmentsList } from "@/components/admin/rendez-vous/appointments-list";
import { AppointmentsCalendar } from "@/components/admin/rendez-vous/appointments-calendar";
import { AppointmentDetailPanel } from "@/components/admin/rendez-vous/appointment-detail-panel";
import type { AvailabilityGridCell } from "@/lib/data/availability";
import { AvailabilityConfig } from "@/components/admin/rendez-vous/availability-config";

type ViewMode = "liste" | "calendrier";

interface RendezVousManagerProps {
  appointments: Appointment[];
  availabilityGrid: AvailabilityGridCell[];
}

export function RendezVousManager({
  appointments,
  availabilityGrid,
}: RendezVousManagerProps) {
  const [view, setView] = useState<ViewMode>("calendrier");
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);

  useEffect(() => {
    if (!selectedAppointment) return;
    const refreshed = appointments.find(
      (appointment) => appointment.id === selectedAppointment.id,
    );
    if (refreshed && refreshed !== selectedAppointment) {
      setSelectedAppointment(refreshed);
    }
  }, [appointments, selectedAppointment]);

  return (
    <div className="space-y-6">
      <div className="inline-flex rounded-lg border border-white/5 bg-surface p-1">
        <button
          type="button"
          onClick={() => setView("calendrier")}
          className={cn(
            "flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
            view === "calendrier"
              ? "bg-brand-blue text-white"
              : "text-text-secondary hover:text-text-primary",
          )}
        >
          <CalendarDays className="h-4 w-4" /> Calendrier
        </button>
        <button
          type="button"
          onClick={() => setView("liste")}
          className={cn(
            "flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
            view === "liste"
              ? "bg-brand-blue text-white"
              : "text-text-secondary hover:text-text-primary",
          )}
        >
          <List className="h-4 w-4" /> Liste
        </button>
      </div>

      {view === "calendrier" ? (
        <AppointmentsCalendar
          appointments={appointments}
          onSelectAppointment={setSelectedAppointment}
        />
      ) : (
        <AppointmentsList appointments={appointments} />
      )}

      <AvailabilityConfig grid={availabilityGrid} />

      <AppointmentDetailPanel
        appointment={selectedAppointment}
        onClose={() => setSelectedAppointment(null)}
      />
    </div>
  );
}
