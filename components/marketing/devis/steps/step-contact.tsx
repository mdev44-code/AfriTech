import type { FieldErrors, UseFormRegister } from "react-hook-form";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { DevisFormValues } from "@/lib/validations/devis";

interface StepContactProps {
  register: UseFormRegister<DevisFormValues>;
  errors: FieldErrors<DevisFormValues>;
}

export function StepContact({ register, errors }: StepContactProps) {
  return (
    <div>
      <h3 className="text-xl font-semibold text-text-primary">
        Vos coordonnées
      </h3>
      <p className="mt-2 text-sm text-text-secondary">
        Pour vous recontacter avec une proposition adaptée.
      </p>

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Label htmlFor="fullName" className="text-text-primary">
            Nom complet
          </Label>
          <Input
            id="fullName"
            placeholder="Awa Traoré"
            className="mt-2 border-white/10 bg-surface text-text-primary placeholder:text-text-secondary focus-visible:ring-brand-blue-light"
            {...register("fullName")}
          />
          {errors.fullName ? (
            <p className="mt-1 text-sm text-red-400">
              {errors.fullName.message}
            </p>
          ) : null}
        </div>

        <div>
          <Label htmlFor="email" className="text-text-primary">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="awa@entreprise.com"
            className="mt-2 border-white/10 bg-surface text-text-primary placeholder:text-text-secondary focus-visible:ring-brand-blue-light"
            {...register("email")}
          />
          {errors.email ? (
            <p className="mt-1 text-sm text-red-400">
              {errors.email.message}
            </p>
          ) : null}
        </div>

        <div>
          <Label htmlFor="phone" className="text-text-primary">
            Téléphone (optionnel)
          </Label>
          <Input
            id="phone"
            type="tel"
            placeholder="+225 00 00 00 00"
            className="mt-2 border-white/10 bg-surface text-text-primary placeholder:text-text-secondary focus-visible:ring-brand-blue-light"
            {...register("phone")}
          />
        </div>

        <div className="sm:col-span-2">
          <Label htmlFor="company" className="text-text-primary">
            Entreprise (optionnel)
          </Label>
          <Input
            id="company"
            placeholder="Nom de votre entreprise"
            className="mt-2 border-white/10 bg-surface text-text-primary placeholder:text-text-secondary focus-visible:ring-brand-blue-light"
            {...register("company")}
          />
        </div>
      </div>
    </div>
  );
}
