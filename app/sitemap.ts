import type { MetadataRoute } from "next";
import { loadPostSummaries } from "@/lib/blog/load-posts";
import { listingsManager } from "@/lib/idx/listings-service";
import { TEAM } from "@/lib/content/team";
import { getSiteUrl } from "@/lib/site/siteUrl";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getSiteUrl();
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
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
    priority: path === "" ? 1 : path === "/listings" || path === "/search" ? 0.9 : 0.7,
  }));

  const { listings } = await listingsManager.getFeatured(50);
  const listingRoutes: MetadataRoute.Sitemap = listings.map((listing) => ({
    url: `${base}/listings/${listing.id}`,
    lastModified: now,
    changeFrequency: "daily",
    priority: 0.8,
  }));

  const agentRoutes: MetadataRoute.Sitemap = TEAM.filter(
    (agent) => agent.slug !== "kevin-shoun"
  ).map((agent) => ({
    url: `${base}/agents/${agent.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const blogRoutes: MetadataRoute.Sitemap = loadPostSummaries().map(
    (post) => ({
      url: `${base}/blog/${post.slug}`,
      lastModified: new Date(post.updatedAt ?? post.publishedAt),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })
  );

  return [...staticRoutes, ...listingRoutes, ...agentRoutes, ...blogRoutes];
}
