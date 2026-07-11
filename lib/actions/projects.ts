"use server";

import { revalidatePath } from "next/cache";

import { db } from "@/lib/db";
import {
  parseTechnologies,
  projectFormSchema,
  type ProjectFormValues,
} from "@/lib/validations/project";

export interface ActionResult {
  success: boolean;
  error?: string;
  id?: string;
}

function revalidateProjects(id?: string) {
  revalidatePath("/");
  revalidatePath("/admin/projets");
  revalidatePath("/admin");
  if (id) revalidatePath(`/admin/projets/${id}`);
}

function slugify(title: string): string {
  return title
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80) || "projet";
}

async function generateUniqueSlug(title: string, excludeId?: string): Promise<string> {
  const base = slugify(title);
  let candidate = base;
  let suffix = 2;

  while (
    await db.project.findFirst({
      where: { slug: candidate, ...(excludeId ? { id: { not: excludeId } } : {}) },
      select: { id: true },
    })
  ) {
    candidate = `${base}-${suffix}`;
    suffix += 1;
  }

  return candidate;
}

function buildData(values: ProjectFormValues) {
  return {
    title: values.title,
    description: values.description,
    category: values.category,
    technologies: parseTechnologies(values.technologies),
    images: values.images,
    demoUrl: values.demoUrl || null,
    year: values.year,
    status: values.status,
    featured: values.featured,
  };
}

export async function createProject(input: ProjectFormValues): Promise<ActionResult> {
  const parsed = projectFormSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Formulaire invalide." };
  }

  const slug = await generateUniqueSlug(parsed.data.title);

  const project = await db.project.create({
    data: { ...buildData(parsed.data), slug },
  });

  revalidateProjects(project.id);
  return { success: true, id: project.id };
}

export async function updateProject(
  id: string,
  input: ProjectFormValues,
): Promise<ActionResult> {
  const parsed = projectFormSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Formulaire invalide." };
  }

  const existing = await db.project.findUnique({ where: { id } });
  if (!existing) {
    return { success: false, error: "Projet introuvable." };
  }

  const slug =
    slugify(parsed.data.title) === slugify(existing.title)
      ? existing.slug
      : await generateUniqueSlug(parsed.data.title, id);

  await db.project.update({
    where: { id },
    data: { ...buildData(parsed.data), slug },
  });

  revalidateProjects(id);
  return { success: true, id };
}

export async function deleteProject(id: string): Promise<ActionResult> {
  const existing = await db.project.findUnique({ where: { id } });
  if (!existing) {
    return { success: false, error: "Projet introuvable." };
  }

  await db.project.delete({ where: { id } });
  revalidateProjects();
  return { success: true };
}
