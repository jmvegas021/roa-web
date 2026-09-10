import { createHmac, timingSafeEqual } from "node:crypto";
import { PRODUCTION_SITE_URL } from "@/lib/site/siteUrl";
import { getPublishSecret } from "./publish-auth";

const TICKET_MS = 10 * 60_000;

export interface ImageUploadTicket {
  slug: string;
  filename: string;
  alt: string;
  setAsHero: boolean;
  exp: number;
}

export function createImageUploadTicket(input: {
  slug: string;
  filename?: string;
  alt?: string;
  setAsHero?: boolean;
}): { putUrl: string; expiresAt: string } {
  const payload: ImageUploadTicket = {
    slug: input.slug,
    filename: input.filename ?? "hero.webp",
    alt: input.alt?.trim() ?? "",
    setAsHero: input.setAsHero === true,
    exp: Date.now() + TICKET_MS,
  };
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const token = `${body}.${sign(body)}`;
  return {
    putUrl: `${PRODUCTION_SITE_URL}/api/blog/images?ticket=${token}`,
    expiresAt: new Date(payload.exp).toISOString(),
  };
}

export function verifyImageUploadTicket(token: string | null): ImageUploadTicket {
  if (!token || !token.includes(".")) {
    throw new Error("Image upload ticket is missing or invalid.");
  }
  const [body, signature] = token.split(".");
  const expected = sign(body);
  const left = Buffer.from(signature);
  const right = Buffer.from(expected);
  if (left.length !== right.length || !timingSafeEqual(left, right)) {
    throw new Error("Image upload ticket is invalid.");
  }
  const payload = JSON.parse(Buffer.from(body, "base64url").toString("utf8")) as ImageUploadTicket;
  if (typeof payload.slug !== "string" || typeof payload.exp !== "number") {
    throw new Error("Image upload ticket is invalid.");
  }
  if (Date.now() > payload.exp) {
    throw new Error("Image upload ticket expired. Call create_blog_image_upload again.");
  }
  return payload;
}

function sign(body: string): string {
  const secret = getPublishSecret();
  if (!secret) throw new Error("BLOG_PUBLISH_SECRET is not configured.");
  return createHmac("sha256", secret).update(body).digest("base64url");
}
