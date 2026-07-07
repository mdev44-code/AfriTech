import type { FieldErrors, UseFormRegister } from "react-hook-form";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { RendezVousContactValues } from "@/lib/validations/rendez-vous";

interface ContactStepProps {
  register: UseFormRegister<RendezVousContactValues>;
  errors: FieldErrors<RendezVousContactValues>;
}

export function ContactStep({ register, errors }: ContactStepProps) {
  return (
    <div>
      <h3 className="text-xl font-semibold text-text-primary">
        Vos coordonnées
      </h3>
      <p className="mt-2 text-sm text-text-secondary">
        Pour confirmer votre créneau et vous envoyer l&apos;invitation.
      </p>

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Label htmlFor="rdv-fullName" className="text-text-primary">
            Nom complet
          </Label>
          <Input
            id="rdv-fullName"
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
          <Label htmlFor="rdv-email" className="text-text-primary">
            Email
          </Label>
          <Input
            id="rdv-email"
            type="email"
            placeholder="awa@entreprise.com"
            className="mt-2 border-white/10 bg-surface text-text-primary placeholder:text-text-secondary focus-visible:ring-brand-blue-light"
            {...register("email")}
          />
          {errors.email ? (
            <p className="mt-1 text-sm text-red-400">{errors.email.message}</p>
          ) : null}
        </div>

        <div>
          <Label htmlFor="rdv-phone" className="text-text-primary">
            Téléphone (optionnel)
          </Label>
          <Input
            id="rdv-phone"
            type="tel"
            placeholder="+225 00 00 00 00"
            className="mt-2 border-white/10 bg-surface text-text-primary placeholder:text-text-secondary focus-visible:ring-brand-blue-light"
            {...register("phone")}
          />
        </div>

        <div className="sm:col-span-2">
          <Label htmlFor="rdv-message" className="text-text-primary">
            Message (optionnel)
          </Label>
          <Textarea
            id="rdv-message"
            rows={4}
            placeholder="Un point particulier à préparer pour l'appel ?"
            className="mt-2 border-white/10 bg-surface text-text-primary placeholder:text-text-secondary focus-visible:ring-brand-blue-light"
            {...register("message")}
          />
          {errors.message ? (
            <p className="mt-1 text-sm text-red-400">
              {errors.message.message}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
