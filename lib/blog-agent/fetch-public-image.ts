import { isIP } from "node:net";
import { lookup as dnsLookup } from "node:dns/promises";
import { MAX_IMAGE_BYTES } from "./constants";

const MAX_REDIRECTS = 3;
const FETCH_MS = 15_000;

export interface PublicImageFetcher {
  fetch: typeof fetch;
  lookup: typeof dnsLookup;
}

export async function fetchPublicImage(
  imageUrl: string,
  fetcher: PublicImageFetcher = defaultFetcher()
): Promise<Buffer> {
  let current = parseHttpsUrl(imageUrl);
  for (let hop = 0; hop <= MAX_REDIRECTS; hop += 1) {
    await assertPublicHostname(current.hostname, fetcher.lookup);
    const response = await fetcher.fetch(current, {
      method: "GET",
      redirect: "manual",
      signal: AbortSignal.timeout(FETCH_MS),
      headers: {
        accept: "image/webp,image/jpeg,image/png,image/*;q=0.8",
        "user-agent": "kevinshoun-blog-agent/1.0 (+https://www.kevinshoun.com)",
      },
    });

    if (response.status >= 300 && response.status < 400) {
      const location = response.headers.get("location");
      if (!location) throw new Error("Image URL redirected without a Location header.");
      current = parseHttpsUrl(new URL(location, current).toString());
      continue;
    }

    if (!response.ok) {
      throw new Error(`Could not download image (${response.status}).`);
    }

    const length = Number(response.headers.get("content-length") ?? "0");
    if (length > MAX_IMAGE_BYTES) {
      throw new Error(`Image must be at most ${Math.round(MAX_IMAGE_BYTES / 1000)}KB.`);
    }

    const buffer = Buffer.from(await response.arrayBuffer());
    if (buffer.length > MAX_IMAGE_BYTES) {
      throw new Error(`Image must be at most ${Math.round(MAX_IMAGE_BYTES / 1000)}KB.`);
    }
    return buffer;
  }
  throw new Error("Too many redirects while downloading the image.");
}

function defaultFetcher(): PublicImageFetcher {
  return {
    fetch: globalThis.fetch.bind(globalThis),
    lookup: dnsLookup,
  };
}

function parseHttpsUrl(value: string): URL {
  let parsed: URL;
  try {
    parsed = new URL(value);
  } catch {
    throw new Error("imageUrl must be a valid https URL.");
  }
  if (parsed.protocol !== "https:") {
    throw new Error("imageUrl must use https.");
  }
  if (parsed.username || parsed.password) {
    throw new Error("imageUrl must not include credentials.");
  }
  return parsed;
}

async function assertPublicHostname(
  hostname: string,
  lookup: typeof dnsLookup
): Promise<void> {
  const host = hostname.replace(/^\[|\]$/g, "").toLowerCase();
  if (
    host === "localhost" ||
    host.endsWith(".local") ||
    host.endsWith(".internal") ||
    host === "0.0.0.0"
  ) {
    throw new Error("imageUrl host is not allowed.");
  }
  if (isIP(host)) {
    if (isPrivateIp(host)) {
      throw new Error("imageUrl must not point at a private address.");
    }
    return;
  }
  const resolved = await lookup(host, { all: true });
  if (resolved.length === 0) throw new Error("imageUrl host could not be resolved.");
  if (resolved.some((record) => isPrivateIp(record.address))) {
    throw new Error("imageUrl must not resolve to a private address.");
  }
}

function isPrivateIp(address: string): boolean {
  const mapped = address.match(/:ffff:(\d+\.\d+\.\d+\.\d+)$/i);
  if (mapped) return isPrivateIp(mapped[1]);
  if (address.startsWith("127.") || address === "::1" || address.startsWith("fe80:")) {
    return true;
  }
  if (address.startsWith("10.") || address.startsWith("192.168.") || address.startsWith("169.254.")) {
    return true;
  }
  if (address.startsWith("172.")) {
    const second = Number(address.split(".")[1]);
    if (second >= 16 && second <= 31) return true;
  }
  const lower = address.toLowerCase();
  if (lower.startsWith("fc") || lower.startsWith("fd")) {
    return true;
  }
  return false;
}
