import { getGithubToken } from "@/lib/blog-agent/commit-post";
import { MAX_MARKDOWN_CHARS } from "@/lib/blog-agent/constants";
import { publishArgsSchema } from "@/lib/blog-agent/mcp-server";
import {
  corsHeaders,
  getPublishSecret,
  isAuthorizedPublishRequest,
  jsonResponse,
  unauthorizedResponse,
} from "@/lib/blog-agent/publish-auth";
import { publishValidatedMarkdown } from "@/lib/blog-agent/publish-markdown";
import { clientKey, isRateLimited } from "@/lib/blog-agent/rate-limit";

export const runtime = "nodejs";
export const maxDuration = 60;

export function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders() });
}

export async function POST(request: Request) {
  if (!getPublishSecret()) {
    return jsonResponse({ error: "BLOG_PUBLISH_SECRET is not configured." }, 503);
  }
  if (!isAuthorizedPublishRequest(request)) return unauthorizedResponse();
  if (isRateLimited(clientKey(request))) {
    return jsonResponse({ error: "Too many publish attempts. Try again shortly." }, 429);
  }
  if (!getGithubToken()) {
    return jsonResponse({ error: "BLOG_GITHUB_TOKEN is not configured." }, 503);
  }

  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return jsonResponse({ error: "JSON body required." }, 400);
  }

  const parsed = publishArgsSchema.safeParse(raw);
  if (!parsed.success) {
    return jsonResponse({ error: parsed.error.message }, 400);
  }
  if (parsed.data.markdown.length > MAX_MARKDOWN_CHARS) {
    return jsonResponse({ error: "Markdown exceeds the publish limit." }, 413);
  }

  try {
    const published = await publishValidatedMarkdown({
      markdown: parsed.data.markdown,
      mode: parsed.data.mode ?? "create",
      followUps: parsed.data.followUps,
      topicId: parsed.data.topicId,
    });
    if (!published.ok) {
      return jsonResponse({ error: "Validation failed.", errors: published.errors }, published.status);
    }
    return jsonResponse({
      ok: true,
      canonicalUrl: published.result.canonicalUrl,
      slug: published.result.slug,
      title: published.result.title,
      sha: published.result.sha,
      files: published.result.files,
      note: "Vercel may take 1–2 minutes to deploy.",
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Publish failed.";
    return jsonResponse({ error: message }, 502);
  }
}
