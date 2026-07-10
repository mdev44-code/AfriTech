"use client";

import { useMemo } from "react";
import type { Appointment, AppointmentStatus } from "@prisma/client";
import { Calendar, dateFnsLocalizer, type View } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { fr } from "date-fns/locale";

import "react-big-calendar/lib/css/react-big-calendar.css";
import "./calendar-theme.css";

import { APPOINTMENT_STATUS_LABELS } from "@/lib/data/rendez-vous";

const locales = { fr };

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const EVENT_DURATION_MINUTES = 45;

const STATUS_COLORS: Record<AppointmentStatus, string> = {
  PENDING: "#8A8F98",
  CONFIRMED: "#2C6CB8",
  CANCELLED: "#7f1d1d",
  COMPLETED: "#334155",
};

function toWallClockDate(date: Date): Date {
  return new Date(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate(),
    date.getUTCHours(),
    date.getUTCMinutes(),
  );
}

interface AppointmentEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  appointment: Appointment;
}

interface AppointmentsCalendarProps {
  appointments: Appointment[];
  onSelectAppointment: (appointment: Appointment) => void;
}

export function AppointmentsCalendar({
  appointments,
  onSelectAppointment,
}: AppointmentsCalendarProps) {
  const events = useMemo<AppointmentEvent[]>(
    () =>
      appointments.map((appointment) => {
        const start = toWallClockDate(appointment.scheduledAt);
        const end = new Date(start.getTime() + EVENT_DURATION_MINUTES * 60_000);
        return {
          id: appointment.id,
          title: `${appointment.name} — ${APPOINTMENT_STATUS_LABELS[appointment.status]}`,
          start,
          end,
          appointment,
        };
      }),
    [appointments],
  );

  return (
    <div className="rounded-xl border border-white/5 bg-surface p-4">
      <Calendar
        className="afritech-calendar"
        localizer={localizer}
        culture="fr"
        events={events}
        startAccessor="start"
        endAccessor="end"
        defaultView={"week" as View}
        views={["month", "week", "day", "agenda"]}
        style={{ height: 640 }}
        messages={{
          today: "Aujourd'hui",
          previous: "Précédent",
          next: "Suivant",
          month: "Mois",
          week: "Semaine",
          day: "Jour",
          agenda: "Agenda",
          date: "Date",
          time: "Heure",
          event: "Rendez-vous",
          noEventsInRange: "Aucun rendez-vous sur cette période.",
          showMore: (count) => `+ ${count} de plus`,
        }}
        eventPropGetter={(event: AppointmentEvent) => ({
          style: {
            backgroundColor: STATUS_COLORS[event.appointment.status],
            opacity: event.appointment.status === "CANCELLED" ? 0.6 : 1,
          },
        })}
        onSelectEvent={(event: AppointmentEvent) =>
          onSelectAppointment(event.appointment)
        }
      />
    </div>
  );
}
