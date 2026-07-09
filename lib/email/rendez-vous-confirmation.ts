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

  return `
<!DOCTYPE html>
<html lang="fr">
  <body style="margin:0; padding:0; background-color:#0A0A0C; font-family:Helvetica,Arial,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#0A0A0C; padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px; background-color:#141419; border:1px solid rgba(255,255,255,0.1); border-radius:16px; overflow:hidden;">
            <tr>
              <td style="background-color:#153A63; padding:24px 32px;">
                <span style="color:#FFFFFF; font-size:18px; font-weight:700; letter-spacing:0.02em;">Afritech</span>
              </td>
            </tr>
            <tr>
              <td style="padding:32px;">
                <h1 style="margin:0 0 16px; color:#F5F5F2; font-size:22px; font-weight:600;">
                  Votre rendez-vous est confirmé
                </h1>
                <p style="margin:0 0 16px; color:#F5F5F2; font-size:15px; line-height:1.6;">
                  Bonjour ${escapeHtml(fullName)},
                </p>
                <p style="margin:0 0 24px; color:#8A8F98; font-size:15px; line-height:1.6;">
                  Votre appel avec notre équipe est programmé le
                  <strong style="color:#2C6CB8;">${escapeHtml(formattedDate)}</strong>
                  à
                  <strong style="color:#2C6CB8;">${escapeHtml(formattedTime)}</strong>.
                </p>
                <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%; background-color:#0A0A0C; border:1px solid rgba(255,255,255,0.1); border-radius:12px;">
                  <tr>
                    <td style="padding:16px 20px;">
                      <p style="margin:0; color:#8A8F98; font-size:13px; text-transform:uppercase; letter-spacing:0.04em;">Date</p>
                      <p style="margin:4px 0 12px; color:#F5F5F2; font-size:15px;">${escapeHtml(formattedDate)}</p>
                      <p style="margin:0; color:#8A8F98; font-size:13px; text-transform:uppercase; letter-spacing:0.04em;">Heure</p>
                      <p style="margin:4px 0 0; color:#F5F5F2; font-size:15px;">${escapeHtml(formattedTime)}</p>
                    </td>
                  </tr>
                </table>
                <p style="margin:24px 0 0; color:#8A8F98; font-size:13px; line-height:1.6;">
                  Besoin de modifier ce créneau ? Répondez simplement à cet email.
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding:20px 32px; border-top:1px solid rgba(255,255,255,0.1);">
                <p style="margin:0; color:#8A8F98; font-size:12px;">
                  Afritech — Agence de création logicielle web, mobile & IA.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
