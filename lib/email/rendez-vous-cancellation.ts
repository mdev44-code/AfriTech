import { escapeHtml, renderEmailLayout } from "@/lib/email/layout";

interface RendezVousCancellationEmailParams {
  fullName: string;
  scheduledAt: Date;
}

export function renderRendezVousCancellationEmail({
  fullName,
  scheduledAt,
}: RendezVousCancellationEmailParams): string {
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
      Votre rendez-vous a été annulé
    </h1>
    <p style="margin:0 0 16px; color:#1A1A1E; font-size:15px; line-height:1.6;">
      Bonjour ${escapeHtml(fullName)},
    </p>
    <p style="margin:0 0 24px; color:#5C6068; font-size:15px; line-height:1.6;">
      Votre appel avec notre équipe initialement prévu le
      <strong style="color:#153A63;">${escapeHtml(formattedDate)}</strong>
      à
      <strong style="color:#153A63;">${escapeHtml(formattedTime)}</strong>
      a été annulé.
    </p>
    <p style="margin:0; color:#8A8F98; font-size:13px; line-height:1.6;">
      Vous pouvez reprendre un nouveau rendez-vous à tout moment depuis notre site.
    </p>
  `;

  return renderEmailLayout({
    previewTitle: "Votre rendez-vous a été annulé",
    bodyHtml,
  });
}
