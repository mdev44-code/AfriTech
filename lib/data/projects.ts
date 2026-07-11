import type { Project, ProjectStatus } from "@prisma/client";

import { db } from "@/lib/db";
import type { ProjectCategory } from "@/lib/validations/project";

export type { ProjectCategory };

export interface ListAdminProjectsOptions {
  search?: string;
  status?: ProjectStatus;
}

export async function listAdminProjects(
  options: ListAdminProjectsOptions = {},
): Promise<Project[]> {
  const { search, status } = options;

  return db.project.findMany({
    where: {
      ...(status ? { status } : {}),
      ...(search
        ? { title: { contains: search, mode: "insensitive" } }
        : {}),
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getProjectById(id: string): Promise<Project | null> {
  return db.project.findUnique({ where: { id } });
}

export async function listPublishedProjects(): Promise<Project[]> {
  return db.project.findMany({
    where: { status: "PUBLISHED" },
    orderBy: [{ featured: "desc" }, { year: "desc" }, { createdAt: "desc" }],
  });
}
