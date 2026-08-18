import type { MetadataRoute } from "next";
import { loadPostSummaries } from "@/lib/blog/load-posts";
import { NEIGHBORHOOD_GUIDES } from "@/lib/content/neighborhood-guides";
import { listingsManager } from "@/lib/idx/listings-service";
import { TEAM } from "@/lib/content/team";
import { getSiteUrl } from "@/lib/site/siteUrl";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getSiteUrl();
  const now = new Date();
  const { listings } = await listingsManager.getFeatured(50);

  return [
    ...buildStaticRoutes(base, now),
    ...buildNeighborhoodRoutes(base, now),
    ...listings.map((listing) => ({
      url: `${base}/listings/${listing.id}`,
      lastModified: now,
      changeFrequency: "daily" as const,
      priority: 0.8,
    })),
    ...buildAgentRoutes(base, now),
    ...buildBlogRoutes(base),
  ];
}

function buildStaticRoutes(base: string, now: Date): MetadataRoute.Sitemap {
  return [
    "",
    "/listings",
    "/search",
    "/agents",
    "/agents/kevin-shoun",
    "/neighborhoods",
    "/blog",
    "/about",
    "/contact",
  ].map((path) => ({
    url: `${base}${path || "/"}`,
    lastModified: now,
    changeFrequency: path === "" || path === "/listings" ? "daily" : "weekly",
    priority: getStaticPriority(path),
  }));
}

function buildNeighborhoodRoutes(
  base: string,
  now: Date
): MetadataRoute.Sitemap {
  return NEIGHBORHOOD_GUIDES.map(({ slug }) => ({
    url: `${base}/neighborhoods/${slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.8,
  }));
}

function buildAgentRoutes(base: string, now: Date): MetadataRoute.Sitemap {
  return TEAM.filter(
    (agent) => agent.slug !== "kevin-shoun"
  ).map((agent) => ({
    url: `${base}/agents/${agent.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.6,
  }));
}

function buildBlogRoutes(base: string): MetadataRoute.Sitemap {
  return loadPostSummaries().map((post) => ({
    url: `${base}/blog/${post.slug}`,
    lastModified: new Date(post.updatedAt ?? post.publishedAt),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));
}

function getStaticPriority(path: string): number {
  if (path === "") return 1;
  if (path === "/listings" || path === "/search") return 0.9;
  return 0.7;
}
