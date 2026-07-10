"use server";

import { revalidatePath } from "next/cache";
import type { Prisma } from "@prisma/client";

import { db } from "@/lib/db";
import { getNextSectionOrder } from "@/lib/data/sections";
import { isBuiltinSectionType } from "@/lib/sections/registry";
import {
  builtinContentSchema,
  createSectionSchema,
  CUSTOM_SECTION_TEMPLATES,
  isCustomSectionType,
  type CreateSectionInput,
} from "@/lib/validations/sections";

export interface ActionResult {
  success: boolean;
  error?: string;
}

function revalidateSections() {
  revalidatePath("/");
  revalidatePath("/admin/sections");
}

export async function toggleSectionVisibility(
  id: string,
  visible: boolean
): Promise<ActionResult> {
  await db.section.update({ where: { id }, data: { visible } });
  revalidateSections();
  return { success: true };
}

export async function reorderSections(orderedIds: string[]): Promise<ActionResult> {
  if (orderedIds.length === 0) {
    return { success: false, error: "Liste de sections vide." };
  }

  await db.$transaction(
    orderedIds.map((id, index) =>
      db.section.update({ where: { id }, data: { order: index + 1 } })
    )
  );

  revalidateSections();
  return { success: true };
}

export async function createCustomSection(
  input: CreateSectionInput
): Promise<ActionResult> {
  const parsed = createSectionSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Formulaire invalide." };
  }

  const template = CUSTOM_SECTION_TEMPLATES[parsed.data.type];
  const contentParsed = template.schema.safeParse(parsed.data.content);
  if (!contentParsed.success) {
    return {
      success: false,
      error: contentParsed.error.issues[0]?.message ?? "Contenu invalide.",
    };
  }

  const order = await getNextSectionOrder();

  await db.section.create({
    data: {
      name: parsed.data.name,
      type: parsed.data.type,
      content: contentParsed.data,
      order,
      visible: true,
    },
  });

  revalidateSections();
  return { success: true };
}

export async function updateBuiltinSectionContent(
  id: string,
  input: { title?: string; description?: string }
): Promise<ActionResult> {
  const section = await db.section.findUnique({ where: { id } });
  if (!section) {
    return { success: false, error: "Section introuvable." };
  }
  if (!isBuiltinSectionType(section.type)) {
    return {
      success: false,
      error: "Cette section n'est pas modifiable de cette façon.",
    };
  }

  const parsed = builtinContentSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Contenu invalide.",
    };
  }

  const existingContent =
    section.content && typeof section.content === "object" && !Array.isArray(section.content)
      ? (section.content as Record<string, unknown>)
      : {};

  await db.section.update({
    where: { id },
    data: { content: { ...existingContent, ...parsed.data } },
  });

  revalidateSections();
  return { success: true };
}

export async function resetBuiltinSectionContent(id: string): Promise<ActionResult> {
  const section = await db.section.findUnique({ where: { id } });
  if (!section) {
    return { success: false, error: "Section introuvable." };
  }
  if (!isBuiltinSectionType(section.type)) {
    return {
      success: false,
      error: "Cette section n'est pas modifiable de cette façon.",
    };
  }

  const existingContent =
    section.content && typeof section.content === "object" && !Array.isArray(section.content)
      ? (section.content as Record<string, unknown>)
      : {};
  const { title: _title, description: _description, ...rest } = existingContent;

  await db.section.update({
    where: { id },
    data: { content: rest as Prisma.InputJsonValue },
  });

  revalidateSections();
  return { success: true };
}

export async function deleteCustomSection(id: string): Promise<ActionResult> {
  const section = await db.section.findUnique({ where: { id } });
  if (!section) {
    return { success: false, error: "Section introuvable." };
  }
  if (!isCustomSectionType(section.type)) {
    return {
      success: false,
      error: "Seules les sections personnalisées peuvent être supprimées.",
    };
  }

  await db.section.delete({ where: { id } });
  revalidateSections();
  return { success: true };
}
