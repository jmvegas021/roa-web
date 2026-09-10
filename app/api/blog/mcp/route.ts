import { handleMcpRequest } from "@/lib/blog-agent/mcp-server";
import {
  corsHeaders,
  getPublishSecret,
  isAuthorizedPublishRequest,
  jsonResponse,
  unauthorizedResponse,
} from "@/lib/blog-agent/publish-auth";
import { clientKey, isRateLimited } from "@/lib/blog-agent/rate-limit";

export const runtime = "nodejs";
export const maxDuration = 30;

export function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders() });
}

export function GET(request: Request) {
  if (!getPublishSecret()) {
    return jsonResponse({ error: "BLOG_PUBLISH_SECRET is not configured." }, 503);
  }
  if (!isAuthorizedPublishRequest(request)) return unauthorizedResponse();
  return jsonResponse({
    name: "kevin-blog",
    status: "ok",
    tools: [
      "list_blog_posts",
      "suggest_next_topic",
      "get_blog_post",
      "publish_blog_post",
    ],
  });
}

export async function POST(request: Request) {
  if (!getPublishSecret()) {
    return jsonResponse({ error: "BLOG_PUBLISH_SECRET is not configured." }, 503);
  }
  if (!isAuthorizedPublishRequest(request)) return unauthorizedResponse();
  if (isRateLimited(`mcp:${clientKey(request)}`)) {
    return jsonResponse({ error: "Too many requests." }, 429);
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonResponse({ error: "JSON-RPC body required." }, 400);
  }

  const handled = await handleMcpRequest(
    (body ?? {}) as Parameters<typeof handleMcpRequest>[0]
  );
  if (handled.payload === null) {
    return new Response(null, { status: handled.status, headers: corsHeaders() });
  }
  return jsonResponse(handled.payload, handled.status);
}
