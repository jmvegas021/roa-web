import type { Metadata } from "next";
import { ListingGrid } from "@/components/listings/ListingGrid";
import { SectionHeading, ButtonLink } from "@/components/ui/SectionPrimitives";
import { listingsManager } from "@/lib/idx/listings-service";

export const metadata: Metadata = {
  title: "Featured Listings",
  description:
    "Featured luxury inventory from the Office of Kevin Shoun — Realty of America, Central Texas.",
};

export const revalidate = 300;

export default async function ListingsPage() {
  const { listings, source } = await listingsManager.getFeatured(24);

  return (
    <div className="pt-32 lg:pt-36">
      <section className="px-6 pb-12 lg:px-10">
        <div className="mx-auto flex max-w-7xl flex-col gap-10 md:flex-row md:items-end md:justify-between">
          <SectionHeading
            eyebrow="Collection"
            title="Featured listings"
            description="Homes represented by our Central Texas office. For the complete MLS, use search."
          />
          <ButtonLink href="/search" variant="ghost">
            Search MLS
          </ButtonLink>
        </div>
      </section>
      <section className="px-6 pb-24 lg:px-10 lg:pb-32">
        <div className="mx-auto max-w-7xl">
          <ListingGrid listings={listings} />
          {source === "mock" ? (
            <p className="mt-10 text-xs text-stone-400">
              Sample listings shown. Set IDX_API_KEY to load live featured inventory.
            </p>
          ) : null}
        </div>
      </section>
    </div>
  );
}
