/**
 * Client-safe public IDX config (no secrets).
 */
export function getPublicIdxConfig() {
  return {
    subdomain: process.env.NEXT_PUBLIC_IDX_SUBDOMAIN || "",
    quickSearchId: process.env.NEXT_PUBLIC_IDX_QUICK_SEARCH_ID || "",
    showcaseId: process.env.NEXT_PUBLIC_IDX_SHOWCASE_ID || "",
    mapSearchId: process.env.NEXT_PUBLIC_IDX_MAP_SEARCH_ID || "",
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  };
}
