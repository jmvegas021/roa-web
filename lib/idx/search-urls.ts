/**
 * IDX Broker hosted-search URL builders.
 *
 * City name filters (`csv_city=Salado`) return 0 listings on this MLS.
 * Use numeric city IDs from `/mls/cities/{idxID}` instead (`city[]=41043`).
 */

export interface IdxCityMarket {
  label: string;
  /** IDX Broker cityID for MLS e188 (Central Texas / ACTRIS-related feed). */
  cityId: string;
}

/** Primary markets Kevin services — IDs verified via IDX MLS cities API. */
export const IDX_CITY_MARKETS: IdxCityMarket[] = [
  { label: "Salado", cityId: "41043" },
  { label: "Belton", cityId: "3536" },
  { label: "Temple", cityId: "46010" },
  { label: "Georgetown", cityId: "17763" },
  { label: "Harker Heights", cityId: "20100" },
  { label: "Killeen", cityId: "24200" },
  { label: "Nolanville", cityId: "33090" },
];

export type IdxSearchKind = "map" | "city" | "address" | "city-address";

export interface ParsedIdxSearch {
  kind: IdxSearchKind;
  /** Original user query (may be empty for bare map). */
  query: string;
  city?: IdxCityMarket;
  /** Street / free-text fragment for aw_address. */
  address?: string;
  /** Short label for page chrome. */
  summary: string;
}

const STREET_SUFFIXES =
  /\b(road|rd|street|st|drive|dr|lane|ln|court|ct|circle|cir|boulevard|blvd|avenue|ave|way|trail|trl|parkway|pkwy|place|pl|terrace|ter|highway|hwy|loop|pass|crossing|xing)\b\.?/gi;

const SUBDIVISION_NOISE =
  /\b(overlook\s+at|community|subdivision|neighborhood|addition)\b/gi;

function normalizeWhitespace(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

function findCityInQuery(query: string): {
  city: IdxCityMarket;
  remainder: string;
} | null {
  const lower = query.toLowerCase();
  const ranked = [...IDX_CITY_MARKETS].sort(
    (a, b) => b.label.length - a.label.length
  );

  for (const city of ranked) {
    const name = city.label.toLowerCase();
    const index = lower.indexOf(name);
    if (index === -1) continue;
    const before = query.slice(0, index);
    const after = query.slice(index + city.label.length);
    const remainder = normalizeWhitespace(
      `${before} ${after}`.replace(/[,\-|/]+/g, " ")
    );
    return { city, remainder };
  }
  return null;
}

/**
 * IDX wild-address search is sensitive to house numbers and Rd/St abbreviations.
 * Prefer the street core (e.g. "Inka") so nearby homes still surface.
 */
export function extractStreetSearchToken(addressFragment: string): string {
  let value = normalizeWhitespace(addressFragment);
  value = value.replace(SUBDIVISION_NOISE, " ");
  value = value.replace(/[,\-|/]+/g, " ");
  value = value.replace(/^\d+[A-Za-z]?\s+/, "");
  value = value.replace(STREET_SUFFIXES, " ");
  value = normalizeWhitespace(value.replace(/\b(tx|texas)\b/gi, " "));
  return value;
}

/** Parse homepage /search ?q= into IDX results criteria. */
export function parseIdxSearchQuery(rawQuery: string): ParsedIdxSearch {
  const query = normalizeWhitespace(rawQuery);
  if (!query) {
    return {
      kind: "map",
      query: "",
      summary: "Explore the market",
    };
  }

  const exactCity = IDX_CITY_MARKETS.find(
    (city) => city.label.toLowerCase() === query.toLowerCase()
  );
  if (exactCity) {
    return {
      kind: "city",
      query,
      city: exactCity,
      summary: `Homes in ${exactCity.label}`,
    };
  }

  const withCity = findCityInQuery(query);
  if (withCity) {
    const street = extractStreetSearchToken(withCity.remainder);
    if (street) {
      return {
        kind: "city-address",
        query,
        city: withCity.city,
        address: street,
        summary: `“${street}” in ${withCity.city.label}`,
      };
    }
    return {
      kind: "city",
      query,
      city: withCity.city,
      summary: `Homes in ${withCity.city.label}`,
    };
  }

  const street = extractStreetSearchToken(query) || query;
  return {
    kind: "address",
    query,
    address: street,
    summary: `Results for “${street}”`,
  };
}

export function buildIdxMapSearchUrl(subdomain: string): string {
  return `https://${subdomain}/idx/map/mapsearch`;
}

export function buildIdxAdvancedSearchUrl(subdomain: string): string {
  return `https://${subdomain}/idx/search/advanced`;
}

export function buildIdxAddressSearchUrl(subdomain: string): string {
  return `https://${subdomain}/idx/search/address`;
}

/**
 * Hosted results URL for iframe embed on /search.
 * Always keep the browser on our domain; only the iframe src points at IDX.
 */
export function buildIdxResultsEmbedUrl(
  subdomain: string,
  parsed: ParsedIdxSearch
): string {
  if (parsed.kind === "map") return buildIdxMapSearchUrl(subdomain);

  const params = new URLSearchParams();
  params.set("per", "25");
  params.set("start", "1");

  if (parsed.city) params.append("city[]", parsed.city.cityId);
  if (parsed.address) params.set("aw_address", parsed.address);

  return `https://${subdomain}/idx/results/listings?${params.toString()}`;
}

/** In-app path for city chips and CTAs — never leaves the marketing site. */
export function buildOnSiteSearchPath(query: string): string {
  const trimmed = normalizeWhitespace(query);
  if (!trimmed) return "/search";
  return `/search?q=${encodeURIComponent(trimmed)}`;
}
