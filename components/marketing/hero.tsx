"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import Link from "next/link";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const TITLE_LINE_1 = "Des logiciels sur-mesure,";
const TITLE_LINE_2 = "propulsés par l'IA.";

const FLOATING_BADGES = [
  { label: "Web", className: "left-[6%] top-[22%]", duration: 6 },
  { label: "Mobile", className: "right-[8%] top-[16%]", duration: 7 },
  { label: "Automatisation", className: "left-[10%] bottom-[20%]", duration: 8 },
  { label: "IA", className: "right-[10%] bottom-[26%]", duration: 6.5 },
];

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08 },
  },
};

const wordVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
};

function CascadingLine({ text }: { text: string }) {
  return (
    <span className="block">
      {text.split(" ").map((word, index) => (
        <motion.span
          key={`${word}-${index}`}
          variants={wordVariants}
          className="mr-[0.25em] inline-block last:mr-0"
        >
          {word}
        </motion.span>
      ))}
    </span>
  );
}

export function Hero() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section className="relative flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center overflow-hidden px-6">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-background">
        <motion.div
          className="absolute left-1/2 top-1/2 h-[60vmax] w-[60vmax] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,_var(--color-brand-blue)_0%,_transparent_65%)] opacity-70 blur-3xl"
          animate={
            prefersReducedMotion
              ? undefined
              : {
                  scale: [1, 1.15, 1],
                  x: ["-50%", "-46%", "-50%"],
                  y: ["-50%", "-54%", "-50%"],
                }
          }
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute left-1/3 top-2/3 h-[45vmax] w-[45vmax] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,_var(--color-brand-blue-light)_0%,_transparent_70%)] opacity-40 blur-3xl"
          animate={
            prefersReducedMotion
              ? undefined
              : {
                  scale: [1, 1.2, 1],
                  x: ["-50%", "-54%", "-50%"],
                }
          }
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {FLOATING_BADGES.map((badge) => (
        <motion.div
          key={badge.label}
          className={cn(
            "absolute hidden rounded-full border border-brand-blue-light/40 bg-surface/60 px-4 py-2 text-xs font-medium text-text-primary backdrop-blur-md md:block",
            badge.className
          )}
          animate={
            prefersReducedMotion
              ? undefined
              : { y: [0, -14, 0] }
          }
          transition={{
            duration: badge.duration,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          {badge.label}
        </motion.div>
      ))}

      <motion.h1
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="max-w-4xl text-center text-5xl font-bold leading-tight tracking-tight text-text-primary sm:text-6xl lg:text-7xl"
      >
        <CascadingLine text={TITLE_LINE_1} />
        <CascadingLine text={TITLE_LINE_2} />
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
        className="mt-6 max-w-2xl text-center text-lg text-text-secondary sm:text-xl"
      >
        Afritech conçoit des applications web et mobiles, automatise vos
        processus et intègre l&apos;IA pour accélérer votre croissance.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.55 }}
        className="mt-10 flex flex-col items-center gap-4 sm:flex-row"
      >
        <Button
          asChild
          size="lg"
          className="bg-brand-blue text-white hover:bg-brand-blue-light"
        >
          <Link href="/devis">Demander un devis</Link>
        </Button>
        <Button
          asChild
          size="lg"
          variant="outline"
          className="border-brand-blue-light bg-transparent text-white hover:bg-brand-blue-light/10 hover:text-white"
        >
          <Link href="/rendez-vous">Planifier un appel</Link>
        </Button>
      </motion.div>
    </section>
  );
}
