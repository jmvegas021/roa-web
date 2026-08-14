import { absoluteUrl } from "@/lib/site/siteUrl";
import type { BlogFeedItem, BlogPostSummary } from "./types";

export function toFeedItem(post: BlogPostSummary): BlogFeedItem {
  return {
    slug: post.slug,
    title: post.title,
    url: absoluteUrl(`/blog/${post.slug}`),
    tags: post.tags,
    category: post.category,
    publishedAt: post.publishedAt,
    updatedAt: post.updatedAt ?? post.publishedAt,
    description: post.description,
  };
}
