import { POSTS_PER_PAGE } from "./constants";
import type { BlogPostSummary } from "./types";

export function filterPostsByQuery(
  posts: BlogPostSummary[],
  query: string
): BlogPostSummary[] {
  const needle = query.trim().toLowerCase();
  if (!needle) return posts;
  return posts.filter((post) => matchesQuery(post, needle));
}

function matchesQuery(post: BlogPostSummary, needle: string): boolean {
  const haystack = [
    post.title,
    post.description,
    post.excerpt,
    post.category,
    post.tags.join(" "),
    post.keywords.join(" "),
  ]
    .join(" ")
    .toLowerCase();
  return haystack.includes(needle);
}

export interface PaginatedPosts {
  items: BlogPostSummary[];
  page: number;
  totalPages: number;
  total: number;
}

export function paginatePosts(
  posts: BlogPostSummary[],
  page: number
): PaginatedPosts {
  const total = posts.length;
  const totalPages = Math.max(1, Math.ceil(total / POSTS_PER_PAGE));
  const current = Math.min(Math.max(page, 1), totalPages);
  const start = (current - 1) * POSTS_PER_PAGE;
  return {
    items: posts.slice(start, start + POSTS_PER_PAGE),
    page: current,
    totalPages,
    total,
  };
}
