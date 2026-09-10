import { handleMcpRequest, isPublicMcpMethod } from "@/lib/blog-agent/mcp-server";
import { MCP_TOOLS } from "@/lib/blog-agent/mcp-tools";
import {
  corsHeaders,
  getPublishSecret,
  isAuthorizedPublishRequest,
  jsonResponse,
  unauthorizedResponse,
} from "@/lib/blog-agent/publish-auth";
import { clientKey, isRateLimited } from "@/lib/blog-agent/rate-limit";

export const runtime = "nodejs";
export const maxDuration = 60;

export function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders() });
}

export function GET() {
  if (!getPublishSecret()) {
    return jsonResponse({ error: "BLOG_PUBLISH_SECRET is not configured." }, 503);
  }
  return jsonResponse({
    name: "kevin-blog",
    status: "ok",
    tools: MCP_TOOLS.map((tool) => tool.name),
  });
}

export function HEAD() {
  if (!getPublishSecret()) {
    return new Response(null, { status: 503, headers: corsHeaders() });
  }
  return new Response(null, { status: 200, headers: corsHeaders() });
}

export async function POST(request: Request) {
  if (!getPublishSecret()) {
    return jsonResponse({ error: "BLOG_PUBLISH_SECRET is not configured." }, 503);
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonResponse({ error: "JSON-RPC body required." }, 400);
  }

  const method =
    body && typeof body === "object" && "method" in body
      ? (body as { method?: unknown }).method
      : undefined;
  if (!isPublicMcpMethod(typeof method === "string" ? method : undefined)) {
    if (!isAuthorizedPublishRequest(request)) return unauthorizedResponse();
    if (isRateLimited(`mcp:${clientKey(request)}`)) {
      return jsonResponse({ error: "Too many requests." }, 429);
    }
  }

  const handled = await handleMcpRequest(
    (body ?? {}) as Parameters<typeof handleMcpRequest>[0]
  );
  if (handled.payload === null) {
    return new Response(null, { status: handled.status, headers: corsHeaders() });
  }
  return jsonResponse(handled.payload, handled.status);
}
