import type { TimeSlot } from "@/lib/data/availability";
import { cn } from "@/lib/utils";

interface TimeSlotsProps {
  slots: TimeSlot[];
  selectedTime: string | null;
  onSelect: (time: string) => void;
}

export function TimeSlots({ slots, selectedTime, onSelect }: TimeSlotsProps) {
  return (
    <div
      role="listbox"
      aria-label="Choisir un créneau horaire"
      className="grid grid-cols-3 gap-2 sm:grid-cols-4"
    >
      {slots.map((slot) => {
        const isSelected = selectedTime === slot.time;

        return (
          <button
            key={slot.time}
            type="button"
            role="option"
            aria-selected={isSelected}
            disabled={!slot.available}
            onClick={() => onSelect(slot.time)}
            className={cn(
              "rounded-xl border px-3 py-2 text-sm font-medium transition-colors duration-300",
              isSelected
                ? "border-brand-blue-light bg-brand-blue/20 text-text-primary"
                : "border-white/10 bg-surface text-text-secondary hover:border-brand-blue-light/40 hover:text-text-primary",
              !slot.available &&
                "cursor-not-allowed opacity-30 hover:border-white/10 hover:text-text-secondary"
            )}
          >
            {slot.time}
          </button>
        );
      })}
    </div>
  );
}
