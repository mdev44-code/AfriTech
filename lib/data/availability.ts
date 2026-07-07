const TIME_SLOTS = ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00"];

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

export function generateAvailability(
  daysCount = 14,
  startDate: Date = new Date()
): AvailabilityDay[] {
  const days: AvailabilityDay[] = [];

  for (let i = 1; i <= daysCount; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    const dayOfWeek = date.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

    const slots: TimeSlot[] = TIME_SLOTS.map((time, slotIndex) => ({
      time,
      available: !isWeekend && (i + slotIndex) % 3 !== 0,
    }));

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
