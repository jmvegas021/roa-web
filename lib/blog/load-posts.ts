import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { BLOG_CONTENT_DIR } from "./constants";
import { buildExcerpt } from "./excerpt";
import { parseFrontmatter } from "./frontmatter";
import { sortByPublishedDesc } from "./sort-posts";
import type { BlogPost, BlogPostSummary } from "./types";

const blogDir = path.join(process.cwd(), BLOG_CONTENT_DIR);

function listMarkdownFilenames(): string[] {
  if (!fs.existsSync(blogDir)) return [];
  return fs
    .readdirSync(blogDir)
    .filter((name) => name.endsWith(".md") && !name.startsWith("_"));
}

function readPostFile(filename: string): BlogPost | null {
  const slug = filename.replace(/\.md$/, "");
  const raw = fs.readFileSync(path.join(blogDir, filename), "utf8");
  const { data, content } = matter(raw);
  const frontmatter = parseFrontmatter(data, slug);
  if (!frontmatter) return null;

  const body = content.trim();
  return {
    ...frontmatter,
    body,
    excerpt: buildExcerpt(body),
  };
}

export function loadPublishedPosts(): BlogPost[] {
  const posts = listMarkdownFilenames()
    .map(readPostFile)
    .filter((post): post is BlogPost => post !== null);
  return sortByPublishedDesc(posts);
}

export function loadPostBySlug(slug: string): BlogPost | null {
  const filename = `${slug}.md`;
  if (!fs.existsSync(path.join(blogDir, filename))) return null;
  return readPostFile(filename);
}

export function toPostSummary(post: BlogPost): BlogPostSummary {
  return {
    title: post.title,
    description: post.description,
    slug: post.slug,
    publishedAt: post.publishedAt,
    updatedAt: post.updatedAt,
    author: post.author,
    tags: post.tags,
    category: post.category,
    featured: post.featured,
    priority: post.priority,
    heroImage: post.heroImage,
    heroAlt: post.heroAlt,
    keywords: post.keywords,
    excerpt: post.excerpt,
  };
}

export function loadPostSummaries(): BlogPostSummary[] {
  return loadPublishedPosts().map(toPostSummary);
}
