"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { Project } from "@prisma/client";
import { Pencil, Search, Star } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DeleteProjectButton } from "@/components/admin/projets/delete-project-button";
import { PROJECT_STATUS_LABELS, PROJECT_STATUSES } from "@/lib/validations/project";

interface ProjectsTableProps {
  projects: Project[];
}

export function ProjectsTable({ projects }: ProjectsTableProps) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return projects.filter((project) => {
      const matchesSearch =
        !query ||
        project.title.toLowerCase().includes(query) ||
        project.category.toLowerCase().includes(query);
      const matchesStatus = !status || project.status === status;
      return matchesSearch && matchesStatus;
    });
  }, [projects, search, status]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-secondary" />
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Rechercher un projet..."
            aria-label="Rechercher un projet"
            className="border-white/10 bg-background pl-9 text-text-primary placeholder:text-text-secondary focus-visible:ring-brand-blue-light"
          />
        </div>
        <Select
          value={status}
          onChange={(event) => setStatus(event.target.value)}
          aria-label="Filtrer par statut"
          className="max-w-xs border-white/10 bg-background text-text-primary"
        >
          <option value="">Tous les statuts</option>
          {PROJECT_STATUSES.map((value) => (
            <option key={value} value={value}>
              {PROJECT_STATUS_LABELS[value]}
            </option>
          ))}
        </Select>
      </div>

      <div className="rounded-xl border border-white/5 bg-surface">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Titre</TableHead>
              <TableHead>Catégorie</TableHead>
              <TableHead>Année</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Mise en avant</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-text-secondary">
                  Aucun projet pour ce filtre.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((project) => (
                <TableRow key={project.id}>
                  <TableCell>
                    <Link
                      href={`/admin/projets/${project.id}`}
                      className="font-medium text-text-primary hover:text-brand-blue-light"
                    >
                      {project.title}
                    </Link>
                  </TableCell>
                  <TableCell>{project.category}</TableCell>
                  <TableCell>{project.year}</TableCell>
                  <TableCell>
                    <Badge variant={project.status === "PUBLISHED" ? "success" : "muted"}>
                      {PROJECT_STATUS_LABELS[project.status]}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {project.featured ? (
                      <Star className="h-4 w-4 fill-brand-blue-light text-brand-blue-light" />
                    ) : (
                      <span className="text-text-secondary">—</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        href={`/admin/projets/${project.id}`}
                        aria-label={`Modifier le projet ${project.title}`}
                        className="flex h-9 w-9 items-center justify-center text-text-secondary transition-colors hover:text-text-primary"
                      >
                        <Pencil className="h-4 w-4" />
                      </Link>
                      <DeleteProjectButton
                        projectId={project.id}
                        projectTitle={project.title}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
