"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

interface Step {
  number: string;
  title: string;
  description: string;
}

const STEPS: Step[] = [
  {
    number: "01",
    title: "Découverte",
    description:
      "Nous analysons vos besoins, votre marché et vos objectifs pour cadrer précisément le projet.",
  },
  {
    number: "02",
    title: "Conception",
    description:
      "Wireframes, maquettes et architecture technique posent les bases solides du produit.",
  },
  {
    number: "03",
    title: "Développement",
    description:
      "Nous construisons votre solution par itérations courtes, avec des retours réguliers.",
  },
  {
    number: "04",
    title: "Tests & Déploiement",
    description:
      "Assurance qualité rigoureuse puis mise en production sécurisée et surveillée.",
  },
  {
    number: "05",
    title: "Support",
    description:
      "Suivi, maintenance et évolutions pour accompagner durablement votre croissance.",
  },
];

export function Process() {
  const containerRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const stepRefs = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      gsap.set(lineRef.current, { scaleY: 1 });
      gsap.set(stepRefs.current, { opacity: 1, y: 0 });
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.fromTo(
        lineRef.current,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 70%",
            end: "bottom 75%",
            scrub: 0.6,
          },
        }
      );

      stepRefs.current.forEach((step) => {
        if (!step) return;

        gsap.fromTo(
          step,
          { opacity: 0, y: 32 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: "power3.out",
            scrollTrigger: {
              trigger: step,
              start: "top 82%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="process"
      className="scroll-mt-16 border-t border-white/5 px-6 py-24"
    >
      <div className="mx-auto max-w-3xl">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold text-text-primary sm:text-4xl">
            Notre process
          </h2>
          <p className="mt-4 text-text-secondary">
            Une méthode claire, en 5 étapes, du premier échange jusqu&apos;au
            support continu.
          </p>
        </div>

        <div
          ref={containerRef}
          className="relative mt-20 pl-12 sm:pl-16"
        >
          <div
            className="absolute left-4 top-2 bottom-2 w-0.5 bg-white/10 sm:left-6"
            aria-hidden="true"
          />
          <div
            ref={lineRef}
            className="absolute left-4 top-2 bottom-2 w-0.5 origin-top bg-gradient-to-b from-brand-blue-light to-brand-blue sm:left-6"
            style={{ transform: "scaleY(0)" }}
            aria-hidden="true"
          />

          <ol className="space-y-16">
            {STEPS.map((step, index) => (
              <li
                key={step.number}
                ref={(el) => {
                  stepRefs.current[index] = el;
                }}
                className="relative opacity-0"
              >
                <span className="absolute -left-12 top-0 flex h-9 w-9 items-center justify-center rounded-full border border-brand-blue-light/40 bg-surface text-xs font-semibold text-brand-blue-light sm:-left-16 sm:h-10 sm:w-10 sm:text-sm">
                  {step.number}
                </span>
                <h3 className="text-xl font-semibold text-text-primary">
                  {step.title}
                </h3>
                <p className="mt-2 max-w-xl text-sm leading-relaxed text-text-secondary">
                  {step.description}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
