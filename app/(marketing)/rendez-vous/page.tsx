import { Scheduler } from "@/components/marketing/rendez-vous/scheduler";

export default function RendezVousPage() {
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
          <Scheduler />
        </div>
      </div>
    </main>
  );
}
