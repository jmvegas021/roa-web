import Image from "next/image";
import Link from "next/link";
import { formatPrice, formatSqft } from "@/lib/idx/mappers";
import type { LuxuryListing } from "@/lib/idx/types";

interface ListingCardProps {
  listing: LuxuryListing;
}

function softStatusLabel(status: string): string {
  const normalized = status.trim().toLowerCase();
  if (normalized.includes("pending") || normalized.includes("under contract")) {
    return "Under contract";
  }
  if (normalized.includes("sold") || normalized.includes("closed")) {
    return "Recently represented";
  }
  if (normalized.includes("new")) {
    return "New offering";
  }
  if (normalized === "active" || normalized === "for sale") {
    return "Available";
  }
  return status;
}

export function ListingCard({ listing }: ListingCardProps) {
  const label = softStatusLabel(listing.status);

  return (
    <article className="group">
      <Link
        href={`/listings/${listing.id}`}
        className="block cursor-pointer focus-visible:outline-offset-4"
      >
        <div className="relative aspect-[4/3] overflow-hidden bg-stone-800">
          <Image
            src={listing.imageUrl}
            alt={`${listing.address}, ${listing.city}`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition duration-[650ms] ease-out group-hover:scale-[1.04] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950/50 via-transparent to-transparent opacity-80 transition duration-200 group-hover:opacity-100" />
          <span className="absolute left-4 top-4 border border-gold/35 bg-stone-950/35 px-3 py-1.5 text-[0.65rem] uppercase tracking-[0.18em] text-stone-50 backdrop-blur-[2px]">
            {label}
          </span>
        </div>
        <div className="mt-6 space-y-2">
          <p className="font-display text-2xl tracking-tight text-gold md:text-[1.75rem]">
            {formatPrice(listing.price)}
          </p>
          <h3 className="text-lg leading-snug text-stone-50 transition duration-200 group-hover:text-gold">
            {listing.address}
          </h3>
          <p className="text-sm text-stone-400">
            {listing.city}, {listing.state}
          </p>
          <p className="text-sm text-stone-400">
            {listing.bedrooms} bd · {listing.bathrooms} ba ·{" "}
            {formatSqft(listing.sqft)}
          </p>
        </div>
      </Link>
    </article>
  );
}
