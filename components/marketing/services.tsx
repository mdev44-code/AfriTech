"use client";

import { useRef, type MouseEvent } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type Variants,
} from "framer-motion";
import { BrainCircuit, Code2, Smartphone, Workflow, type LucideIcon } from "lucide-react";

import { BUILTIN_DEFAULT_CONTENT } from "@/lib/sections/builtin-defaults";

interface Service {
  icon: LucideIcon;
  title: string;
  description: string;
}

const SERVICES: Service[] = [
  {
    icon: Code2,
    title: "Développement Web",
    description:
      "Sites et applications web sur-mesure, rapides et évolutifs, construits avec les technologies les plus modernes.",
  },
  {
    icon: Smartphone,
    title: "Applications Mobiles",
    description:
      "Applications iOS et Android natives ou cross-platform, pensées pour une expérience fluide et performante.",
  },
  {
    icon: Workflow,
    title: "Automatisation",
    description:
      "Optimisez vos processus métier grâce à des workflows automatisés qui vous font gagner un temps précieux.",
  },
  {
    icon: BrainCircuit,
    title: "Intégration IA",
    description:
      "Intégrez l'intelligence artificielle à vos outils pour accélérer vos décisions et votre croissance.",
  },
];

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12 },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
};

function ServiceCard({ icon: Icon, title, description }: Service) {
  const prefersReducedMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  const rotateX = useSpring(useTransform(mouseY, [0, 1], [8, -8]), {
    stiffness: 300,
    damping: 30,
  });
  const rotateY = useSpring(useTransform(mouseX, [0, 1], [-8, 8]), {
    stiffness: 300,
    damping: 30,
  });

  const glowX = useTransform(mouseX, [0, 1], ["0%", "100%"]);
  const glowY = useTransform(mouseY, [0, 1], ["0%", "100%"]);
  const glowBackground = useTransform(
    [glowX, glowY],
    ([x, y]) =>
      `radial-gradient(280px circle at ${x} ${y}, rgba(44, 108, 184, 0.35), transparent 70%)`
  );

  function handleMouseMove(event: MouseEvent<HTMLDivElement>) {
    if (prefersReducedMotion || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    mouseX.set((event.clientX - rect.left) / rect.width);
    mouseY.set((event.clientY - rect.top) / rect.height);
  }

  function handleMouseLeave() {
    mouseX.set(0.5);
    mouseY.set(0.5);
  }

  return (
    <motion.div
      ref={ref}
      variants={cardVariants}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX: prefersReducedMotion ? 0 : rotateX,
        rotateY: prefersReducedMotion ? 0 : rotateY,
        transformStyle: "preserve-3d",
      }}
      className="group relative overflow-hidden rounded-2xl border border-white/10 bg-surface p-8 [perspective:1000px] transition-[border-color,box-shadow] duration-500 hover:border-brand-blue-light/40 hover:shadow-[0_0_40px_rgba(44,108,184,0.15)]"
    >
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{ background: glowBackground }}
      />

      <div className="relative flex h-12 w-12 items-center justify-center rounded-xl bg-brand-blue/60 text-brand-blue-light transition-colors duration-300 group-hover:text-white">
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="relative mt-6 text-xl font-semibold text-text-primary">{title}</h3>
      <p className="relative mt-3 text-sm leading-relaxed text-text-secondary">
        {description}
      </p>
    </motion.div>
  );
}

interface ServicesProps {
  title?: string;
  description?: string;
}

export function Services({ title, description }: ServicesProps) {
  return (
    <section
      id="services"
      className="scroll-mt-16 border-t border-white/5 px-6 py-24"
    >
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold text-text-primary sm:text-4xl">
            {title ?? BUILTIN_DEFAULT_CONTENT.services!.title}
          </h2>
          <p className="mt-4 text-text-secondary">
            {description ?? BUILTIN_DEFAULT_CONTENT.services!.description}
          </p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {SERVICES.map((service) => (
            <ServiceCard key={service.title} {...service} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
