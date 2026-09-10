import { timingSafeEqual } from "node:crypto";

export function getPublishSecret(): string | undefined {
  const value = process.env.BLOG_PUBLISH_SECRET?.trim();
  return value || undefined;
}

export function extractPublishToken(request: Request): string {
  const header = request.headers.get("authorization") ?? "";
  if (header.toLowerCase().startsWith("bearer ")) {
    return header.slice(7).trim();
  }
  const apiKey = request.headers.get("x-api-key")?.trim();
  if (apiKey) return apiKey;
  try {
    return new URL(request.url).searchParams.get("key")?.trim() ?? "";
  } catch {
    return "";
  }
}

export function isAuthorizedPublishRequest(request: Request): boolean {
  const secret = getPublishSecret();
  if (!secret) return false;
  const token = extractPublishToken(request);
  if (!token) return false;
  return safeEqual(token, secret);
}

export function unauthorizedResponse(): Response {
  return jsonResponse({ error: "Unauthorized." }, 401);
}

export function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      ...corsHeaders(),
    },
  });
}

export function corsHeaders(): Record<string, string> {
  return {
    "access-control-allow-origin": "*",
    "access-control-allow-methods": "GET, POST, PUT, OPTIONS",
    "access-control-allow-headers":
      "authorization, content-type, accept, mcp-session-id, x-api-key",
  };
}

function safeEqual(left: string, right: string): boolean {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  if (leftBuffer.length !== rightBuffer.length) return false;
  return timingSafeEqual(leftBuffer, rightBuffer);
}
