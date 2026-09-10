import type { NextConfig } from "next";

/**
 * Default: full Next.js App Router on Vercel (SSR, Server Actions, Image Optimization).
 *
 * Optional Apache static export for /kevin:
 *   npm run build:static
 */
const isStaticExport = process.env.STATIC_EXPORT === "1";

const blogMarkdown = ["./content/blog/**/*"];

const nextConfig: NextConfig = {
  ...(isStaticExport
    ? {
        output: "export" as const,
        basePath: "/kevin",
        trailingSlash: true,
      }
    : {
        async redirects() {
          return [
            {
              source: "/:path*",
              has: [{ type: "host" as const, value: "kevinshoun.com" }],
              destination: "https://www.kevinshoun.com/:path*",
              permanent: true,
            },
          ];
        },
        async rewrites() {
          return [
            {
              source: "/api/blog/mcp/:key",
              destination: "/api/blog/mcp?key=:key",
            },
          ];
        },
      }),
  outputFileTracingIncludes: {
    "/blog": blogMarkdown,
    "/blog/[slug]": blogMarkdown,
    "/blog/rss.xml": blogMarkdown,
    "/blog/feed.json": blogMarkdown,
    "/sitemap.xml": blogMarkdown,
    "/api/blog/publish": [
      "./content/blog/**/*",
      "./content/editorial/**/*",
    ],
    "/api/blog/mcp": ["./content/blog/**/*", "./content/editorial/**/*"],
  },
  images: {
    unoptimized: isStaticExport,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.idxbroker.com",
      },
      {
        protocol: "https",
        hostname: "**.idx.realty.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "cdn.idxbroker.com",
      },
      {
        protocol: "https",
        hostname: "mlsphotos.idxbroker.com",
      },
      {
        protocol: "https",
        hostname: "api.cotality.com",
      },
      {
        protocol: "https",
        hostname: "**.cotality.com",
      },
    ],
  },
};

export default nextConfig;
