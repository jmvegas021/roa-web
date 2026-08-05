import { withBasePath } from "@/lib/site/basePath";
import { IDX_CITY_MARKETS } from "@/lib/idx/search-urls";

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

/** City chips → on-site /search (IDX results embed via city IDs). */
export const HERO_CITY_CHIPS = IDX_CITY_MARKETS.filter((city) =>
  ["Salado", "Belton", "Temple", "Georgetown"].includes(city.label)
).map((city) => ({
  label: city.label,
  city: city.label,
}));
