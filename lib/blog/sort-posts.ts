import { blogDateMs } from "./format-date";
import type { BlogSort } from "./constants";
import type { BlogPostSummary } from "./types";

export function sortByPublishedDesc<T extends { publishedAt: string }>(
  posts: T[]
): T[] {
  return [...posts].sort(
    (a, b) => blogDateMs(b.publishedAt) - blogDateMs(a.publishedAt)
  );
}

export function sortPosts(
  posts: BlogPostSummary[],
  sort: BlogSort,
  query = ""
): BlogPostSummary[] {
  if (sort === "relevant") return sortRelevant(posts, query);
  if (sort === "hottest") return sortHottest(posts);
  return sortByPublishedDesc(posts);
}

function sortRelevant(
  posts: BlogPostSummary[],
  query: string
): BlogPostSummary[] {
  const tokens = tokenize(query);
  return [...posts].sort((a, b) => {
    const featuredDelta = Number(b.featured) - Number(a.featured);
    if (featuredDelta) return featuredDelta;
    const matchDelta = relevanceScore(b, tokens) - relevanceScore(a, tokens);
    if (matchDelta) return matchDelta;
    return blogDateMs(b.publishedAt) - blogDateMs(a.publishedAt);
  });
}

function sortHottest(posts: BlogPostSummary[]): BlogPostSummary[] {
  return [...posts].sort((a, b) => heatScore(b) - heatScore(a));
}

function heatScore(post: BlogPostSummary): number {
  const featuredBoost = post.featured ? 8 : 0;
  const ageDays = (Date.now() - blogDateMs(post.publishedAt)) / 86_400_000;
  const recency = Math.max(0, 10 - ageDays / 14);
  return featuredBoost + post.priority + recency;
}

function relevanceScore(post: BlogPostSummary, tokens: string[]): number {
  if (!tokens.length) return 0;
  const haystack = [
    post.title,
    post.description,
    post.category,
    post.tags.join(" "),
    post.excerpt,
  ]
    .join(" ")
    .toLowerCase();
  return tokens.reduce(
    (score, token) => score + (haystack.includes(token) ? 1 : 0),
    0
  );
}

function tokenize(query: string): string[] {
  return query
    .toLowerCase()
    .split(/\s+/)
    .filter((token) => token.length > 1);
}
