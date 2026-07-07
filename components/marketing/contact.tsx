"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { CheckCircle2, Mail, MapPin, Phone } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  CONTACT_DEFAULT_VALUES,
  contactSchema,
  type ContactFormValues,
} from "@/lib/validations/contact";

export function Contact() {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: CONTACT_DEFAULT_VALUES,
    mode: "onSubmit",
  });

  function onSubmit() {
    setIsSubmitted(true);
  }

  return (
    <section
      id="contact"
      className="scroll-mt-16 border-t border-white/5 px-6 py-24"
    >
      <div className="mx-auto grid max-w-6xl gap-16 lg:grid-cols-2 lg:gap-12">
        <div>
          <h2 className="text-3xl font-bold text-text-primary sm:text-4xl">
            Discutons de votre projet
          </h2>
          <p className="mt-4 max-w-md text-text-secondary">
            Une question, un besoin précis ou juste envie d&apos;échanger ?
            Écrivez-nous, ou passez directement par l&apos;une de nos
            démarches dédiées.
          </p>

          <ul className="mt-8 space-y-4 text-sm text-text-secondary">
            <li className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-brand-blue-light" aria-hidden="true" />
              contact@afritech.com
            </li>
            <li className="flex items-center gap-3">
              <Phone className="h-4 w-4 text-brand-blue-light" aria-hidden="true" />
              +221 33 000 00 00
            </li>
            <li className="flex items-center gap-3">
              <MapPin className="h-4 w-4 text-brand-blue-light" aria-hidden="true" />
              Dakar, Sénégal
            </li>
          </ul>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button
              asChild
              className="bg-brand-blue text-white hover:bg-brand-blue-light"
            >
              <Link href="/devis">Demander un devis</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="border-brand-blue-light bg-transparent text-white hover:bg-brand-blue-light/10 hover:text-white"
            >
              <Link href="/rendez-vous">Planifier un appel</Link>
            </Button>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-surface p-6 sm:p-10">
          {isSubmitted ? (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="flex h-full flex-col items-center justify-center text-center"
            >
              <CheckCircle2 className="h-12 w-12 text-brand-blue-light" />
              <h3 className="mt-6 text-xl font-semibold text-text-primary">
                Message envoyé
              </h3>
              <p className="mt-3 text-text-secondary">
                Merci, nous revenons vers vous rapidement par email.
              </p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              <div>
                <Label htmlFor="contact-fullName" className="text-text-primary">
                  Nom complet
                </Label>
                <Input
                  id="contact-fullName"
                  placeholder="Awa Traoré"
                  className="mt-2 border-white/10 bg-background text-text-primary placeholder:text-text-secondary focus-visible:ring-brand-blue-light"
                  {...register("fullName")}
                />
                {errors.fullName ? (
                  <p className="mt-1 text-sm text-red-400">
                    {errors.fullName.message}
                  </p>
                ) : null}
              </div>

              <div className="mt-5">
                <Label htmlFor="contact-email" className="text-text-primary">
                  Email
                </Label>
                <Input
                  id="contact-email"
                  type="email"
                  placeholder="awa@entreprise.com"
                  className="mt-2 border-white/10 bg-background text-text-primary placeholder:text-text-secondary focus-visible:ring-brand-blue-light"
                  {...register("email")}
                />
                {errors.email ? (
                  <p className="mt-1 text-sm text-red-400">
                    {errors.email.message}
                  </p>
                ) : null}
              </div>

              <div className="mt-5">
                <Label htmlFor="contact-message" className="text-text-primary">
                  Message
                </Label>
                <Textarea
                  id="contact-message"
                  rows={5}
                  placeholder="Comment pouvons-nous vous aider ?"
                  className="mt-2 border-white/10 bg-background text-text-primary placeholder:text-text-secondary focus-visible:ring-brand-blue-light"
                  {...register("message")}
                />
                {errors.message ? (
                  <p className="mt-1 text-sm text-red-400">
                    {errors.message.message}
                  </p>
                ) : null}
              </div>

              <Button
                type="submit"
                className="mt-6 w-full bg-brand-blue text-white hover:bg-brand-blue-light"
              >
                Envoyer le message
              </Button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
