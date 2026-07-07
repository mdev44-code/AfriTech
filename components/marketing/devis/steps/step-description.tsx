import type { FieldErrors, UseFormRegister, UseFormWatch } from "react-hook-form";

import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { DevisFormValues } from "@/lib/validations/devis";

interface StepDescriptionProps {
  register: UseFormRegister<DevisFormValues>;
  errors: FieldErrors<DevisFormValues>;
  watch: UseFormWatch<DevisFormValues>;
}

export function StepDescription({
  register,
  errors,
  watch,
}: StepDescriptionProps) {
  const description = watch("description") ?? "";

  return (
    <div>
      <h3 className="text-xl font-semibold text-text-primary">
        Décrivez votre besoin
      </h3>
      <p className="mt-2 text-sm text-text-secondary">
        Contexte, objectifs, contraintes : plus vous en dites, plus notre
        réponse sera précise.
      </p>

      <div className="mt-6">
        <Label htmlFor="description" className="text-text-primary">
          Description du projet
        </Label>
        <Textarea
          id="description"
          rows={7}
          placeholder="Parlez-nous de votre projet, de vos objectifs et de vos contraintes de délai..."
          className="mt-2 border-white/10 bg-surface text-text-primary placeholder:text-text-secondary focus-visible:ring-brand-blue-light"
          {...register("description")}
        />
        <div className="mt-2 flex items-center justify-between text-xs text-text-secondary">
          <span>{description.length} / 2000 caractères</span>
        </div>
        {errors.description ? (
          <p className="mt-1 text-sm text-red-400">
            {errors.description.message}
          </p>
        ) : null}
      </div>
    </div>
  );
}
