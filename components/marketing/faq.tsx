"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion, type Variants } from "framer-motion";
import { ChevronDown } from "lucide-react";

interface FaqItem {
  question: string;
  answer: string;
}

const FAQS: FaqItem[] = [
  {
    question: "Combien de temps prend un projet ?",
    answer:
      "Cela dépend de la complexité, mais un site vitrine peut être livré en 2 à 3 semaines, tandis qu'une application sur-mesure prend généralement 6 à 12 semaines. Nous cadrons un planning précis dès la phase de découverte.",
  },
  {
    question: "Comment se déroule la demande de devis ?",
    answer:
      "Vous remplissez un formulaire en 4 étapes (type de projet, budget, besoin, coordonnées). Nous analysons votre demande et revenons vers vous sous 24 à 48h avec une proposition adaptée.",
  },
  {
    question: "Travaillez-vous avec des startups et des grandes entreprises ?",
    answer:
      "Oui, nous accompagnons aussi bien des startups en phase de lancement que des entreprises établies qui souhaitent digitaliser ou automatiser leurs processus.",
  },
  {
    question: "Proposez-vous un support après la mise en production ?",
    answer:
      "Oui, chaque projet inclut une période de support et nous proposons des forfaits de maintenance évolutive pour accompagner la croissance de votre produit sur la durée.",
  },
  {
    question: "Quelles technologies utilisez-vous ?",
    answer:
      "Principalement Next.js, React, TypeScript et Tailwind CSS côté frontend, avec Prisma/PostgreSQL côté backend. Nous choisissons toujours la stack la plus adaptée à votre besoin.",
  },
  {
    question: "Puis-je démarrer avec un budget limité ?",
    answer:
      "Bien sûr. Nous pouvons découper le projet en phases (MVP puis évolutions) pour avancer progressivement en fonction de votre budget disponible.",
  },
];

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  },
};

export function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const prefersReducedMotion = useReducedMotion();

  return (
    <section id="faq" className="scroll-mt-16 border-t border-white/5 px-6 py-24">
      <div className="mx-auto max-w-3xl">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold text-text-primary sm:text-4xl">
            Questions fréquentes
          </h2>
          <p className="mt-4 text-text-secondary">
            Tout ce qu&apos;il faut savoir avant de démarrer votre projet.
          </p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="mt-12 space-y-3"
        >
          {FAQS.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <motion.div
                key={faq.question}
                variants={itemVariants}
                className="overflow-hidden rounded-2xl border border-white/10 bg-surface"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                >
                  <span className="font-medium text-text-primary">
                    {faq.question}
                  </span>
                  <motion.span
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    className="shrink-0 text-brand-blue-light"
                  >
                    <ChevronDown className="h-5 w-5" aria-hidden="true" />
                  </motion.span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen ? (
                    <motion.div
                      key="content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{
                        duration: prefersReducedMotion ? 0 : 0.35,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                      className="overflow-hidden"
                    >
                      <p className="px-6 pb-5 text-sm leading-relaxed text-text-secondary">
                        {faq.answer}
                      </p>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
