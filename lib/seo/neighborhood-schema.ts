import type { NeighborhoodGuide } from "@/lib/content/neighborhood-guides";
import type { Neighborhood } from "@/lib/content/neighborhoods";
import { absoluteUrl } from "@/lib/site/siteUrl";

export function buildNeighborhoodPlaceSchema(
  guide: NeighborhoodGuide,
  neighborhood: Neighborhood
) {
  const pageUrl = absoluteUrl(`/neighborhoods/${guide.slug}`);

  return {
    "@context": "https://schema.org",
    "@type": "Place",
    "@id": `${pageUrl}#place`,
    name: `${neighborhood.name}, Texas`,
    description: guide.description,
    url: pageUrl,
    image: absoluteUrl(`/images/neighborhoods/${guide.slug}.webp`),
    containedInPlace: {
      "@type": "AdministrativeArea",
      name: neighborhood.region,
    },
  };
}
