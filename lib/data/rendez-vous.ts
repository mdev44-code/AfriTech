import type { Appointment, AppointmentStatus } from "@prisma/client";

import { db } from "@/lib/db";

export const APPOINTMENT_STATUSES: AppointmentStatus[] = [
  "PENDING",
  "CONFIRMED",
  "CANCELLED",
  "COMPLETED",
];

export const APPOINTMENT_STATUS_LABELS: Record<AppointmentStatus, string> = {
  PENDING: "En attente",
  CONFIRMED: "Confirmé",
  CANCELLED: "Annulé",
  COMPLETED: "Terminé",
};

export async function listAppointments(): Promise<Appointment[]> {
  return db.appointment.findMany({
    orderBy: { scheduledAt: "asc" },
  });
}
