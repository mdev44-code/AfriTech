import { db } from "@/lib/db";

export const TIME_SLOTS = ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00"];

export const WEEKDAYS = [0, 1, 2, 3, 4, 5, 6] as const;

export const WEEKDAY_LABELS: Record<number, string> = {
  0: "Dimanche",
  1: "Lundi",
  2: "Mardi",
  3: "Mercredi",
  4: "Jeudi",
  5: "Vendredi",
  6: "Samedi",
};

export interface TimeSlot {
  time: string;
  available: boolean;
}

export interface AvailabilityDay {
  date: Date;
  weekdayLabel: string;
  dayNumber: string;
  isWeekend: boolean;
  slots: TimeSlot[];
}

export interface AvailabilityGridCell {
  weekday: number;
  time: string;
  enabled: boolean;
}

function isEnabledByDefault(weekday: number): boolean {
  return weekday >= 1 && weekday <= 5;
}

async function loadRulesMap(): Promise<Map<string, boolean>> {
  const rules = await db.availabilityRule.findMany();
  const map = new Map<string, boolean>();
  for (const rule of rules) {
    map.set(`${rule.weekday}-${rule.time}`, rule.enabled);
  }
  return map;
}

function resolveEnabled(
  rulesMap: Map<string, boolean>,
  weekday: number,
  time: string
): boolean {
  const key = `${weekday}-${time}`;
  return rulesMap.has(key) ? Boolean(rulesMap.get(key)) : isEnabledByDefault(weekday);
}

export async function getAvailabilityGrid(): Promise<AvailabilityGridCell[]> {
  const rulesMap = await loadRulesMap();
  const grid: AvailabilityGridCell[] = [];

  for (const weekday of WEEKDAYS) {
    for (const time of TIME_SLOTS) {
      grid.push({ weekday, time, enabled: resolveEnabled(rulesMap, weekday, time) });
    }
  }

  return grid;
}

export async function generateAvailability(
  daysCount = 14,
  startDate: Date = new Date()
): Promise<AvailabilityDay[]> {
  const rulesMap = await loadRulesMap();

  const rangeStart = new Date(startDate);
  rangeStart.setDate(rangeStart.getDate() + 1);
  rangeStart.setHours(0, 0, 0, 0);
  const rangeEnd = new Date(rangeStart);
  rangeEnd.setDate(rangeEnd.getDate() + daysCount);

  const bookedAppointments = await db.appointment.findMany({
    where: {
      scheduledAt: { gte: rangeStart, lt: rangeEnd },
      status: { not: "CANCELLED" },
    },
    select: { scheduledAt: true },
  });
  const bookedTimes = new Set(
    bookedAppointments.map((appointment) => appointment.scheduledAt.toISOString())
  );

  const days: AvailabilityDay[] = [];

  for (let i = 1; i <= daysCount; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    const dayOfWeek = date.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

    const slots: TimeSlot[] = TIME_SLOTS.map((time) => {
      const [hours, minutes] = time.split(":").map(Number);
      const slotDate = new Date(
        Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), hours, minutes)
      );
      const isBooked = bookedTimes.has(slotDate.toISOString());
      return {
        time,
        available: resolveEnabled(rulesMap, dayOfWeek, time) && !isBooked,
      };
    });

    days.push({
      date,
      weekdayLabel: date.toLocaleDateString("fr-FR", { weekday: "short" }),
      dayNumber: date.toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "2-digit",
      }),
      isWeekend,
      slots,
    });
  }

  return days;
}

export function hasAvailableSlots(day: AvailabilityDay): boolean {
  return day.slots.some((slot) => slot.available);
}
