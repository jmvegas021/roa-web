import { uploadBlogImage } from "@/lib/blog-agent/manage-media";
import { verifyImageUploadTicket } from "@/lib/blog-agent/image-upload-ticket";
import { corsHeaders, jsonResponse } from "@/lib/blog-agent/publish-auth";
import { MAX_IMAGE_BYTES } from "@/lib/blog-agent/constants";

export const runtime = "nodejs";
export const maxDuration = 60;

export function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      ...corsHeaders(),
      "access-control-allow-methods": "GET, POST, PUT, OPTIONS",
    },
  });
}

export async function PUT(request: Request) {
  return receive(request);
}

export async function POST(request: Request) {
  return receive(request);
}

async function receive(request: Request): Promise<Response> {
  try {
    const ticket = new URL(request.url).searchParams.get("ticket");
    const payload = verifyImageUploadTicket(ticket);
    const buffer = Buffer.from(await request.arrayBuffer());
    if (buffer.length > MAX_IMAGE_BYTES) {
      throw new Error(`Image must be at most ${Math.round(MAX_IMAGE_BYTES / 1000)}KB.`);
    }
    const result = await uploadBlogImage({
      slug: payload.slug,
      filename: payload.filename,
      alt: payload.alt || undefined,
      setAsHero: payload.setAsHero,
      buffer,
    });
    return jsonResponse({
      ...result,
      note: result.heroUpdated
        ? "Hero updated. Vercel may take 1–2 minutes."
        : `Call set_post_hero with path ${result.path}.`,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Upload failed.";
    return jsonResponse({ error: message }, 400);
  }
}
