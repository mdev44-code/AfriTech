const rawSiteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const SITE_URL = rawSiteUrl.replace(/\/$/, "");
export const SITE_NAME = "Afritech";
export const SITE_TITLE = `${SITE_NAME} — Agence web, mobile, automatisation & IA`;
export const SITE_DESCRIPTION =
  "Agence de création de logiciels web/mobile, d'automatisation et d'intégration d'IA.";
