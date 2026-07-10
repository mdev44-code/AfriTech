import type { Appointment } from "@prisma/client";

import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { AppointmentStatusBadge } from "@/components/admin/rendez-vous/status-badge";
import { AppointmentActions } from "@/components/admin/rendez-vous/appointment-actions";

interface AppointmentsListProps {
  appointments: Appointment[];
}

function formatDateTime(date: Date): string {
  return date.toLocaleString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "UTC",
  });
}

export function AppointmentsList({ appointments }: AppointmentsListProps) {
  return (
    <div className="rounded-xl border border-white/5 bg-surface">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Client</TableHead>
            <TableHead>Créneau</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {appointments.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center text-text-secondary">
                Aucun rendez-vous pour le moment.
              </TableCell>
            </TableRow>
          ) : (
            appointments.map((appointment) => (
              <TableRow key={appointment.id}>
                <TableCell>
                  <p className="font-medium text-text-primary">{appointment.name}</p>
                  <p className="text-xs text-text-secondary">
                    {appointment.email}
                    {appointment.phone ? ` · ${appointment.phone}` : ""}
                  </p>
                </TableCell>
                <TableCell>{formatDateTime(appointment.scheduledAt)}</TableCell>
                <TableCell>
                  <AppointmentStatusBadge status={appointment.status} />
                </TableCell>
                <TableCell>
                  <AppointmentActions appointment={appointment} />
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
