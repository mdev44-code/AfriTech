"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion, useReducedMotion, type Variants } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
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

  function onSubmit() {
    setIsSubmitted(true);
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

        <div className="mt-10 flex items-center justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 0}
            className="border-brand-blue-light bg-transparent text-white hover:bg-brand-blue-light/10 hover:text-white disabled:opacity-30"
          >
            Précédent
          </Button>

          {isLastStep ? (
            <Button
              type="submit"
              className="bg-brand-blue text-white hover:bg-brand-blue-light"
            >
              Envoyer la demande
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
