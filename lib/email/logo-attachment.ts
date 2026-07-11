import fs from "node:fs";
import path from "node:path";

/**
 * Email clients (Gmail included) won't fetch images from a non-public
 * localhost URL, and often block/cache remote images unpredictably even in
 * production. Embedding the logo as an inline CID attachment instead makes
 * it render reliably regardless of environment.
 */
export const LOGO_CONTENT_ID = "afritech-logo";

export function getLogoAttachment(): { filename: string; content: Buffer; contentId: string } | null {
  const logoPath = path.join(process.cwd(), "public", "logo.png");
  if (!fs.existsSync(logoPath)) {
    return null;
  }

  return {
    filename: "logo.png",
    content: fs.readFileSync(logoPath),
    contentId: LOGO_CONTENT_ID,
  };
}
