"use client";

import { useState, useTransition } from "react";

import { cn } from "@/lib/utils";
import { setAvailabilityRule } from "@/lib/actions/availability";
import {
  TIME_SLOTS,
  WEEKDAYS,
  WEEKDAY_LABELS,
  type AvailabilityGridCell,
} from "@/lib/data/availability";

interface AvailabilityConfigProps {
  grid: AvailabilityGridCell[];
}

export function AvailabilityConfig({ grid }: AvailabilityConfigProps) {
  const [cells, setCells] = useState(grid);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function isEnabled(weekday: number, time: string): boolean {
    return (
      cells.find((cell) => cell.weekday === weekday && cell.time === time)
        ?.enabled ?? false
    );
  }

  function toggle(weekday: number, time: string) {
    const next = !isEnabled(weekday, time);
    setError(null);
    setCells((prev) =>
      prev.map((cell) =>
        cell.weekday === weekday && cell.time === time
          ? { ...cell, enabled: next }
          : cell,
      ),
    );

    startTransition(async () => {
      const result = await setAvailabilityRule(weekday, time, next);
      if (!result.success) {
        setError(result.error ?? "Une erreur est survenue.");
        setCells((prev) =>
          prev.map((cell) =>
            cell.weekday === weekday && cell.time === time
              ? { ...cell, enabled: !next }
              : cell,
          ),
        );
      }
    });
  }

  return (
    <div className="rounded-xl border border-white/5 bg-surface p-6">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-text-secondary">
        Disponibilités générales
      </h2>
      <p className="mt-1 text-sm text-text-secondary">
        Créneaux proposés par défaut dans le formulaire public de prise de
        rendez-vous. Cliquez pour activer ou désactiver un créneau.
      </p>

      <div className="mt-6 overflow-x-auto">
        <table className="w-full min-w-[640px] border-separate border-spacing-1 text-sm">
          <thead>
            <tr>
              <th className="text-left text-xs font-medium uppercase tracking-wide text-text-secondary">
                Heure
              </th>
              {WEEKDAYS.map((weekday) => (
                <th
                  key={weekday}
                  className="px-1 text-xs font-medium uppercase tracking-wide text-text-secondary"
                >
                  {WEEKDAY_LABELS[weekday].slice(0, 3)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {TIME_SLOTS.map((time) => (
              <tr key={time}>
                <td className="pr-3 text-text-secondary">{time}</td>
                {WEEKDAYS.map((weekday) => {
                  const enabled = isEnabled(weekday, time);
                  return (
                    <td key={weekday}>
                      <button
                        type="button"
                        disabled={isPending}
                        onClick={() => toggle(weekday, time)}
                        aria-pressed={enabled}
                        aria-label={`${WEEKDAY_LABELS[weekday]} ${time} ${
                          enabled ? "disponible" : "indisponible"
                        }`}
                        className={cn(
                          "h-8 w-full rounded-md border text-xs font-medium transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-60",
                          enabled
                            ? "border-brand-blue-light bg-brand-blue/30 text-text-primary hover:bg-brand-blue/50"
                            : "border-white/10 bg-background/40 text-text-secondary hover:border-brand-blue-light/40",
                        )}
                      />
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {error ? <p className="mt-4 text-sm text-red-400">{error}</p> : null}
    </div>
  );
}
