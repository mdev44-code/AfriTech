interface DevisConfirmationEmailParams {
  fullName: string;
  projectTypeLabel: string;
}

export function renderDevisConfirmationEmail({
  fullName,
  projectTypeLabel,
}: DevisConfirmationEmailParams): string {
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
                  Votre demande de devis a bien été reçue
                </h1>
                <p style="margin:0 0 16px; color:#F5F5F2; font-size:15px; line-height:1.6;">
                  Bonjour ${escapeHtml(fullName)},
                </p>
                <p style="margin:0 0 16px; color:#8A8F98; font-size:15px; line-height:1.6;">
                  Merci pour votre demande concernant un projet de type
                  <strong style="color:#2C6CB8;">${escapeHtml(projectTypeLabel)}</strong>.
                  Notre équipe l'étudie et revient vers vous sous 24 à 48h ouvrées
                  avec une proposition adaptée.
                </p>
                <p style="margin:24px 0 0; color:#8A8F98; font-size:13px; line-height:1.6;">
                  Si vous avez la moindre question d'ici là, répondez simplement à cet email.
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
