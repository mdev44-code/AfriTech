import type { Metadata } from "next";

import { Scheduler } from "@/components/marketing/rendez-vous/scheduler";
import { generateAvailability } from "@/lib/data/availability";

export const metadata: Metadata = {
  title: "Planifier un rendez-vous",
  description:
    "Choisissez un créneau disponible et échangez avec notre équipe sur votre projet web, mobile, automatisation ou IA.",
};

export default async function RendezVousPage() {
  const initialDays = await generateAvailability(14);

  return (
    <main className="flex flex-1 flex-col bg-background px-6 py-24">
      <div className="mx-auto w-full max-w-2xl">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-text-primary sm:text-4xl">
            Planifier un rendez-vous
          </h1>
          <p className="mt-4 text-text-secondary">
            Choisissez un créneau qui vous convient, nous nous occupons du
            reste.
          </p>
        </div>

        <div className="mt-12">
          <Scheduler initialDays={initialDays} />
        </div>
      </div>
    </main>
  );
}
