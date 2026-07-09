"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion, useReducedMotion, type Variants } from "framer-motion";
import { CheckCircle2, Loader2 } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  DEVIS_FORM_DEFAULT_VALUES,
  DEVIS_STEPS,
  devisFormSchema,
  type DevisFormValues,
} from "@/lib/validations/devis";

import { ProgressBar } from "./progress-bar";
import { StepBudget } from "./steps/step-budget";
import { StepContact } from "./steps/step-contact";
import { StepDescription } from "./steps/step-description";
import { StepProjectType } from "./steps/step-project-type";

const stepVariants: Variants = {
  enter: (direction: number) => ({ x: direction >= 0 ? 32 : -32, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({ x: direction >= 0 ? -32 : 32, opacity: 0 }),
};

export function DevisForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const prefersReducedMotion = useReducedMotion();

  const {
    control,
    register,
    handleSubmit,
    trigger,
    watch,
    formState: { errors },
  } = useForm<DevisFormValues>({
    resolver: zodResolver(devisFormSchema),
    defaultValues: DEVIS_FORM_DEFAULT_VALUES,
    mode: "onSubmit",
  });

  const isLastStep = currentStep === DEVIS_STEPS.length - 1;

  async function handleNext() {
    const isValid = await trigger(DEVIS_STEPS[currentStep].fields);
    if (!isValid) return;
    setDirection(1);
    setCurrentStep((step) => Math.min(step + 1, DEVIS_STEPS.length - 1));
  }

  function handleBack() {
    setDirection(-1);
    setCurrentStep((step) => Math.max(step - 1, 0));
  }

  async function onSubmit(values: DevisFormValues) {
    setSubmitError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/devis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error("request_failed");
      }

      setIsSubmitted(true);
    } catch {
      setSubmitError(
        "Une erreur est survenue lors de l'envoi de votre demande. Merci de réessayer.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="rounded-2xl border border-white/10 bg-surface p-10 text-center"
      >
        <CheckCircle2 className="mx-auto h-12 w-12 text-brand-blue-light" />
        <h3 className="mt-6 text-2xl font-semibold text-text-primary">
          Demande envoyée
        </h3>
        <p className="mt-3 text-text-secondary">
          Merci, votre demande a bien été enregistrée. Notre équipe revient
          vers vous sous 24 à 48h ouvrées.
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
      <ProgressBar steps={DEVIS_STEPS} currentStep={currentStep} />

      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="mt-10 overflow-hidden"
      >
        <AnimatePresence
          mode="wait"
          custom={direction}
          initial={false}
        >
          <motion.div
            key={currentStep}
            custom={direction}
            variants={prefersReducedMotion ? undefined : stepVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            {currentStep === 0 ? (
              <StepProjectType control={control} errors={errors} />
            ) : null}
            {currentStep === 1 ? (
              <StepBudget control={control} errors={errors} />
            ) : null}
            {currentStep === 2 ? (
              <StepDescription
                register={register}
                errors={errors}
                watch={watch}
              />
            ) : null}
            {currentStep === 3 ? (
              <StepContact register={register} errors={errors} />
            ) : null}
          </motion.div>
        </AnimatePresence>

        {submitError ? (
          <p className="mt-6 text-sm text-red-400">{submitError}</p>
        ) : null}

        <div className="mt-10 flex items-center justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 0 || isSubmitting}
            className="border-brand-blue-light bg-transparent text-white hover:bg-brand-blue-light/10 hover:text-white disabled:opacity-30"
          >
            Précédent
          </Button>

          {isLastStep ? (
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
                "Envoyer la demande"
              )}
            </Button>
          ) : (
            <Button
              type="button"
              onClick={handleNext}
              className="bg-brand-blue text-white hover:bg-brand-blue-light"
            >
              Suivant
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
