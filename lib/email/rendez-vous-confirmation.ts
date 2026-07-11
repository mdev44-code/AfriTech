import { escapeHtml, renderEmailLayout } from "@/lib/email/layout";

interface RendezVousConfirmationEmailParams {
  fullName: string;
  scheduledAt: Date;
}

export function renderRendezVousConfirmationEmail({
  fullName,
  scheduledAt,
}: RendezVousConfirmationEmailParams): string {
  const formattedDate = scheduledAt.toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
  const formattedTime = scheduledAt.toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "UTC",
  });

  const bodyHtml = `
    <h1 style="margin:0 0 16px; color:#1A1A1E; font-size:22px; font-weight:600;">
      Votre rendez-vous est confirmé
    </h1>
    <p style="margin:0 0 16px; color:#1A1A1E; font-size:15px; line-height:1.6;">
      Bonjour ${escapeHtml(fullName)},
    </p>
    <p style="margin:0 0 24px; color:#5C6068; font-size:15px; line-height:1.6;">
      Votre appel avec notre équipe est programmé le
      <strong style="color:#153A63;">${escapeHtml(formattedDate)}</strong>
      à
      <strong style="color:#153A63;">${escapeHtml(formattedTime)}</strong>.
    </p>
    <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%; background-color:#F4F6F8; border:1px solid #E4E4E7; border-radius:12px;">
      <tr>
        <td style="padding:16px 20px;">
          <p style="margin:0; color:#8A8F98; font-size:13px; text-transform:uppercase; letter-spacing:0.04em;">Date</p>
          <p style="margin:4px 0 12px; color:#1A1A1E; font-size:15px;">${escapeHtml(formattedDate)}</p>
          <p style="margin:0; color:#8A8F98; font-size:13px; text-transform:uppercase; letter-spacing:0.04em;">Heure</p>
          <p style="margin:4px 0 0; color:#1A1A1E; font-size:15px;">${escapeHtml(formattedTime)}</p>
        </td>
      </tr>
    </table>
    <p style="margin:24px 0 0; color:#8A8F98; font-size:13px; line-height:1.6;">
      Besoin de modifier ce créneau ? Répondez simplement à cet email.
    </p>
  `;

  return renderEmailLayout({
    previewTitle: "Votre rendez-vous est confirmé",
    bodyHtml,
  });
}
