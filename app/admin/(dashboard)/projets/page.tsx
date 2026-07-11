import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ProjectsTable } from "@/components/admin/projets/projects-table";
import { listAdminProjects } from "@/lib/data/projects";

export const metadata: Metadata = {
  title: "Projets — Admin Afritech",
};

export default async function AdminProjetsPage() {
  const projects = await listAdminProjects();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-text-primary">Projets</h1>
          <p className="mt-1 text-sm text-text-secondary">
            Gérez les projets affichés dans la section « Projets » de la landing page.
          </p>
        </div>
        <Button
          asChild
          className="bg-brand-blue text-white hover:bg-brand-blue-light"
        >
          <Link href="/admin/projets/nouveau">
            <Plus className="h-4 w-4" />
            Nouveau projet
          </Link>
        </Button>
      </div>

      <ProjectsTable projects={projects} />
    </div>
  );
}
