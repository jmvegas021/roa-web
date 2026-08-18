import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site/siteUrl";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  const base = getSiteUrl();
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/wrapper", "/api/"],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
