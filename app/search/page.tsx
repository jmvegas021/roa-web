import type { Metadata } from "next";
import Link from "next/link";
import { IdxHostedSearch } from "@/components/idx/IdxHostedSearch";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { ButtonLink, SectionHeading } from "@/components/ui/SectionPrimitives";
import { getPublicIdxConfig } from "@/lib/idx/public-config";
import {
  IDX_CITY_MARKETS,
  buildIdxResultsEmbedUrl,
  buildOnSiteSearchPath,
  parseIdxSearchQuery,
} from "@/lib/idx/search-urls";
import { SITE } from "@/lib/content/team";
import { SearchRefineForm } from "@/components/search/SearchRefineForm";

export const metadata: Metadata = {
  title: "MLS Search — Salado, Belton, Temple & Georgetown Homes",
  description:
    "Search Salado, Belton, Temple, Georgetown, and Central Texas MLS inventory — Office of Kevin Shoun, Realty of America.",
  alternates: { canonical: "/search" },
};

interface SearchPageProps {
  searchParams: Promise<{ q?: string | string[] }>;
}

function firstParam(value: string | string[] | undefined): string {
  if (Array.isArray(value)) return value[0]?.trim() ?? "";
  return value?.trim() ?? "";
}

/**
 * On-site MLS search. Browser stays on this domain; IDX results/map load in
 * an embedded frame using city IDs (name-based csv_city filters return 0).
 */
export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const query = firstParam(params.q);
  const { subdomain } = getPublicIdxConfig();
  const parsed = parseIdxSearchQuery(query);
  const embedUrl = subdomain
    ? buildIdxResultsEmbedUrl(subdomain, parsed)
    : null;

  const title =
    parsed.kind === "map" ? "Explore the market" : parsed.summary;

  return (
    <div className="pt-28 lg:pt-32">
      <section className="px-6 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <Breadcrumbs
            items={[{ name: "MLS Search", path: "/search" }]}
            className="mb-8"
          />
          <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <SectionHeading
              as="h1"
              eyebrow="MLS search"
              title={title}
              description={
                parsed.kind === "map"
                  ? "Live Central Texas inventory from participating MLSs. Search by city or address above, or browse the map."
                  : "Results stay on this site. Refine your search below, or pick a market to explore."
              }
            />
            <div className="flex shrink-0 flex-wrap gap-3 pb-1">
              <ButtonLink href="/listings" variant="ghost">
                Featured collection
              </ButtonLink>
              <ButtonLink href="/contact" variant="ghost">
                Work with Kevin
              </ButtonLink>
            </div>
          </div>

          <div className="mt-10 max-w-2xl">
            <SearchRefineForm key={query || "map"} initialQuery={query} />
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2">
            <span className="text-[0.65rem] uppercase tracking-[0.2em] text-stone-400">
              Markets
            </span>
            {IDX_CITY_MARKETS.slice(0, 5).map((city) => (
              <Link
                key={city.cityId}
                href={buildOnSiteSearchPath(city.label)}
                className={`text-sm transition duration-200 hover:text-gold ${
                  parsed.city?.cityId === city.cityId
                    ? "text-gold"
                    : "text-stone-300"
                }`}
              >
                {city.label}
              </Link>
            ))}
            <Link
              href="/search"
              className="text-sm text-stone-400 transition duration-200 hover:text-gold"
            >
              Map search
            </Link>
          </div>

          {query ? (
            <p className="mt-6 max-w-2xl border-l border-gold/40 pl-4 text-sm leading-relaxed text-stone-400">
              Searching for <span className="text-stone-50">{query}</span>
              {parsed.address && parsed.address !== query ? (
                <>
                  {" "}
                  — matching street{" "}
                  <span className="text-stone-50">“{parsed.address}”</span>
                  {parsed.city ? ` in ${parsed.city.label}` : ""}.
                </>
              ) : (
                "."
              )}
            </p>
          ) : null}
        </div>
      </section>

      <section className="mt-10 px-6 pb-6 lg:px-10">
        <div className="mx-auto max-w-7xl">
          {embedUrl ? (
            <IdxHostedSearch
              src={embedUrl}
              title={
                parsed.kind === "map"
                  ? "MLS map search"
                  : "MLS search results"
              }
              className="border border-stone-800"
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
        <p className="mx-auto max-w-7xl text-xs leading-relaxed text-stone-400">
          Listing data is provided by IDX Broker and participating MLSs on behalf
          of {SITE.brand}. Information is deemed reliable but not guaranteed and
          should be independently verified. © {new Date().getFullYear()}{" "}
          {SITE.brand}.
        </p>
      </section>
    </div>
  );
}
