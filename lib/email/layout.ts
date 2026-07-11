import { LOGO_CONTENT_ID } from "@/lib/email/logo-attachment";

interface EmailLayoutParams {
  previewTitle: string;
  bodyHtml: string;
}

export function renderEmailLayout({ previewTitle, bodyHtml }: EmailLayoutParams): string {
  return `
<!DOCTYPE html>
<html lang="fr">
  <head>
    <meta charset="utf-8" />
    <title>${escapeHtml(previewTitle)}</title>
  </head>
  <body style="margin:0; padding:0; background-color:#F4F6F8; font-family:Helvetica,Arial,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#F4F6F8; padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px; background-color:#FFFFFF; border:1px solid #E4E4E7; border-radius:16px; overflow:hidden;">
            <tr>
              <td style="padding:24px 32px; border-bottom:1px solid #E4E4E7;">
                <img src="cid:${LOGO_CONTENT_ID}" alt="Afritech" width="120" height="36" style="display:block; width:120px; height:auto;" />
              </td>
            </tr>
            <tr>
              <td style="padding:32px;">
                ${bodyHtml}
              </td>
            </tr>
            <tr>
              <td style="padding:20px 32px; border-top:1px solid #E4E4E7;">
                <p style="margin:0; color:#8A8F98; font-size:12px;">
                  Afritech — Agence de création logicielle web, mobile &amp; IA.
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

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
