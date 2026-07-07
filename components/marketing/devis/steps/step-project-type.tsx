import { Controller, type Control, type FieldErrors } from "react-hook-form";

import { cn } from "@/lib/utils";
import { PROJECT_TYPES, type DevisFormValues } from "@/lib/validations/devis";

interface StepProjectTypeProps {
  control: Control<DevisFormValues>;
  errors: FieldErrors<DevisFormValues>;
}

export function StepProjectType({ control, errors }: StepProjectTypeProps) {
  return (
    <div>
      <h3 className="text-xl font-semibold text-text-primary">
        Quel type de projet avez-vous en tête ?
      </h3>
      <p className="mt-2 text-sm text-text-secondary">
        Sélectionnez l&apos;option la plus proche de votre besoin.
      </p>

      <Controller
        control={control}
        name="projectType"
        render={({ field }) => (
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {PROJECT_TYPES.map((type) => {
              const isSelected = field.value === type.value;

              return (
                <button
                  key={type.value}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  onClick={() => field.onChange(type.value)}
                  className={cn(
                    "rounded-xl border p-4 text-left transition-colors duration-300",
                    isSelected
                      ? "border-brand-blue-light bg-brand-blue/20"
                      : "border-white/10 bg-surface hover:border-brand-blue-light/40"
                  )}
                >
                  <span className="block font-medium text-text-primary">
                    {type.label}
                  </span>
                  <span className="mt-1 block text-sm text-text-secondary">
                    {type.description}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      />

      {errors.projectType ? (
        <p className="mt-3 text-sm text-red-400">
          {errors.projectType.message}
        </p>
      ) : null}
    </div>
  );
}
