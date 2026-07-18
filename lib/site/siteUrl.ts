import { SITE } from "@/lib/content/team";

/** Production canonical origin for metadata, sitemap, and JSON-LD. */
export function getSiteUrl(): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (configured) return configured;
  if (process.env.VERCEL_URL)
    return `https://${process.env.VERCEL_URL.replace(/\/$/, "")}`;
  return "http://localhost:3000";
}

export function absoluteUrl(path = "/"): string {
  const base = getSiteUrl();
  if (!path || path === "/") return base;
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

export const DEFAULT_DESCRIPTION = `${SITE.office} at ${SITE.brand} — Belton, Temple, and Central Texas real estate. Discreet buyer and seller representation for residential homes.`;

export const DEFAULT_KEYWORDS = [
  "Kevin Shoun",
  "Realty of America",
  "Belton TX real estate",
  "Temple TX realtor",
  "Belton TX realtor",
  "Temple TX real estate",
  "Salado TX homes",
  "Harker Heights real estate",
  "Central Texas homes for sale",
  "Belton homes for sale",
  "Temple homes for sale",
  "Bell County realtor",
];
