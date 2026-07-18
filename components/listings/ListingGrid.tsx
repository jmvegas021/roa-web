import { ListingCard } from "./ListingCard";
import type { LuxuryListing } from "@/lib/idx/types";

interface ListingGridProps {
  listings: LuxuryListing[];
}

export function ListingGrid({ listings }: ListingGridProps) {
  if (listings.length === 0) {
    return (
      <p className="text-stone-400" role="status">
        No featured listings available at the moment. Please try MLS search.
      </p>
    );
  }

  return (
    <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-12">
      {listings.map((listing) => (
        <ListingCard key={listing.id} listing={listing} />
      ))}
    </div>
  );
}
