import { withBasePath } from "@/lib/site/basePath";

/**
 * Homepage hero media. Swap files under public/videos/ and update paths here
 * when a custom shoot replaces the Pexels placeholder.
 */
export const HERO_MEDIA = {
  videoSrc: withBasePath("/videos/hero-placeholder.mp4"),
  posterSrc: withBasePath("/videos/hero-placeholder.jpg"),
  credit: "Video: Pexels — aerial luxury modern home (placeholder)",
  creditUrl:
    "https://www.pexels.com/video/aerial-view-of-luxury-and-modern-design-home-17224719/",
} as const;

/** City chips → IDX Broker results deep links (csv_city + csv_state). */
export const HERO_CITY_CHIPS = [
  { label: "Belton", city: "Belton" },
  { label: "Temple", city: "Temple" },
  { label: "Salado", city: "Salado" },
] as const;

export function buildIdxCityResultsUrl(
  subdomain: string,
  city: string,
  state = "TX"
): string {
  const params = new URLSearchParams({
    csv_city: city,
    csv_state: state,
  });
  return `https://${subdomain}/idx/results/listings?${params.toString()}`;
}
