import { NextResponse } from "next/server";

import { renderDevisConfirmationEmail } from "@/lib/email/devis-confirmation";
import { getLogoAttachment } from "@/lib/email/logo-attachment";
import { db } from "@/lib/db";
import { getResendClient } from "@/lib/resend";
import { devisFormSchema, PROJECT_TYPES } from "@/lib/validations/devis";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = devisFormSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Données invalides.",
        issues: parsed.error.flatten().fieldErrors,
      },
      { status: 400 },
    );
  }

  const { fullName, email, phone, company, projectType, budget, description } =
    parsed.data;

  const fullDescription = company
    ? `Entreprise : ${company}\n\n${description}`
    : description;

  const quoteRequest = await db.quoteRequest
    .create({
      data: {
        projectType,
        budget,
        description: fullDescription,
        name: fullName,
        email,
        phone: phone || null,
      },
    })
    .catch((error) => {
      console.error("[api/devis] Échec de la création de la demande", error);
      return null;
    });

  if (!quoteRequest) {
    return NextResponse.json(
      { error: "Une erreur est survenue lors de l'enregistrement de votre demande." },
      { status: 500 },
    );
  }

  const resend = getResendClient();

  if (resend) {
    const projectTypeLabel =
      PROJECT_TYPES.find((type) => type.value === projectType)?.label ?? projectType;

    try {
      const logoAttachment = getLogoAttachment();
      const { error } = await resend.emails.send({
        from: process.env.EMAIL_FROM ?? "Afritech <onboarding@resend.dev>",
        to: email,
        subject: "Votre demande de devis a bien été reçue",
        html: renderDevisConfirmationEmail({ fullName, projectTypeLabel }),
        attachments: logoAttachment ? [logoAttachment] : undefined,
      });

      if (error) {
        console.error("[api/devis] Échec de l'envoi de l'email de confirmation", error);
      }
    } catch (error) {
      console.error("[api/devis] Échec de l'envoi de l'email de confirmation", error);
    }
  } else {
    console.warn("[api/devis] RESEND_API_KEY absente : email de confirmation non envoyé.");
  }

  return NextResponse.json({ id: quoteRequest.id }, { status: 201 });
}
