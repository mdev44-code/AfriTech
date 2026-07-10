import type { Metadata } from "next";

import { SectionsBoard } from "@/components/admin/sections/sections-board";
import { listSections } from "@/lib/data/sections";

export const metadata: Metadata = {
  title: "Sections — Admin Afritech",
};

export default async function AdminSectionsPage() {
  const sections = await listSections();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-text-primary">Sections</h1>
        <p className="mt-1 text-sm text-text-secondary">
          Affichez, masquez et réordonnez les sections de la landing page. Créez
          des sections personnalisées pour des besoins ponctuels.
        </p>
      </div>

      <SectionsBoard initialSections={sections} />
    </div>
  );
}
