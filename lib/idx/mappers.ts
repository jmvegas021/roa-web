import type {
  AgentProfile,
  IdxAgentRaw,
  IdxFeaturedListingRaw,
  LuxuryListing,
} from "./types";
import { withBasePath } from "@/lib/site/basePath";

function toNumber(value: string | number | undefined, fallback = 0): number {
  if (value === undefined || value === null || value === "") return fallback;
  const n = typeof value === "number" ? value : Number(String(value).replace(/[^0-9.]/g, ""));
  return Number.isFinite(n) ? n : fallback;
}

function extractImage(raw: IdxFeaturedListingRaw): string {
  if (typeof raw.image === "string" && raw.image) return raw.image;
  if (raw.image && typeof raw.image === "object" && raw.image.url) return raw.image.url;
  if (typeof raw.imageUrl === "string" && raw.imageUrl) return raw.imageUrl;
  if (Array.isArray(raw.images) && raw.images.length > 0) {
    const first = raw.images[0];
    if (typeof first === "string") return first;
    if (first && typeof first === "object" && first.url) return first.url;
  }
  return withBasePath("/images/listing-placeholder.svg");
}

function extractGallery(raw: IdxFeaturedListingRaw): string[] {
  const primary = extractImage(raw);
  if (!Array.isArray(raw.images) || raw.images.length === 0) return [primary];
  const urls = raw.images
    .map((item) => {
      if (typeof item === "string") return item;
      if (item && typeof item === "object" && item.url) return item.url;
      return "";
    })
    .filter(Boolean);
  return urls.length > 0 ? urls : [primary];
}

function buildAddress(raw: IdxFeaturedListingRaw): string {
  if (raw.address) return String(raw.address);
  if (raw.streetName) return String(raw.streetName);
  return "Address upon request";
}

export function mapFeaturedListing(raw: IdxFeaturedListingRaw): LuxuryListing {
  const listingId = String(
    raw.listingID ?? raw.idxID ?? `listing-${buildAddress(raw)}`.replace(/\s+/g, "-")
  );
  return {
    id: listingId,
    listingId,
    address: buildAddress(raw),
    city: String(raw.cityName ?? raw.city ?? "Central Texas"),
    state: String(raw.state ?? "TX"),
    zip: String(raw.zipcode ?? raw.zip ?? ""),
    price: toNumber(raw.listingPrice ?? raw.price),
    bedrooms: toNumber(raw.bedrooms),
    bathrooms: toNumber(raw.totalBaths ?? raw.bathrooms),
    sqft: toNumber(raw.sqFt),
    status: String(raw.propStatus ?? raw.status ?? "Active"),
    imageUrl: extractImage(raw),
    gallery: extractGallery(raw),
    description: String(
      raw.remarksConcat ?? raw.remarks ?? "Exceptional Central Texas property."
    ),
    mlsId: raw.mlsPtID !== undefined ? String(raw.mlsPtID) : undefined,
    idxDetailUrl: raw.fullDetailsURL ?? raw.detailsURL,
    agentName: raw.agentDisplayName ?? raw.agent,
  };
}

export function mapFeaturedListings(
  payload: unknown
): LuxuryListing[] {
  if (!payload) return [];
  if (Array.isArray(payload)) {
    return payload.map((item) => mapFeaturedListing(item as IdxFeaturedListingRaw));
  }
  if (typeof payload === "object") {
    const values = Object.values(payload as Record<string, IdxFeaturedListingRaw>);
    return values
      .filter((item) => item && typeof item === "object")
      .map((item) => mapFeaturedListing(item));
  }
  return [];
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function mapAgent(raw: IdxAgentRaw): AgentProfile {
  const name =
    raw.agentName ||
    [raw.agentFirstName, raw.agentLastName].filter(Boolean).join(" ") ||
    "Agent";
  const slug = slugify(name);
  const fallbackPhoto =
    slug === "kevin-shoun"
      ? withBasePath("/images/kevin-shoun.webp")
      : withBasePath("/images/agent-placeholder.svg");
  return {
    id: String(raw.agentID ?? slug),
    slug,
    name,
    title: String(raw.agentTitle ?? "Realtor®"),
    email: String(raw.agentEmail ?? ""),
    phone: String(raw.agentPhone ?? ""),
    bio: String(raw.agentBio ?? ""),
    specialties: [],
    imageUrl: String(raw.agentPhotoURL || fallbackPhoto),
  };
}

export function mapAgents(payload: unknown): AgentProfile[] {
  if (!payload) return [];
  if (Array.isArray(payload)) {
    return payload.map((item) => mapAgent(item as IdxAgentRaw));
  }
  if (typeof payload === "object") {
    return Object.values(payload as Record<string, IdxAgentRaw>)
      .filter((item) => item && typeof item === "object")
      .map((item) => mapAgent(item));
  }
  return [];
}

export function formatPrice(price: number): string {
  if (!price) return "Price upon request";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(price);
}

export function formatSqft(sqft: number): string {
  if (!sqft) return "—";
  return `${new Intl.NumberFormat("en-US").format(sqft)} sq ft`;
}
