import type { NextConfig } from "next";

/**
 * Static site under https://www.dudewheresmyweb.site/kevin
 *
 * - output: 'export' → HTML/CSS/JS only (no Node server / SPA fallback)
 * - basePath → all routes & assets prefixed with /kevin
 * - trailingSlash → /kevin/listings/ maps to listings/index.html on Apache
 */
const nextConfig: NextConfig = {
  output: "export",
  basePath: "/kevin",
  trailingSlash: true,
  images: {
    unoptimized: true,
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
    ],
  },
};

export default nextConfig;
