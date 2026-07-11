import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";

import { renderRendezVousConfirmationEmail } from "@/lib/email/rendez-vous-confirmation";
import { db } from "@/lib/db";
import { getResendClient } from "@/lib/resend";
import { rendezVousBookingSchema } from "@/lib/validations/rendez-vous";

const SLOT_TAKEN_MESSAGE =
  "Ce créneau vient d'être réservé. Merci d'en choisir un autre.";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = rendezVousBookingSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Données invalides.",
        issues: parsed.error.flatten().fieldErrors,
      },
      { status: 400 },
    );
  }

  const { fullName, email, phone, message, scheduledAt } = parsed.data;
  const scheduledDate = new Date(scheduledAt);

  const existing = await db.appointment.findFirst({
    where: {
      scheduledAt: scheduledDate,
      status: { not: "CANCELLED" },
    },
  });

  if (existing) {
    return NextResponse.json({ error: SLOT_TAKEN_MESSAGE }, { status: 409 });
  }

  let appointment;
  try {
    appointment = await db.appointment.create({
      data: {
        name: fullName,
        email,
        phone: phone || null,
        message: message || null,
        scheduledAt: scheduledDate,
      },
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return NextResponse.json({ error: SLOT_TAKEN_MESSAGE }, { status: 409 });
    }

    console.error("[api/rendez-vous] Échec de la création du rendez-vous", error);
    return NextResponse.json(
      { error: "Une erreur est survenue lors de l'enregistrement de votre rendez-vous." },
      { status: 500 },
    );
  }

  const resend = getResendClient();

  if (resend) {
    try {
      const { error } = await resend.emails.send({
        from: process.env.EMAIL_FROM ?? "Afritech <onboarding@resend.dev>",
        to: email,
        subject: "Votre rendez-vous est confirmé",
        html: renderRendezVousConfirmationEmail({
          fullName,
          scheduledAt: scheduledDate,
        }),
      });

      if (error) {
        console.error(
          "[api/rendez-vous] Échec de l'envoi de l'email de confirmation",
          error,
        );
      }
    } catch (error) {
      console.error(
        "[api/rendez-vous] Échec de l'envoi de l'email de confirmation",
        error,
      );
    }
  } else {
    console.warn(
      "[api/rendez-vous] RESEND_API_KEY absente : email de confirmation non envoyé.",
    );
  }

  return NextResponse.json({ id: appointment.id }, { status: 201 });
}
