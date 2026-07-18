/**
 * Client-safe public IDX config (no secrets).
 * Defaults match Kevin Shoun’s IDX account widgets so search works
 * even before env is wired on a fresh deploy.
 */
export function getPublicIdxConfig() {
  return {
    subdomain:
      process.env.NEXT_PUBLIC_IDX_SUBDOMAIN || "kevinshoun.idxbroker.com",
    quickSearchId: process.env.NEXT_PUBLIC_IDX_QUICK_SEARCH_ID || "",
    showcaseId: process.env.NEXT_PUBLIC_IDX_SHOWCASE_ID || "157760",
    mapSearchId: process.env.NEXT_PUBLIC_IDX_MAP_SEARCH_ID || "157763",
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  };
}
