"use client";

import { motion, useReducedMotion } from "framer-motion";

import { cn } from "@/lib/utils";

interface ProgressBarProps {
  steps: readonly { id: string; title: string }[];
  currentStep: number;
}

export function ProgressBar({ steps, currentStep }: ProgressBarProps) {
  const percentage = ((currentStep + 1) / steps.length) * 100;
  const prefersReducedMotion = useReducedMotion();

  return (
    <div>
      <div className="flex items-center justify-between text-sm text-text-secondary">
        <span>
          Étape {currentStep + 1} sur {steps.length}
        </span>
        <span className="font-medium text-text-primary">
          {steps[currentStep].title}
        </span>
      </div>

      <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-brand-blue to-brand-blue-light"
          animate={{ width: `${percentage}%` }}
          transition={{
            duration: prefersReducedMotion ? 0 : 0.5,
            ease: [0.16, 1, 0.3, 1],
          }}
        />
      </div>

      <div className="mt-4 flex items-center gap-2">
        {steps.map((step, index) => (
          <div
            key={step.id}
            className={cn(
              "h-1.5 flex-1 rounded-full transition-colors duration-500",
              index <= currentStep ? "bg-brand-blue-light" : "bg-white/10"
            )}
            aria-hidden="true"
          />
        ))}
      </div>
    </div>
  );
}
