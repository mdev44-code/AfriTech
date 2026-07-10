import type { Metadata } from "next";

import { listAppointments } from "@/lib/data/rendez-vous";
import { getAvailabilityGrid } from "@/lib/data/availability";
import { RendezVousManager } from "@/components/admin/rendez-vous/manager";

export const metadata: Metadata = {
  title: "Rendez-vous — Admin Afritech",
};

export default async function AdminRendezVousPage() {
  const [appointments, availabilityGrid] = await Promise.all([
    listAppointments(),
    getAvailabilityGrid(),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-text-primary">Rendez-vous</h1>
        <p className="mt-1 text-sm text-text-secondary">
          Gérez les rendez-vous pris depuis le site public et les créneaux
          proposés aux visiteurs.
        </p>
      </div>

      <RendezVousManager
        appointments={appointments}
        availabilityGrid={availabilityGrid}
      />
    </div>
  );
}
