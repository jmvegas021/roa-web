import type { Metadata } from "next";
import { getPublicIdxConfig } from "@/lib/idx/public-config";
import { SITE } from "@/lib/content/team";

export const metadata: Metadata = {
  title: "IDX Results",
  description:
    "Branded IDX Broker dynamic wrapper for MLS search results and listing details.",
  robots: { index: false, follow: true },
};

/**
 * Dynamic wrapper template for IDX-hosted pages.
 * Point IDX Control Panel → Design → Dynamic Wrapper to this URL in production.
 * IDX injects results into #idxStart / between wrapper markers.
 */
export default function WrapperPage() {
  const { subdomain, siteUrl } = getPublicIdxConfig();

  return (
    <div className="pt-28 lg:pt-32">
      <div className="mx-auto max-w-7xl px-6 pb-10 lg:px-10">
        <p className="text-xs uppercase tracking-[0.22em] text-gold">
          {SITE.brand} · MLS
        </p>
        <h1 className="font-display mt-3 text-4xl text-stone-50 md:text-5xl">
          Search results
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-stone-400">
          This page is the branded dynamic wrapper for IDX Broker. When configured
          in the IDX Control Panel, MLS results and details render below while
          keeping Realty of America chrome.
        </p>
      </div>

      {/* IDX Broker dynamic wrapper content region */}
      <div
        id="idxStart"
        className="mx-auto max-w-7xl px-6 pb-24 lg:px-10"
        data-idx-wrapper="true"
      >
        <div className="border border-dashed border-stone-700 bg-stone-900/80 p-10 text-center">
          <p className="font-display text-2xl text-stone-50">
            IDX content loads here
          </p>
          <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-stone-400">
            In production, set the Dynamic Wrapper URL to{" "}
            <code className="text-gold">{siteUrl}/wrapper</code> in IDX Control
            Panel. Subdomain:{" "}
            <code className="text-gold">
              {subdomain || "NEXT_PUBLIC_IDX_SUBDOMAIN"}
            </code>
            .
          </p>
          {subdomain ? (
            <p className="mt-6">
              <a
                href={`https://${subdomain}/idx/search/advanced`}
                className="text-xs uppercase tracking-[0.18em] text-gold hover:underline"
              >
                Open IDX advanced search →
              </a>
            </p>
          ) : null}
        </div>

        {/* Required MLS disclaimer region for compliance */}
        <div
          id="idxDisclaimer"
          className="mt-10 text-xs leading-relaxed text-stone-400"
        >
          <p>
            The data relating to real estate for sale on this website appears in
            part through the IDX Program of participating MLSs and is based in
            whole or in part on information provided by participants, of which{" "}
            {SITE.brand} may not have verified accuracy. All information provided
            is deemed reliable but is not guaranteed and should be independently
            verified.
          </p>
        </div>
      </div>
    </div>
  );
}
