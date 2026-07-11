import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { ProjectForm } from "@/components/admin/projets/project-form";

export const metadata: Metadata = {
  title: "Nouveau projet — Admin Afritech",
};

export default function NewProjectPage() {
  return (
    <div className="space-y-6">
      <Link
        href="/admin/projets"
        className="inline-flex items-center gap-2 text-sm text-text-secondary transition-colors hover:text-text-primary"
      >
        <ArrowLeft className="h-4 w-4" /> Retour aux projets
      </Link>

      <div>
        <h1 className="text-2xl font-semibold text-text-primary">Nouveau projet</h1>
        <p className="mt-1 text-sm text-text-secondary">
          Ce projet n&apos;apparaîtra sur la landing page qu&apos;une fois publié.
        </p>
      </div>

      <ProjectForm />
    </div>
  );
}
