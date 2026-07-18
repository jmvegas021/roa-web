import type { Metadata } from "next";
import { IdxBrokerWidget } from "@/components/idx/IdxBrokerWidget";
import { IdxHostedSearch } from "@/components/idx/IdxHostedSearch";
import { ButtonLink, SectionHeading } from "@/components/ui/SectionPrimitives";
import { getPublicIdxConfig } from "@/lib/idx/public-config";
import { SITE } from "@/lib/content/team";

export const metadata: Metadata = {
  title: "MLS Search",
  description:
    "Search Central Texas MLS inventory with IDX Broker map search — Office of Kevin Shoun, Realty of America.",
};

/**
 * Primary MLS search: prefer in-page widget; also offer hosted IDX iframe
 * for a reliable full experience (especially on http://localhost).
 */
export default function SearchPage() {
  const { subdomain, mapSearchId } = getPublicIdxConfig();
  const advancedSearchUrl = subdomain
    ? `https://${subdomain}/idx/search/advanced`
    : "/wrapper";
  const mapSearchUrl = subdomain
    ? `https://${subdomain}/idx/map/mapsearch`
    : advancedSearchUrl;
  const canEmbedWidget = Boolean(subdomain && mapSearchId);

  return (
    <div className="pt-28 lg:pt-32">
      <section className="px-6 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <SectionHeading
              eyebrow="MLS search"
              title="Explore the market"
              description="Live inventory from participating MLSs via IDX Broker. Search the map, filter by beds and price, then open any home for full details."
            />
            <div className="flex shrink-0 flex-wrap gap-3 pb-1">
              <ButtonLink href={advancedSearchUrl}>Advanced filters</ButtonLink>
              <ButtonLink href="/listings" variant="ghost">
                Featured collection
              </ButtonLink>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-10 px-6 pb-6 lg:px-10">
        <div className="mx-auto max-w-7xl space-y-8">
          {/* Hosted IDX map is the reliable primary experience */}
          {subdomain ? (
            <IdxHostedSearch
              src={mapSearchUrl}
              title="IDX Broker map search"
              className="border border-stone-800"
            />
          ) : canEmbedWidget ? (
            <IdxBrokerWidget
              kind="mapsearch"
              minHeightClassName="min-h-[70vh] h-[70vh] lg:min-h-[75vh] lg:h-[75vh]"
              className="border border-stone-800"
              fallbackHref={mapSearchUrl}
            />
          ) : (
            <div className="border border-dashed border-gold/30 bg-stone-950/60 p-10">
              <p className="font-display text-2xl text-stone-50">
                Configure IDX to enable MLS search
              </p>
              <p className="mt-3 max-w-lg text-sm text-stone-400">
                Set <code className="text-gold">NEXT_PUBLIC_IDX_SUBDOMAIN</code>{" "}
                in <code className="text-gold">.env.local</code> and restart the
                dev server.
              </p>
            </div>
          )}
        </div>
      </section>

      <section className="px-6 pb-24 lg:px-10 lg:pb-28">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 border-t border-stone-800 pt-10 md:flex-row md:items-start md:justify-between">
          <div className="max-w-xl">
            <p className="text-xs uppercase tracking-[0.18em] text-stone-400">
              More ways to search
            </p>
            <p className="mt-3 text-sm leading-relaxed text-stone-400">
              Use advanced IDX search for denser filters and saved searches. Listing
              details open on IDX (or inside our branded wrapper once configured
              in the IDX Control Panel).
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <ButtonLink href={advancedSearchUrl} variant="ghost">
              Advanced IDX search
            </ButtonLink>
            {subdomain ? (
              <ButtonLink href={mapSearchUrl} variant="ghost">
                Open map in new tab
              </ButtonLink>
            ) : null}
          </div>
        </div>

        <p className="mx-auto mt-12 max-w-7xl text-xs leading-relaxed text-stone-400">
          Listing data is provided by IDX Broker and participating MLSs on behalf
          of {SITE.brand}. Information is deemed reliable but not guaranteed and
          should be independently verified. © {new Date().getFullYear()}{" "}
          {SITE.brand}.
        </p>
      </section>
    </div>
  );
}
