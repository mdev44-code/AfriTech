import { escapeHtml, renderEmailLayout } from "@/lib/email/layout";

interface DevisConfirmationEmailParams {
  fullName: string;
  projectTypeLabel: string;
}

export function renderDevisConfirmationEmail({
  fullName,
  projectTypeLabel,
}: DevisConfirmationEmailParams): string {
  const bodyHtml = `
    <h1 style="margin:0 0 16px; color:#1A1A1E; font-size:22px; font-weight:600;">
      Votre demande de devis a bien été reçue
    </h1>
    <p style="margin:0 0 16px; color:#1A1A1E; font-size:15px; line-height:1.6;">
      Bonjour ${escapeHtml(fullName)},
    </p>
    <p style="margin:0 0 16px; color:#5C6068; font-size:15px; line-height:1.6;">
      Merci pour votre demande concernant un projet de type
      <strong style="color:#153A63;">${escapeHtml(projectTypeLabel)}</strong>.
      Notre équipe l'étudie et revient vers vous sous 24 à 48h ouvrées
      avec une proposition adaptée.
    </p>
    <p style="margin:24px 0 0; color:#8A8F98; font-size:13px; line-height:1.6;">
      Si vous avez la moindre question d'ici là, répondez simplement à cet email.
    </p>
  `;

  return renderEmailLayout({
    previewTitle: "Votre demande de devis a bien été reçue",
    bodyHtml,
  });
}
