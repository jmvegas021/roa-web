import { SITE, TEAM } from "@/lib/content/team";
import { absoluteUrl } from "@/lib/site/siteUrl";
import type { LuxuryListing } from "@/lib/idx/types";

const kevin = TEAM.find((agent) => agent.isPrimary) ?? TEAM[0];

export function buildOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    "@id": absoluteUrl("/#organization"),
    name: `${SITE.brand} — ${SITE.office}`,
    legalName: SITE.brand,
    url: absoluteUrl("/"),
    image: absoluteUrl("/images/realty-of-america-logo.png"),
    logo: absoluteUrl("/images/realty-of-america-logo.png"),
    telephone: SITE.phone,
    email: SITE.email,
    description: `${SITE.office} provides residential real estate representation in Belton, Temple, and Central Texas.`,
    areaServed: [
      { "@type": "City", name: "Belton", containedInPlace: { "@type": "State", name: "Texas" } },
      { "@type": "City", name: "Temple", containedInPlace: { "@type": "State", name: "Texas" } },
      { "@type": "AdministrativeArea", name: "Central Texas" },
    ],
    address: {
      "@type": "PostalAddress",
      addressLocality: "Temple",
      addressRegion: "TX",
      addressCountry: "US",
    },
    sameAs: [`https://kevinshoun.idxbroker.com`],
    employee: {
      "@id": absoluteUrl("/agents/kevin-shoun#person"),
    },
  };
}

export function buildKevinPersonSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    "@id": absoluteUrl("/agents/kevin-shoun#person"),
    name: kevin.name,
    jobTitle: kevin.title,
    url: absoluteUrl("/agents/kevin-shoun"),
    image: absoluteUrl("/images/kevin-shoun.webp"),
    telephone: kevin.phone,
    email: kevin.email,
    description: kevin.bio,
    worksFor: { "@id": absoluteUrl("/#organization") },
    areaServed: ["Belton, TX", "Temple, TX", "Central Texas"],
    knowsAbout: kevin.specialties,
  };
}

export function buildWebSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": absoluteUrl("/#website"),
    name: `${SITE.brand} · ${SITE.office}`,
    url: absoluteUrl("/"),
    description: `${SITE.office} — Belton, Temple, and Central Texas real estate.`,
    publisher: { "@id": absoluteUrl("/#organization") },
  };
}

export function buildListingSchema(listing: LuxuryListing) {
  const images = listing.gallery?.length
    ? listing.gallery
    : listing.imageUrl
      ? [listing.imageUrl]
      : [];

  return {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    name: `${listing.address}, ${listing.city}, ${listing.state}`,
    description: listing.description.slice(0, 500) || undefined,
    url: absoluteUrl(`/listings/${listing.id}`),
    image: images.length ? images : undefined,
    offers: {
      "@type": "Offer",
      price: listing.price || undefined,
      priceCurrency: "USD",
      availability: /pending|under contract/i.test(listing.status)
        ? "https://schema.org/PreOrder"
        : "https://schema.org/InStock",
      seller: { "@id": absoluteUrl("/#organization") },
    },
    contentLocation: {
      "@type": "Place",
      name: `${listing.address}, ${listing.city}, ${listing.state}`,
      address: {
        "@type": "PostalAddress",
        streetAddress: listing.address,
        addressLocality: listing.city,
        addressRegion: listing.state,
        postalCode: listing.zip || undefined,
        addressCountry: "US",
      },
      numberOfRooms: listing.bedrooms || undefined,
      numberOfBathroomsTotal: listing.bathrooms || undefined,
      floorSize: listing.sqft
        ? {
            "@type": "QuantitativeValue",
            value: listing.sqft,
            unitCode: "FTK",
          }
        : undefined,
    },
  };
}

export function buildBreadcrumbSchema(
  items: Array<{ name: string; path: string }>
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}
