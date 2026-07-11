import type { Metadata } from "next";

import { DevisForm } from "@/components/marketing/devis/devis-form";

export const metadata: Metadata = {
  title: "Demander un devis",
  description:
    "Décrivez votre projet en quatre étapes rapides et recevez une proposition adaptée sous 24 à 48h.",
};

export default function DevisPage() {
  return (
    <main className="flex flex-1 flex-col bg-background px-6 py-24">
      <div className="mx-auto w-full max-w-2xl">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-text-primary sm:text-4xl">
            Demander un devis
          </h1>
          <p className="mt-4 text-text-secondary">
            Quatre étapes rapides pour nous transmettre votre besoin. Nous
            revenons vers vous avec une proposition adaptée.
          </p>
        </div>

        <div className="mt-12">
          <DevisForm />
        </div>
      </div>
    </main>
  );
}
