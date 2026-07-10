import { db } from "@/lib/db";

export async function listSections(options?: { visibleOnly?: boolean }) {
  return db.section.findMany({
    where: options?.visibleOnly ? { visible: true } : undefined,
    orderBy: { order: "asc" },
  });
}

export async function getNextSectionOrder(): Promise<number> {
  const last = await db.section.findFirst({ orderBy: { order: "desc" } });
  return (last?.order ?? 0) + 1;
}
