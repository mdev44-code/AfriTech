"use server";

import { revalidatePath } from "next/cache";

import { db } from "@/lib/db";

export interface ActionResult {
  success: boolean;
  error?: string;
}

export async function setAvailabilityRule(
  weekday: number,
  time: string,
  enabled: boolean,
): Promise<ActionResult> {
  if (weekday < 0 || weekday > 6) {
    return { success: false, error: "Jour invalide." };
  }

  await db.availabilityRule.upsert({
    where: { weekday_time: { weekday, time } },
    update: { enabled },
    create: { weekday, time, enabled },
  });

  revalidatePath("/admin/rendez-vous");
  revalidatePath("/rendez-vous");
  return { success: true };
}
