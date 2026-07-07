import { Controller, type Control, type FieldErrors } from "react-hook-form";

import { cn } from "@/lib/utils";
import { BUDGET_RANGES, type DevisFormValues } from "@/lib/validations/devis";

interface StepBudgetProps {
  control: Control<DevisFormValues>;
  errors: FieldErrors<DevisFormValues>;
}

export function StepBudget({ control, errors }: StepBudgetProps) {
  return (
    <div>
      <h3 className="text-xl font-semibold text-text-primary">
        Quel est votre budget approximatif ?
      </h3>
      <p className="mt-2 text-sm text-text-secondary">
        Une fourchette suffit, cela nous aide à cadrer la proposition.
      </p>

      <Controller
        control={control}
        name="budget"
        render={({ field }) => (
          <div className="mt-6 flex flex-col gap-3">
            {BUDGET_RANGES.map((range) => {
              const isSelected = field.value === range.value;

              return (
                <button
                  key={range.value}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  onClick={() => field.onChange(range.value)}
                  className={cn(
                    "rounded-xl border px-4 py-3 text-left font-medium transition-colors duration-300",
                    isSelected
                      ? "border-brand-blue-light bg-brand-blue/20 text-text-primary"
                      : "border-white/10 bg-surface text-text-secondary hover:border-brand-blue-light/40 hover:text-text-primary"
                  )}
                >
                  {range.label}
                </button>
              );
            })}
          </div>
        )}
      />

      {errors.budget ? (
        <p className="mt-3 text-sm text-red-400">{errors.budget.message}</p>
      ) : null}
    </div>
  );
}
