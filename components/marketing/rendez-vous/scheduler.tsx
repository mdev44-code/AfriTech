"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type Variants,
} from "framer-motion";
import { CalendarCheck, CheckCircle2, Loader2 } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { generateAvailability, type AvailabilityDay } from "@/lib/data/availability";
import {
  RENDEZ_VOUS_CONTACT_DEFAULT_VALUES,
  rendezVousContactSchema,
  type RendezVousContactValues,
} from "@/lib/validations/rendez-vous";

import { ContactStep } from "./contact-step";
import { DayPicker } from "./day-picker";
import { TimeSlots } from "./time-slots";

type Step = "calendar" | "contact" | "success";

const stepVariants: Variants = {
  enter: (direction: number) => ({ x: direction >= 0 ? 32 : -32, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({ x: direction >= 0 ? -32 : 32, opacity: 0 }),
};

function formatSelectedSlot(day: AvailabilityDay, time: string) {
  const label = day.date.toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
  return `${label} à ${time}`;
}

function buildScheduledAtIso(day: AvailabilityDay, time: string): string {
  const [hours, minutes] = time.split(":").map(Number);
  const scheduledAt = new Date(
    Date.UTC(
      day.date.getFullYear(),
      day.date.getMonth(),
      day.date.getDate(),
      hours,
      minutes,
    ),
  );
  return scheduledAt.toISOString();
}

export function Scheduler() {
  const [days] = useState<AvailabilityDay[]>(() => generateAvailability(14));
  const [step, setStep] = useState<Step>("calendar");
  const [direction, setDirection] = useState(1);
  const [selectedDate, setSelectedDate] = useState<AvailabilityDay | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const prefersReducedMotion = useReducedMotion();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RendezVousContactValues>({
    resolver: zodResolver(rendezVousContactSchema),
    defaultValues: RENDEZ_VOUS_CONTACT_DEFAULT_VALUES,
    mode: "onSubmit",
  });

  function handleSelectDay(day: AvailabilityDay) {
    setSelectedDate(day);
    setSelectedTime(null);
    setSubmitError(null);
  }

  function handleContinue() {
    setDirection(1);
    setStep("contact");
  }

  function handleBack() {
    setDirection(-1);
    setSubmitError(null);
    setStep("calendar");
  }

  async function onSubmit(values: RendezVousContactValues) {
    if (!selectedDate || !selectedTime) return;

    setSubmitError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/rendez-vous", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          scheduledAt: buildScheduledAtIso(selectedDate, selectedTime),
        }),
      });

      if (response.status === 409) {
        const data = await response.json().catch(() => null);
        setSelectedTime(null);
        setDirection(-1);
        setStep("calendar");
        setSubmitError(
          data?.error ?? "Ce créneau vient d'être réservé. Merci d'en choisir un autre.",
        );
        return;
      }

      if (!response.ok) {
        throw new Error("request_failed");
      }

      setDirection(1);
      setStep("success");
    } catch {
      setSubmitError(
        "Une erreur est survenue lors de l'envoi de votre demande. Merci de réessayer.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  if (step === "success" && selectedDate && selectedTime) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="rounded-2xl border border-white/10 bg-surface p-10 text-center"
      >
        <CheckCircle2 className="mx-auto h-12 w-12 text-brand-blue-light" />
        <h3 className="mt-6 text-2xl font-semibold text-text-primary">
          Rendez-vous confirmé
        </h3>
        <p className="mt-3 text-text-secondary">
          Merci, votre appel est programmé le{" "}
          <span className="text-text-primary">
            {formatSelectedSlot(selectedDate, selectedTime)}
          </span>
          . Vous recevrez une invitation par email.
        </p>
        <Button
          asChild
          className="mt-8 bg-brand-blue text-white hover:bg-brand-blue-light"
        >
          <Link href="/">Retour à l&apos;accueil</Link>
        </Button>
      </motion.div>
    );
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-surface p-6 sm:p-10">
      <div className="flex items-center gap-2 text-sm text-text-secondary">
        <CalendarCheck className="h-4 w-4 text-brand-blue-light" aria-hidden="true" />
        {step === "calendar"
          ? "Étape 1 sur 2 — Choisissez un créneau"
          : "Étape 2 sur 2 — Vos coordonnées"}
      </div>

      <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-brand-blue to-brand-blue-light"
          animate={{ width: step === "calendar" ? "50%" : "100%" }}
          transition={{
            duration: prefersReducedMotion ? 0 : 0.5,
            ease: [0.16, 1, 0.3, 1],
          }}
        />
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="mt-8 overflow-hidden"
      >
        <AnimatePresence mode="wait" custom={direction} initial={false}>
          <motion.div
            key={step}
            custom={direction}
            variants={prefersReducedMotion ? undefined : stepVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            {step === "calendar" ? (
              <div>
                <h3 className="text-xl font-semibold text-text-primary">
                  Quand souhaitez-vous échanger ?
                </h3>
                <p className="mt-2 text-sm text-text-secondary">
                  Créneaux disponibles sur les deux prochaines semaines.
                </p>

                {submitError ? (
                  <p className="mt-4 text-sm text-red-400">{submitError}</p>
                ) : null}

                <div className="mt-6">
                  <DayPicker
                    days={days}
                    selectedDate={selectedDate?.date ?? null}
                    onSelect={handleSelectDay}
                  />
                </div>

                {selectedDate ? (
                  <div className="mt-6">
                    <p className="mb-3 text-sm font-medium text-text-primary">
                      Créneaux du {selectedDate.dayNumber}
                    </p>
                    <TimeSlots
                      slots={selectedDate.slots}
                      selectedTime={selectedTime}
                      onSelect={setSelectedTime}
                    />
                  </div>
                ) : null}
              </div>
            ) : (
              <>
                <ContactStep register={register} errors={errors} />
                {submitError ? (
                  <p className="mt-4 text-sm text-red-400">{submitError}</p>
                ) : null}
              </>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="mt-10 flex items-center justify-between">
          {step === "contact" ? (
            <Button
              type="button"
              variant="outline"
              onClick={handleBack}
              disabled={isSubmitting}
              className="border-brand-blue-light bg-transparent text-white hover:bg-brand-blue-light/10 hover:text-white disabled:opacity-30"
            >
              Précédent
            </Button>
          ) : (
            <span />
          )}

          {step === "calendar" ? (
            <Button
              type="button"
              onClick={handleContinue}
              disabled={!selectedDate || !selectedTime}
              className="bg-brand-blue text-white hover:bg-brand-blue-light disabled:opacity-30"
            >
              Continuer
            </Button>
          ) : (
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-brand-blue text-white hover:bg-brand-blue-light disabled:opacity-60"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Envoi en cours...
                </>
              ) : (
                "Confirmer le rendez-vous"
              )}
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
