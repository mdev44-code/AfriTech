import { escapeHtml, renderEmailLayout } from "@/lib/email/layout";

interface QuoteSentEmailParams {
  fullName: string;
  total: string;
  reference: string;
}

export function renderQuoteSentEmail({
  fullName,
  total,
  reference,
}: QuoteSentEmailParams): string {
  const bodyHtml = `
    <h1 style="margin:0 0 16px; color:#1A1A1E; font-size:22px; font-weight:600;">
      Votre devis ${escapeHtml(reference)} est prêt
    </h1>
    <p style="margin:0 0 16px; color:#1A1A1E; font-size:15px; line-height:1.6;">
      Bonjour ${escapeHtml(fullName)},
    </p>
    <p style="margin:0 0 16px; color:#5C6068; font-size:15px; line-height:1.6;">
      Vous trouverez ci-joint votre devis personnalisé, d'un montant total de
      <strong style="color:#153A63;">${escapeHtml(total)}</strong>.
      N'hésitez pas à nous contacter pour toute question avant de le valider.
    </p>
    <p style="margin:24px 0 0; color:#8A8F98; font-size:13px; line-height:1.6;">
      Si vous avez la moindre question, répondez simplement à cet email.
    </p>
  `;

  return renderEmailLayout({
    previewTitle: `Votre devis ${reference} est prêt`,
    bodyHtml,
  });
}
