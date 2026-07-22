import Link from "next/link";
import { ListingGrid } from "@/components/listings/ListingGrid";
import { RevealOnScroll } from "@/components/motion/RevealOnScroll";
import { SectionHeading, ButtonLink } from "@/components/ui/SectionPrimitives";
import type { LuxuryListing } from "@/lib/idx/types";

interface FeaturedListingsProps {
  listings: LuxuryListing[];
  source: "idx" | "mock";
}

export function FeaturedListings({ listings, source }: FeaturedListingsProps) {
  return (
    <section className="bg-stone-950 px-6 py-24 lg:px-10 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <RevealOnScroll>
          <div className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
            <SectionHeading
              eyebrow="Featured"
              title="A private collection, quietly curated."
              description="Homes represented by the Office of Kevin Shoun — refined residences across Central Texas, presented without the noise."
            />
            <ButtonLink
              href="/listings"
              variant="ghost"
              className="self-start md:self-auto"
            >
              Full collection
            </ButtonLink>
          </div>
        </RevealOnScroll>

        <RevealOnScroll delayMs={100} className="mt-16">
          <ListingGrid listings={listings.slice(0, 3)} />
        </RevealOnScroll>

        {source === "mock" ? (
          <p className="mt-10 text-xs leading-relaxed text-stone-400">
            Showing sample inventory. Connect IDX credentials to load live
            featured listings.{" "}
            <Link
              href="/search"
              className="cursor-pointer text-gold transition duration-200 hover:underline"
            >
              Search the full MLS
            </Link>
          </p>
        ) : null}
      </div>
    </section>
  );
}
