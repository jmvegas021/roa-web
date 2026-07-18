import type { NextConfig } from "next";

/**
 * Default: full Next.js App Router on Vercel (SSR, Server Actions, Image Optimization).
 *
 * Optional Apache static export for /kevin:
 *   npm run build:static
 */
const isStaticExport = process.env.STATIC_EXPORT === "1";

const nextConfig: NextConfig = {
  ...(isStaticExport
    ? {
        output: "export" as const,
        basePath: "/kevin",
        trailingSlash: true,
      }
    : {}),
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
