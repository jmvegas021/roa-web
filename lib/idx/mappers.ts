import type {
  AgentProfile,
  IdxAgentRaw,
  IdxFeaturedListingRaw,
  LuxuryListing,
} from "./types";
import { withBasePath } from "@/lib/site/basePath";

function toNumber(value: string | number | undefined, fallback = 0): number {
  if (value === undefined || value === null || value === "") return fallback;
  const n =
    typeof value === "number"
      ? value
      : Number(String(value).replace(/[^0-9.]/g, ""));
  return Number.isFinite(n) ? n : fallback;
}

function normalizeState(state: string): string {
  const trimmed = state.trim();
  if (/^texas$/i.test(trimmed)) return "TX";
  return trimmed || "TX";
}

/** IDX often returns `image` as { "0": { url }, "1": { url }, ... }. */
function collectImageUrls(raw: IdxFeaturedListingRaw): string[] {
  const urls: string[] = [];

  const push = (value: unknown) => {
    if (typeof value === "string" && value.startsWith("http")) {
      urls.push(value);
      return;
    }
    if (value && typeof value === "object" && "url" in value) {
      const url = (value as { url?: unknown }).url;
      if (typeof url === "string" && url.startsWith("http")) urls.push(url);
    }
  };

  if (typeof raw.image === "string") push(raw.image);
  else if (raw.image && typeof raw.image === "object") {
    const entries = Object.entries(raw.image as Record<string, unknown>).sort(
      ([a], [b]) => Number(a) - Number(b)
    );
    for (const [, value] of entries) push(value);
  }

  if (typeof raw.imageUrl === "string") push(raw.imageUrl);

  if (Array.isArray(raw.images)) {
    for (const item of raw.images) push(item);
  }

  return [...new Set(urls)];
}

function extractImage(raw: IdxFeaturedListingRaw): string {
  return (
    collectImageUrls(raw)[0] ?? withBasePath("/images/listing-placeholder.svg")
  );
}

function extractGallery(raw: IdxFeaturedListingRaw): string[] {
  const urls = collectImageUrls(raw);
  return urls.length > 0
    ? urls
    : [withBasePath("/images/listing-placeholder.svg")];
}

function buildAddress(raw: IdxFeaturedListingRaw): string {
  if (raw.address) return String(raw.address);
  if (raw.streetName) return String(raw.streetName);
  return "Address upon request";
}

/** Unwrap IDX paginated envelopes: `{ data: { id: listing } }` or `{ data: [...] }`. */
export function unwrapIdxCollection(payload: unknown): unknown {
  if (!payload || typeof payload !== "object") return payload;
  if (Array.isArray(payload)) return payload;

  const record = payload as Record<string, unknown>;
  if ("data" in record) {
    const inner = record.data;
    if (Array.isArray(inner)) return inner;
    if (inner && typeof inner === "object") return inner;
  }
  return payload;
}

export function mapFeaturedListing(raw: IdxFeaturedListingRaw): LuxuryListing {
  const listingId = String(
    raw.listingID ??
      raw.idxID ??
      `listing-${buildAddress(raw)}`.replace(/\s+/g, "-")
  );

  return {
    id: listingId,
    listingId,
    address: buildAddress(raw),
    city: String(raw.cityName ?? raw.city ?? "Central Texas"),
    state: normalizeState(String(raw.state ?? "TX")),
    zip: String(raw.zipcode ?? raw.zip ?? ""),
    price: toNumber(raw.price ?? raw.listingPrice),
    bedrooms: toNumber(raw.bedrooms),
    bathrooms: toNumber(raw.totalBaths ?? raw.bathrooms ?? raw.fullBaths),
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

export function mapFeaturedListings(payload: unknown): LuxuryListing[] {
  const collection = unwrapIdxCollection(payload);
  if (!collection) return [];

  if (Array.isArray(collection)) {
    return collection.map((item) =>
      mapFeaturedListing(item as IdxFeaturedListingRaw)
    );
  }

  if (typeof collection === "object") {
    return Object.values(collection as Record<string, IdxFeaturedListingRaw>)
      .filter((item) => item && typeof item === "object" && !Array.isArray(item))
      .filter((item) => Boolean(item.listingID || item.address || item.idxID))
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
  const collection = unwrapIdxCollection(payload);
  if (!collection) return [];
  if (Array.isArray(collection)) {
    return collection.map((item) => mapAgent(item as IdxAgentRaw));
  }
  if (typeof collection === "object") {
    return Object.values(collection as Record<string, IdxAgentRaw>)
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
