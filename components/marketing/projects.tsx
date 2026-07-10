"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Bot, Globe, Smartphone, Workflow, type LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { PROJECTS, type ProjectCategory } from "@/lib/data/projects";
import { BUILTIN_DEFAULT_CONTENT } from "@/lib/sections/builtin-defaults";

type Filter = "Tous" | ProjectCategory;

const FILTERS: Filter[] = ["Tous", "Web", "Mobile", "Automatisation", "IA"];

const CATEGORY_ICON: Record<ProjectCategory, LucideIcon> = {
  Web: Globe,
  Mobile: Smartphone,
  Automatisation: Workflow,
  IA: Bot,
};

interface ProjectsProps {
  title?: string;
  description?: string;
}

export function Projects({ title, description }: ProjectsProps) {
  const [activeFilter, setActiveFilter] = useState<Filter>("Tous");

  const filteredProjects = useMemo(
    () =>
      activeFilter === "Tous"
        ? PROJECTS
        : PROJECTS.filter((project) => project.category === activeFilter),
    [activeFilter]
  );

  return (
    <section
      id="projets"
      className="scroll-mt-16 border-t border-white/5 px-6 py-24"
    >
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold text-text-primary sm:text-4xl">
            {title ?? BUILTIN_DEFAULT_CONTENT.projects!.title}
          </h2>
          <p className="mt-4 text-text-secondary">
            {description ?? BUILTIN_DEFAULT_CONTENT.projects!.description}
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            {FILTERS.map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => setActiveFilter(filter)}
                className={cn(
                  "rounded-full border px-5 py-2 text-sm font-medium transition-colors duration-300",
                  activeFilter === filter
                    ? "border-brand-blue bg-brand-blue text-white"
                    : "border-white/10 bg-transparent text-text-secondary hover:border-brand-blue-light/50 hover:text-white"
                )}
              >
                {filter}
              </button>
            ))}
          </div>

          <motion.div
            layout
            className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            <AnimatePresence mode="popLayout" initial={false}>
              {filteredProjects.map((project) => {
                const Icon = CATEGORY_ICON[project.category];

                return (
                  <motion.div
                    key={project.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    className="group relative overflow-hidden rounded-2xl border border-white/10 bg-surface"
                  >
                    <div className="relative flex h-48 items-center justify-center overflow-hidden bg-gradient-to-br from-brand-blue to-background">
                      <Icon
                        className="h-16 w-16 text-brand-blue-light/40"
                        aria-hidden="true"
                      />

                      <div className="absolute inset-0 flex items-center justify-center bg-background/80 opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100">
                        <Link
                          href="#"
                          className="inline-flex items-center gap-2 rounded-full border border-brand-blue-light bg-brand-blue px-5 py-2 text-sm font-medium text-white transition-colors duration-300 hover:bg-brand-blue-light"
                        >
                          Voir le projet
                          <ArrowUpRight className="h-4 w-4" />
                        </Link>
                      </div>
                    </div>

                    <div className="p-5">
                      <span className="text-xs font-medium uppercase tracking-wide text-brand-blue-light">
                        {project.category}
                      </span>
                      <h3 className="mt-2 text-lg font-semibold text-text-primary">
                        {project.title}
                      </h3>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
