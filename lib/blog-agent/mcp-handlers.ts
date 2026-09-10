import { readGithubFile } from "./commit-post";
import { listHeroAssets } from "./hero-catalog";
import { assertBlogSlug } from "./image-paths";
import {
  deleteBlogImage,
  deleteBlogPost,
  listPostImages,
  setPostHero,
  uploadBlogImage,
} from "./manage-media";
import {
  deleteImageArgsSchema,
  deletePostArgsSchema,
  publishArgsSchema,
  setHeroArgsSchema,
  slugArgsSchema,
  uploadArgsSchema,
} from "./mcp-tools";
import { publishValidatedMarkdown, suggestedTopicPayload } from "./publish-markdown";
import { PRODUCTION_SITE_URL } from "@/lib/site/siteUrl";

export async function callBlogTool(
  name: string | undefined,
  args: Record<string, unknown>
): Promise<{ text: string; isError: boolean }> {
  try {
    return { text: await dispatchTool(name, args), isError: false };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Request failed.";
    return { text: message, isError: true };
  }
}

async function dispatchTool(
  name: string | undefined,
  args: Record<string, unknown>
): Promise<string> {
  if (name === "list_blog_posts") {
    return JSON.stringify(await suggestedTopicPayload(), null, 2);
  }
  if (name === "suggest_next_topic") {
    const suggested = (await suggestedTopicPayload()).suggested;
    return suggested
      ? JSON.stringify(suggested, null, 2)
      : "No queued cluster topics remain.";
  }
  if (name === "list_hero_images") {
    return JSON.stringify(
      {
        note: "Stock photos already on kevinshoun.com. Prefer upload_blog_image when Kevin provides a new file.",
        images: listHeroAssets(),
      },
      null,
      2
    );
  }
  if (name === "get_blog_post") {
    const parsed = slugArgsSchema.safeParse(args);
    if (!parsed.success) return fail(parsed.error.message);
    const slug = assertBlogSlug(parsed.data.slug);
    const markdown = await readGithubFile(`content/blog/${slug}.md`);
    if (!markdown) throw new Error(`No post found for ${slug}.`);
    return markdown;
  }
  if (name === "publish_blog_post") {
    const parsed = publishArgsSchema.safeParse(args);
    if (!parsed.success) return fail(parsed.error.message);
    const published = await publishValidatedMarkdown({
      markdown: parsed.data.markdown,
      mode: parsed.data.mode ?? "create",
      followUps: parsed.data.followUps,
      topicId: parsed.data.topicId,
    });
    if (!published.ok) {
      throw new Error(
        `Publish failed:\n${published.errors.map((error) => `- ${error}`).join("\n")}`
      );
    }
    return JSON.stringify(published.result, null, 2);
  }
  if (name === "delete_blog_post") {
    const parsed = deletePostArgsSchema.safeParse(args);
    if (!parsed.success) return fail("Pass slug and confirm: true.");
    const result = await deleteBlogPost(parsed.data);
    return JSON.stringify({ ...result, note: "Vercel may take 1–2 minutes." }, null, 2);
  }
  if (name === "list_post_images") {
    const parsed = slugArgsSchema.safeParse(args);
    if (!parsed.success) return fail(parsed.error.message);
    const images = await listPostImages(parsed.data.slug);
    return JSON.stringify({ slug: parsed.data.slug, images }, null, 2);
  }
  if (name === "upload_blog_image") {
    const parsed = uploadArgsSchema.safeParse(args);
    if (!parsed.success) return fail(parsed.error.message);
    const result = await uploadBlogImage(parsed.data);
    return JSON.stringify(
      {
        ...result,
        markdown: `![${parsed.data.alt ?? "Photograph"}](${result.path})`,
        note: result.heroUpdated
          ? "Hero updated. Vercel may take 1–2 minutes."
          : `Insert the markdown image tag in the body, or call set_post_hero with path ${result.path}.`,
      },
      null,
      2
    );
  }
  if (name === "set_post_hero") {
    const parsed = setHeroArgsSchema.safeParse(args);
    if (!parsed.success) return fail(parsed.error.message);
    const result = await setPostHero(parsed.data);
    return JSON.stringify(
      { ...result, live: `${PRODUCTION_SITE_URL}/blog/${parsed.data.slug}` },
      null,
      2
    );
  }
  if (name === "delete_blog_image") {
    const parsed = deleteImageArgsSchema.safeParse(args);
    if (!parsed.success) return fail("Pass slug, filename, and confirm: true.");
    const result = await deleteBlogImage(parsed.data);
    return JSON.stringify(result, null, 2);
  }
  throw new Error(`Unknown tool: ${name}`);
}

function fail(message: string): never {
  throw new Error(message);
}
