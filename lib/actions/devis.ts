"use server";

import { revalidatePath } from "next/cache";

import { db } from "@/lib/db";
import { getResendClient } from "@/lib/resend";
import { generateQuotePdf } from "@/lib/pdf/quote-document";
import { renderQuoteSentEmail } from "@/lib/email/quote-sent";
import { quoteFormSchema, type QuoteFormValues } from "@/lib/validations/quote";
import { formatCurrency } from "@/lib/currency";
import { getLogoAttachment } from "@/lib/email/logo-attachment";

export interface ActionResult {
  success: boolean;
  error?: string;
}

function computeTotal(lines: QuoteFormValues["lines"]): number {
  return Math.round(
    lines.reduce((sum, line) => sum + line.price * line.quantity, 0) * 100,
  ) / 100;
}

function revalidateDevis(quoteRequestId: string) {
  revalidatePath("/admin/devis");
  revalidatePath(`/admin/devis/${quoteRequestId}`);
  revalidatePath("/admin");
}

export async function saveQuoteDraft(
  quoteRequestId: string,
  values: QuoteFormValues,
): Promise<ActionResult> {
  const parsed = quoteFormSchema.safeParse(values);
  if (!parsed.success) {
    return { success: false, error: "Formulaire invalide." };
  }

  const { lines, currency, conditions } = parsed.data;
  const total = computeTotal(lines);

  const quoteRequest = await db.quoteRequest.findUnique({
    where: { id: quoteRequestId },
    include: { quote: true },
  });

  if (!quoteRequest) {
    return { success: false, error: "Demande de devis introuvable." };
  }

  await db.$transaction(async (tx) => {
    if (quoteRequest.quote) {
      await tx.quoteLine.deleteMany({
        where: { quoteId: quoteRequest.quote.id },
      });
      await tx.quote.update({
        where: { id: quoteRequest.quote.id },
        data: {
          total,
          currency,
          conditions: conditions || null,
          lines: { create: lines },
        },
      });
    } else {
      await tx.quote.create({
        data: {
          quoteRequestId,
          total,
          currency,
          conditions: conditions || null,
          lines: { create: lines },
        },
      });
    }

    if (quoteRequest.status === "PENDING") {
      await tx.quoteRequest.update({
        where: { id: quoteRequestId },
        data: { status: "IN_PROGRESS" },
      });
    }
  });

  revalidateDevis(quoteRequestId);
  return { success: true };
}

export async function sendQuote(quoteRequestId: string): Promise<ActionResult> {
  const quoteRequest = await db.quoteRequest.findUnique({
    where: { id: quoteRequestId },
    include: { quote: { include: { lines: true } } },
  });

  if (!quoteRequest?.quote || quoteRequest.quote.lines.length === 0) {
    return { success: false, error: "Aucun devis à envoyer pour cette demande." };
  }

  const resend = getResendClient();
  if (!resend) {
    return {
      success: false,
      error: "RESEND_API_KEY absente : impossible d'envoyer le devis.",
    };
  }

  const pdfBuffer = await generateQuotePdf(quoteRequest.quote, quoteRequest);
  const reference = `DEVIS-${quoteRequest.quote.id.slice(-8).toUpperCase()}`;
  const total = formatCurrency(Number(quoteRequest.quote.total), quoteRequest.quote.currency);
  const logoAttachment = getLogoAttachment();

  try {
    const { error } = await resend.emails.send({
      from: process.env.EMAIL_FROM ?? "Afritech <onboarding@resend.dev>",
      to: quoteRequest.email,
      subject: `Votre devis Afritech ${reference}`,
      html: renderQuoteSentEmail({
        fullName: quoteRequest.name,
        total,
        reference,
      }),
      attachments: [
        {
          filename: `${reference}.pdf`,
          content: pdfBuffer,
        },
        ...(logoAttachment ? [logoAttachment] : []),
      ],
    });

    if (error) {
      console.error("[actions/devis] Échec de l'envoi du devis", error);
      return { success: false, error: "Échec de l'envoi de l'email." };
    }
  } catch (error) {
    console.error("[actions/devis] Échec de l'envoi du devis", error);
    return { success: false, error: "Échec de l'envoi de l'email." };
  }

  await db.$transaction([
    db.quote.update({
      where: { id: quoteRequest.quote.id },
      data: { status: "SENT", sentAt: new Date() },
    }),
    db.quoteRequest.update({
      where: { id: quoteRequestId },
      data: { status: "QUOTED" },
    }),
  ]);

  revalidateDevis(quoteRequestId);
  return { success: true };
}

export async function markQuoteAccepted(
  quoteRequestId: string,
): Promise<ActionResult> {
  const quoteRequest = await db.quoteRequest.findUnique({
    where: { id: quoteRequestId },
    include: { quote: true },
  });

  if (!quoteRequest?.quote) {
    return { success: false, error: "Aucun devis pour cette demande." };
  }

  await db.quote.update({
    where: { id: quoteRequest.quote.id },
    data: { status: "ACCEPTED" },
  });

  revalidateDevis(quoteRequestId);
  return { success: true };
}

export async function markQuoteRejected(
  quoteRequestId: string,
): Promise<ActionResult> {
  const quoteRequest = await db.quoteRequest.findUnique({
    where: { id: quoteRequestId },
    include: { quote: true },
  });

  if (!quoteRequest?.quote) {
    return { success: false, error: "Aucun devis pour cette demande." };
  }

  await db.quote.update({
    where: { id: quoteRequest.quote.id },
    data: { status: "REJECTED" },
  });

  revalidateDevis(quoteRequestId);
  return { success: true };
}
