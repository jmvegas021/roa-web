"use client";

import Script from "next/script";
import { getPublicIdxConfig } from "@/lib/idx/public-config";

/**
 * Loads IDX Broker widget scripts when a subdomain is configured.
 */
export function IdxScript() {
  const { subdomain } = getPublicIdxConfig();
  if (!subdomain) return null;

  return (
    <Script
      id="idx-broker-widgets"
      src={`https://${subdomain}/idx/includes/js/idx.js`}
      strategy="afterInteractive"
    />
  );
}
