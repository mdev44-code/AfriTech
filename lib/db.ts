import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const db = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db;
}

let dbDownSince: number | null = null;
const DB_COOLDOWN_MS = 30_000;

function isDbCoolingDown(): boolean {
  if (dbDownSince === null) return false;
  if (Date.now() - dbDownSince > DB_COOLDOWN_MS) {
    dbDownSince = null;
    return false;
  }
  return true;
}

export function markDbDown(): void {
  dbDownSince = Date.now();
}

let connectPromise: Promise<void> | null = null;

export async function ensureDb(): Promise<boolean> {
  if (isDbCoolingDown()) return false;
  if (!connectPromise) {
    connectPromise = db.$connect()
      .catch(() => { markDbDown(); })
      .finally(() => { connectPromise = null; });
  }
  await connectPromise;
  return !isDbCoolingDown();
}
