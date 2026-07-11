"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Project } from "@prisma/client";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { ImageUploader } from "@/components/admin/projets/image-uploader";
import { createProject, updateProject } from "@/lib/actions/projects";
import {
  PROJECT_CATEGORIES,
  PROJECT_FORM_DEFAULT_VALUES,
  PROJECT_STATUSES,
  PROJECT_STATUS_LABELS,
  projectFormSchema,
  type ProjectFormValues,
} from "@/lib/validations/project";

interface ProjectFormProps {
  project?: Project;
}

function toDefaultValues(project?: Project): ProjectFormValues {
  if (!project) return PROJECT_FORM_DEFAULT_VALUES;

  return {
    title: project.title,
    description: project.description,
    category: PROJECT_CATEGORIES.includes(project.category as (typeof PROJECT_CATEGORIES)[number])
      ? (project.category as ProjectFormValues["category"])
      : "Web",
    technologies: project.technologies.join(", "),
    images: project.images,
    demoUrl: project.demoUrl ?? undefined,
    year: project.year,
    status: project.status,
    featured: project.featured,
  };
}

export function ProjectForm({ project }: ProjectFormProps) {
  const router = useRouter();
  const isEditing = Boolean(project);
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ProjectFormValues>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: toDefaultValues(project),
  });

  async function onSubmit(values: ProjectFormValues) {
    setServerError(null);
    setIsSubmitting(true);

    const result = project
      ? await updateProject(project.id, values)
      : await createProject(values);

    setIsSubmitting(false);

    if (!result.success) {
      setServerError(result.error ?? "Une erreur est survenue.");
      return;
    }

    router.push("/admin/projets");
    router.refresh();
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="space-y-6 rounded-xl border border-white/5 bg-surface p-6"
    >
      <div className="space-y-2">
        <Label htmlFor="title" className="text-text-primary">
          Titre
        </Label>
        <Input
          id="title"
          placeholder="Ex : Plateforme e-commerce"
          className="border-white/10 bg-background text-text-primary placeholder:text-text-secondary focus-visible:ring-brand-blue-light"
          {...register("title")}
        />
        {errors.title && <p className="text-sm text-red-400">{errors.title.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description" className="text-text-primary">
          Description
        </Label>
        <Textarea
          id="description"
          rows={4}
          className="border-white/10 bg-background text-text-primary placeholder:text-text-secondary focus-visible:ring-brand-blue-light"
          {...register("description")}
        />
        {errors.description && (
          <p className="text-sm text-red-400">{errors.description.message}</p>
        )}
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="category" className="text-text-primary">
            Catégorie
          </Label>
          <Select
            id="category"
            className="border-white/10 bg-background text-text-primary"
            {...register("category")}
          >
            {PROJECT_CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="year" className="text-text-primary">
            Année
          </Label>
          <Input
            id="year"
            type="number"
            className="border-white/10 bg-background text-text-primary focus-visible:ring-brand-blue-light"
            {...register("year", { valueAsNumber: true })}
          />
          {errors.year && <p className="text-sm text-red-400">{errors.year.message}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="technologies" className="text-text-primary">
          Technologies (séparées par une virgule)
        </Label>
        <Input
          id="technologies"
          placeholder="Ex : Next.js, Prisma, Stripe"
          className="border-white/10 bg-background text-text-primary placeholder:text-text-secondary focus-visible:ring-brand-blue-light"
          {...register("technologies")}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="demoUrl" className="text-text-primary">
          Lien démo (optionnel)
        </Label>
        <Input
          id="demoUrl"
          placeholder="https://..."
          className="border-white/10 bg-background text-text-primary placeholder:text-text-secondary focus-visible:ring-brand-blue-light"
          {...register("demoUrl")}
        />
        {errors.demoUrl && <p className="text-sm text-red-400">{errors.demoUrl.message}</p>}
      </div>

      <div className="space-y-2">
        <Label className="text-text-primary">Images</Label>
        <Controller
          control={control}
          name="images"
          render={({ field }) => (
            <ImageUploader
              images={field.value}
              onChange={field.onChange}
              disabled={isSubmitting}
            />
          )}
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="status" className="text-text-primary">
            Statut
          </Label>
          <Select
            id="status"
            className="border-white/10 bg-background text-text-primary"
            {...register("status")}
          >
            {PROJECT_STATUSES.map((status) => (
              <option key={status} value={status}>
                {PROJECT_STATUS_LABELS[status]}
              </option>
            ))}
          </Select>
        </div>

        <div className="flex items-center justify-between rounded-md border border-white/10 bg-background px-3 py-2">
          <Label htmlFor="featured" className="text-text-primary">
            Mise en avant
          </Label>
          <Controller
            control={control}
            name="featured"
            render={({ field }) => (
              <Switch
                id="featured"
                checked={field.value}
                onCheckedChange={field.onChange}
                aria-label="Mettre le projet en avant"
              />
            )}
          />
        </div>
      </div>

      {serverError && (
        <p className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-red-400">
          {serverError}
        </p>
      )}

      <div className="flex gap-3">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="bg-brand-blue text-white hover:bg-brand-blue-light disabled:opacity-60"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              {isEditing ? "Enregistrement..." : "Création..."}
            </>
          ) : isEditing ? (
            "Enregistrer les modifications"
          ) : (
            "Créer le projet"
          )}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/admin/projets")}
          className="border-white/10 bg-transparent text-text-primary hover:bg-white/5"
        >
          Annuler
        </Button>
      </div>
    </form>
  );
}
