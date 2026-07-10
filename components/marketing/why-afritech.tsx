"use client";

import { useEffect, useState } from "react";
import {
  animate,
  motion,
  useReducedMotion,
  type Variants,
} from "framer-motion";
import { Award, Clock3, Layers, Users, type LucideIcon } from "lucide-react";

import { BUILTIN_DEFAULT_CONTENT } from "@/lib/sections/builtin-defaults";

interface Differentiator {
  icon: LucideIcon;
  value: number;
  prefix?: string;
  suffix?: string;
  title: string;
  description: string;
}

const DIFFERENTIATORS: Differentiator[] = [
  {
    icon: Layers,
    value: 10,
    suffix: "+",
    title: "Expertise multi-domaines",
    description:
      "Web, mobile, automatisation et IA maîtrisés par une seule équipe.",
  },
  {
    icon: Award,
    value: 25,
    suffix: "+",
    title: "Projets livrés",
    description:
      "Des solutions conçues et déployées pour des besoins variés.",
  },
  {
    icon: Users,
    value: 98,
    suffix: "%",
    title: "Clients satisfaits",
    description:
      "Un accompagnement de proximité, du cadrage jusqu'au support.",
  },
  {
    icon: Clock3,
    value: 24,
    prefix: "<",
    suffix: "h",
    title: "Support réactif",
    description: "Un délai de réponse moyen rapide sur toutes nos demandes.",
  },
];

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
};

function Counter({
  value,
  prefix = "",
  suffix = "",
  start,
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  start: boolean;
}) {
  const prefersReducedMotion = useReducedMotion();
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!start) return;

    if (prefersReducedMotion) {
      setDisplay(value);
      return;
    }

    const controls = animate(0, value, {
      duration: 2,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (latest) => setDisplay(Math.round(latest)),
    });

    return () => controls.stop();
  }, [start, value, prefersReducedMotion]);

  return (
    <span className="text-4xl font-bold text-brand-blue-light sm:text-5xl">
      {prefix}
      {display}
      {suffix}
    </span>
  );
}

interface WhyAfritechProps {
  title?: string;
  description?: string;
}

export function WhyAfritech({ title, description }: WhyAfritechProps) {
  const [isInView, setIsInView] = useState(false);

  return (
    <section
      id="pourquoi-afritech"
      className="scroll-mt-16 border-t border-white/5 px-6 py-24"
    >
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold text-text-primary sm:text-4xl">
            {title ?? BUILTIN_DEFAULT_CONTENT["why-afritech"]!.title}
          </h2>
          <p className="mt-4 text-text-secondary">
            {description ?? BUILTIN_DEFAULT_CONTENT["why-afritech"]!.description}
          </p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          onViewportEnter={() => setIsInView(true)}
          className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {DIFFERENTIATORS.map((item) => {
            const Icon = item.icon;

            return (
              <motion.div
                key={item.title}
                variants={itemVariants}
                className="rounded-2xl border border-white/10 bg-surface p-8"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-blue/60 text-brand-blue-light">
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </div>

                <div className="mt-6">
                  <Counter
                    value={item.value}
                    prefix={item.prefix}
                    suffix={item.suffix}
                    start={isInView}
                  />
                </div>

                <h3 className="mt-3 text-lg font-semibold text-text-primary">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                  {item.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
