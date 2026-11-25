import type { Section } from "@prisma/client";

import { db } from "@/lib/db";
import { BUILTIN_SECTION_TYPES } from "@/lib/validations/sections";

function fallbackSections(): Section[] {
  return BUILTIN_SECTION_TYPES.map((type, index) => ({
    id: `fallback-${type}`,
    name: type,
    type,
    content: {},
    visible: true,
    order: index,
    createdAt: new Date(),
    updatedAt: new Date(),
  }));
}

export async function listSections(options?: { visibleOnly?: boolean }) {
  try {
    return await db.section.findMany({
      where: options?.visibleOnly ? { visible: true } : undefined,
      orderBy: { order: "asc" },
    });
  } catch (error) {
    console.error("[listSections] Database unreachable, using fallback sections", error);
    return fallbackSections();
  }
}

export async function getNextSectionOrder(): Promise<number> {
  const last = await db.section.findFirst({ orderBy: { order: "desc" } });
  return (last?.order ?? 0) + 1;
}
