import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { ProjectForm } from "@/components/admin/projets/project-form";
import { DeleteProjectButton } from "@/components/admin/projets/delete-project-button";
import { getProjectById } from "@/lib/data/projects";

export const metadata: Metadata = {
  title: "Modifier le projet — Admin Afritech",
};

interface EditProjectPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProjectPage({ params }: EditProjectPageProps) {
  const { id } = await params;
  const project = await getProjectById(id);

  if (!project) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <Link
        href="/admin/projets"
        className="inline-flex items-center gap-2 text-sm text-text-secondary transition-colors hover:text-text-primary"
      >
        <ArrowLeft className="h-4 w-4" /> Retour aux projets
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-text-primary">{project.title}</h1>
          <p className="mt-1 text-sm text-text-secondary">
            Modifiez les informations du projet.
          </p>
        </div>
        <DeleteProjectButton
          projectId={project.id}
          projectTitle={project.title}
          redirectTo="/admin/projets"
        />
      </div>

      <ProjectForm project={project} />
    </div>
  );
}
