import { blogDateMs } from "@/lib/blog/format-date";
import { loadPostSummaries } from "@/lib/blog/load-posts";
import type { BlogCategory, BlogPostSummary } from "@/lib/blog/types";
import { COOLDOWN_DAYS } from "./constants";
import { loadClusterFile } from "./cluster-store";
import type { ClusterTopic } from "./types";

export function hasRecentPublish(
  posts: BlogPostSummary[] = loadPostSummaries(),
  nowMs = Date.now(),
  cooldownDays = COOLDOWN_DAYS
): boolean {
  const cutoff = nowMs - cooldownDays * 86_400_000;
  return posts.some((post) => blogDateMs(post.publishedAt) >= cutoff);
}

export function selectNextTopic(
  posts: BlogPostSummary[] = loadPostSummaries(),
  topics: ClusterTopic[] = loadClusterFile().topics,
  extraSlugs: Iterable<string> = []
): ClusterTopic | null {
  const publishedSlugs = new Set([
    ...posts.map((post) => post.slug),
    ...extraSlugs,
  ]);
  const queued = topics.filter(
    (topic) =>
      topic.status === "queued" &&
      !publishedSlugs.has(topic.id) &&
      (!topic.publishedSlug || !publishedSlugs.has(topic.publishedSlug))
  );
  if (queued.length === 0) return null;

  const scored = queued
    .map((topic) => ({ topic, score: scoreTopic(topic, posts) }))
    .sort((a, b) => b.score - a.score || a.topic.id.localeCompare(b.topic.id));

  return scored[0]?.topic ?? null;
}

function scoreTopic(topic: ClusterTopic, posts: BlogPostSummary[]): number {
  let score = 10;
  const categoryCounts = countCategories(posts);
  const counts = Object.values(categoryCounts);
  const minCount = counts.length ? Math.min(...counts) : 0;
  if ((categoryCounts[topic.category] ?? 0) === minCount) score += 8;
  if (
    (topic.category === "market" || topic.category === "relocation") &&
    (categoryCounts[topic.category] ?? 0) === 0
  ) {
    score += 12;
  }

  const recentPlaces = posts.slice(0, 2).flatMap((post) => post.tags);
  if (recentPlaces.includes(topic.place)) score -= 10;

  const placesWithPosts = new Set(posts.flatMap((post) => post.tags));
  if (placesWithPosts.has(topic.place)) score += 3;
  else score += 6;

  return score;
}

function countCategories(
  posts: BlogPostSummary[]
): Record<BlogCategory, number> {
  const counts: Record<BlogCategory, number> = {
    guides: 0,
    neighborhoods: 0,
    market: 0,
    relocation: 0,
  };
  for (const post of posts) counts[post.category] += 1;
  return counts;
}
