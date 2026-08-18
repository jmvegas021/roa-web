import { SITE } from "@/lib/content/team";

export const PRODUCTION_SITE_URL = "https://www.kevinshoun.com";

/** Production canonical origin for metadata, sitemap, and JSON-LD. */
export function getSiteUrl(): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, "");
  if (configured) return configured;
  if (process.env.NODE_ENV === "development") return "http://localhost:3000";
  return PRODUCTION_SITE_URL;
}

export function absoluteUrl(path = "/"): string {
  const base = getSiteUrl();
  if (!path || path === "/") return base;
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

export const DEFAULT_DESCRIPTION = `${SITE.office} at ${SITE.brand} — Salado, Belton, Temple, Georgetown, and Central Texas real estate. Precision buyer, seller, land, and military relocation representation.`;

export const DEFAULT_KEYWORDS = [
  "Kevin Shoun",
  "Realty of America",
  "Salado TX realtor",
  "Belton TX real estate",
  "Temple TX realtor",
  "Georgetown TX realtor",
  "Belton TX realtor",
  "Temple TX real estate",
  "Salado TX homes",
  "Harker Heights real estate",
  "Central Texas homes for sale",
  "Belton homes for sale",
  "Temple homes for sale",
  "Bell County realtor",
  "Williamson County realtor",
  "military relocation Texas",
  "farm and ranch Central Texas",
];
