"use server";

import { revalidatePath } from "next/cache";
import type { AppointmentStatus } from "@prisma/client";

import { db } from "@/lib/db";
import { getResendClient } from "@/lib/resend";
import { renderRendezVousCancellationEmail } from "@/lib/email/rendez-vous-cancellation";
import { getLogoAttachment } from "@/lib/email/logo-attachment";

export interface ActionResult {
  success: boolean;
  error?: string;
}

function revalidateRendezVous() {
  revalidatePath("/admin/rendez-vous");
  revalidatePath("/admin");
}

export async function updateAppointmentStatus(
  appointmentId: string,
  status: Exclude<AppointmentStatus, "CANCELLED">,
): Promise<ActionResult> {
  const appointment = await db.appointment.findUnique({
    where: { id: appointmentId },
  });

  if (!appointment) {
    return { success: false, error: "Rendez-vous introuvable." };
  }

  await db.appointment.update({
    where: { id: appointmentId },
    data: { status },
  });

  revalidateRendezVous();
  return { success: true };
}

export async function cancelAppointment(appointmentId: string): Promise<ActionResult> {
  const appointment = await db.appointment.findUnique({
    where: { id: appointmentId },
  });

  if (!appointment) {
    return { success: false, error: "Rendez-vous introuvable." };
  }

  if (appointment.status === "CANCELLED") {
    return { success: true };
  }

  await db.appointment.update({
    where: { id: appointmentId },
    data: { status: "CANCELLED" },
  });

  const resend = getResendClient();
  if (resend) {
    try {
      const logoAttachment = getLogoAttachment();
      const { error } = await resend.emails.send({
        from: process.env.EMAIL_FROM ?? "Afritech <onboarding@resend.dev>",
        to: appointment.email,
        subject: "Votre rendez-vous a été annulé",
        html: renderRendezVousCancellationEmail({
          fullName: appointment.name,
          scheduledAt: appointment.scheduledAt,
        }),
        attachments: logoAttachment ? [logoAttachment] : undefined,
      });

      if (error) {
        console.error(
          "[actions/rendez-vous] Échec de l'envoi de l'email d'annulation",
          error,
        );
        revalidateRendezVous();
        return {
          success: false,
          error: "Rendez-vous annulé, mais l'email n'a pas pu être envoyé.",
        };
      }
    } catch (error) {
      console.error(
        "[actions/rendez-vous] Échec de l'envoi de l'email d'annulation",
        error,
      );
      revalidateRendezVous();
      return {
        success: false,
        error: "Rendez-vous annulé, mais l'email n'a pas pu être envoyé.",
      };
    }
  } else {
    console.warn(
      "[actions/rendez-vous] RESEND_API_KEY absente : email d'annulation non envoyé.",
    );
  }

  revalidateRendezVous();
  return { success: true };
}
