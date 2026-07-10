import type { ComponentType } from "react";

import { Contact } from "@/components/marketing/contact";
import { Faq } from "@/components/marketing/faq";
import { Hero } from "@/components/marketing/hero";
import { Process } from "@/components/marketing/process";
import { Projects } from "@/components/marketing/projects";
import { Services } from "@/components/marketing/services";
import { TechMarquee } from "@/components/marketing/tech-marquee";
import { WhyAfritech } from "@/components/marketing/why-afritech";
import type { BuiltinSectionType } from "@/lib/validations/sections";

export const BUILTIN_SECTION_REGISTRY: Record<BuiltinSectionType, ComponentType> = {
  hero: Hero,
  "tech-marquee": TechMarquee,
  services: Services,
  process: Process,
  projects: Projects,
  "why-afritech": WhyAfritech,
  faq: Faq,
  contact: Contact,
};

export const BUILTIN_SECTION_LABELS: Record<BuiltinSectionType, string> = {
  hero: "Hero",
  "tech-marquee": "Bandeau technologies",
  services: "Nos services",
  process: "Notre process",
  projects: "Projets",
  "why-afritech": "Pourquoi Afritech",
  faq: "FAQ",
  contact: "Contact",
};

export function isBuiltinSectionType(value: string): value is BuiltinSectionType {
  return value in BUILTIN_SECTION_REGISTRY;
}
