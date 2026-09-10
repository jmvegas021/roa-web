import { PRODUCTION_SITE_URL } from "@/lib/site/siteUrl";
import {
  blogMarkdownPath,
  commitAllowlistedFiles,
  listGithubContents,
  readGithubFile,
} from "./commit-post";
import { PLACE_HEROES } from "./constants";
import { fetchPublicImage } from "./fetch-public-image";
import {
  assertBlogSlug,
  decodeImageData,
  detectImageExtension,
  extensionForMediaType,
  gitBlogImageDir,
  gitBlogImagePath,
  isSiteImagePath,
  matchingImageFilename,
  publicBlogImagePath,
  sanitizeImageFilename,
} from "./image-paths";
import { patchFrontmatter } from "./patch-frontmatter";
import { todayCentralIso } from "./publish-markdown";
import { validatePost } from "./validate-post";
import type { GithubRepoFile } from "./types";

export async function listPostImages(slug: string) {
  const safeSlug = assertBlogSlug(slug);
  const entries = await listGithubContents(gitBlogImageDir(safeSlug));
  return entries
    .filter((entry) => entry.type === "file" && /\.(webp|jpg|jpeg|png)$/i.test(entry.name))
    .map((entry) => ({
      filename: entry.name,
      gitPath: entry.path,
      path: `/${entry.path.replace(/^public\//, "")}`,
    }));
}

export async function uploadBlogImage(input: {
  slug: string;
  data?: string;
  imageUrl?: string;
  mediaType?: string;
  filename?: string;
  alt?: string;
  setAsHero?: boolean;
}): Promise<{ path: string; gitPath: string; sha: string; files: string[]; heroUpdated: boolean }> {
  const slug = assertBlogSlug(input.slug);
  const buffer = input.imageUrl
    ? await fetchPublicImage(input.imageUrl)
    : decodeImageData(input.data ?? "");
  const detected = detectImageExtension(buffer);
  if (input.mediaType) {
    const declared = extensionForMediaType(input.mediaType);
    if (declared !== detected) {
      throw new Error(`mediaType ${input.mediaType} does not match the file bytes (${detected}).`);
    }
  }
  const filename = matchingImageFilename(
    input.filename
      ? sanitizeImageFilename(input.filename)
      : input.setAsHero
        ? `hero.${detected}`
        : `image.${detected}`,
    detected
  );

  const gitPath = gitBlogImagePath(slug, filename);
  const publicPath = publicBlogImagePath(slug, filename);
  const files: GithubRepoFile[] = [
    { path: gitPath, content: buffer.toString("base64"), encoding: "base64" },
  ];

  let heroUpdated = false;
  if (input.setAsHero) {
    if (!input.alt || input.alt.trim().length < 8) {
      throw new Error("setAsHero requires alt text of at least 8 characters describing the photo.");
    }
    const markdown = await readGithubFile(blogMarkdownPath(slug));
    if (!markdown) {
      throw new Error(
        `No Markdown for ${slug} yet. Publish the post first, or upload without setAsHero and set heroImage to ${publicPath}.`
      );
    }
    files.push({
      path: blogMarkdownPath(slug),
      content: patchedHeroMarkdown(markdown, slug, publicPath, input.alt.trim()),
    });
    heroUpdated = true;
  }

  const committed = await commitAllowlistedFiles(
    files,
    input.setAsHero
      ? `Update blog hero: ${slug}.`
      : `Add blog image: ${slug}/${filename}.`
  );
  return { path: publicPath, gitPath, sha: committed.sha, files: committed.files, heroUpdated };
}

export async function setPostHero(input: {
  slug: string;
  path: string;
  alt: string;
}): Promise<{ canonicalUrl: string; path: string; sha: string }> {
  const slug = assertBlogSlug(input.slug);
  const path = input.path.trim();
  if (!isSiteImagePath(path)) {
    throw new Error("Hero path must be an existing /images/neighborhoods/… or /images/blog/… asset.");
  }
  if (input.alt.trim().length < 8) {
    throw new Error("heroAlt must be at least 8 characters and describe the photo.");
  }
  const markdown = await readGithubFile(blogMarkdownPath(slug));
  if (!markdown) throw new Error(`No post found for ${slug}.`);
  const next = patchedHeroMarkdown(markdown, slug, path, input.alt.trim());
  const committed = await commitAllowlistedFiles(
    [{ path: blogMarkdownPath(slug), content: next }],
    `Update blog hero: ${slug}.`
  );
  return {
    canonicalUrl: `${PRODUCTION_SITE_URL}/blog/${slug}`,
    path,
    sha: committed.sha,
  };
}

export async function deleteBlogImage(input: {
  slug: string;
  filename: string;
  confirm: boolean;
}): Promise<{ deleted: string; sha: string; heroFallback?: string }> {
  if (input.confirm !== true) throw new Error("Pass confirm: true to delete an image.");
  const slug = assertBlogSlug(input.slug);
  const filename = sanitizeImageFilename(input.filename);
  const gitPath = gitBlogImagePath(slug, filename);
  const publicPath = publicBlogImagePath(slug, filename);
  const files: GithubRepoFile[] = [{ path: gitPath, delete: true }];

  let heroFallback: string | undefined;
  const markdown = await readGithubFile(blogMarkdownPath(slug));
  if (markdown?.includes(publicPath)) {
    const fallback = PLACE_HEROES.salado;
    files.push({
      path: blogMarkdownPath(slug),
      content: patchedHeroMarkdown(markdown, slug, fallback.image, fallback.alt),
    });
    heroFallback = fallback.image;
  }

  const committed = await commitAllowlistedFiles(
    files,
    `Remove blog image: ${slug}/${filename}.`
  );
  return { deleted: publicPath, sha: committed.sha, heroFallback };
}

export async function deleteBlogPost(input: {
  slug: string;
  confirm: boolean;
}): Promise<{ slug: string; sha: string; files: string[] }> {
  if (input.confirm !== true) throw new Error("Pass confirm: true to delete a post.");
  const slug = assertBlogSlug(input.slug);
  const markdownPath = blogMarkdownPath(slug);
  const markdown = await readGithubFile(markdownPath);
  if (!markdown) throw new Error(`No post found for ${slug}.`);

  const images = await listPostImages(slug);
  const files: GithubRepoFile[] = [
    { path: markdownPath, delete: true },
    ...images.map((image) => ({ path: image.gitPath, delete: true })),
  ];
  const committed = await commitAllowlistedFiles(files, `Delete blog post: ${slug}.`);
  return { slug, sha: committed.sha, files: committed.files };
}

function patchedHeroMarkdown(
  markdown: string,
  slug: string,
  heroImage: string,
  heroAlt: string
): string {
  const next = patchFrontmatter(markdown, {
    heroImage,
    heroAlt,
    updatedAt: todayCentralIso(),
  });
  const validated = validatePost(next, {
    mode: "edit",
    existingSlugs: new Set([slug]),
    today: todayCentralIso(),
  });
  if (!validated.ok) {
    throw new Error(validated.errors.join(" "));
  }
  return validated.markdown;
}
