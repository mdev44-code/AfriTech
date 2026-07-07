import { hasAvailableSlots, type AvailabilityDay } from "@/lib/data/availability";
import { cn } from "@/lib/utils";

interface DayPickerProps {
  days: AvailabilityDay[];
  selectedDate: Date | null;
  onSelect: (day: AvailabilityDay) => void;
}

export function DayPicker({ days, selectedDate, onSelect }: DayPickerProps) {
  return (
    <div
      role="listbox"
      aria-label="Choisir une date"
      className="grid grid-cols-4 gap-2 sm:grid-cols-7"
    >
      {days.map((day) => {
        const isSelected =
          selectedDate?.toDateString() === day.date.toDateString();
        const isSelectable = hasAvailableSlots(day);

        return (
          <button
            key={day.date.toISOString()}
            type="button"
            role="option"
            aria-selected={isSelected}
            disabled={!isSelectable}
            onClick={() => onSelect(day)}
            className={cn(
              "flex flex-col items-center rounded-xl border px-2 py-3 text-center transition-colors duration-300",
              isSelected
                ? "border-brand-blue-light bg-brand-blue/20"
                : "border-white/10 bg-surface hover:border-brand-blue-light/40",
              !isSelectable && "cursor-not-allowed opacity-30 hover:border-white/10"
            )}
          >
            <span className="text-xs uppercase tracking-wide text-text-secondary">
              {day.weekdayLabel}
            </span>
            <span className="mt-1 text-sm font-semibold text-text-primary">
              {day.dayNumber}
            </span>
          </button>
        );
      })}
    </div>
  );
}
