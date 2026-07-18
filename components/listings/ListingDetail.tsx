import Link from "next/link";
import { ListingGallery } from "./ListingGallery";
import { ContactForm } from "@/components/forms/ContactForm";
import { formatPrice, formatSqft } from "@/lib/idx/mappers";
import type { LuxuryListing } from "@/lib/idx/types";

interface ListingDetailProps {
  listing: LuxuryListing;
}

export function ListingDetail({ listing }: ListingDetailProps) {
  return (
    <article className="mx-auto max-w-7xl px-6 py-16 lg:px-10 lg:py-24">
      <p className="text-xs uppercase tracking-[0.22em] text-gold">
        {listing.status} · Featured listing
      </p>
      <h1 className="font-display mt-4 text-4xl text-stone-50 md:text-5xl">
        {listing.address}
      </h1>
      <p className="mt-2 text-lg text-stone-400">
        {listing.city}, {listing.state} {listing.zip}
      </p>
      <p className="font-display mt-6 text-3xl text-gold md:text-4xl">
        {formatPrice(listing.price)}
      </p>

      <div className="mt-10 grid gap-12 lg:grid-cols-[1.4fr_0.8fr]">
        <div>
          <ListingGallery
            images={listing.gallery}
            alt={`${listing.address}, ${listing.city}`}
          />
          <dl className="mt-8 grid grid-cols-3 gap-4 border-y border-stone-800 py-6 text-center">
            <div>
              <dt className="text-xs uppercase tracking-[0.16em] text-stone-400">
                Beds
              </dt>
              <dd className="mt-2 text-xl text-stone-50">{listing.bedrooms}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-[0.16em] text-stone-400">
                Baths
              </dt>
              <dd className="mt-2 text-xl text-stone-50">{listing.bathrooms}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-[0.16em] text-stone-400">
                Size
              </dt>
              <dd className="mt-2 text-xl text-stone-50">
                {formatSqft(listing.sqft)}
              </dd>
            </div>
          </dl>
          <div className="prose-luxury mt-8">
            <h2 className="font-display text-2xl text-stone-50">About this home</h2>
            <p className="mt-4">{listing.description}</p>
            {listing.agentName ? (
              <p className="mt-4 text-sm">Listed by {listing.agentName}</p>
            ) : null}
            {listing.idxDetailUrl ? (
              <p className="mt-6">
                <Link
                  href={listing.idxDetailUrl}
                  className="text-gold hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View full MLS details
                </Link>
              </p>
            ) : (
              <p className="mt-6">
                <Link href="/search" className="text-gold hover:underline">
                  Search related MLS inventory
                </Link>
              </p>
            )}
          </div>
        </div>

        <aside className="border border-stone-800 bg-stone-900 p-6 lg:p-8">
          <h2 className="font-display text-2xl text-stone-50">Request details</h2>
          <p className="mt-2 text-sm text-stone-400">
            Inquire privately about this property. Your message reaches the Office
            of Kevin Shoun.
          </p>
          <div className="mt-6">
            <ContactForm
              listingId={listing.listingId}
              propertyAddress={`${listing.address}, ${listing.city}`}
              submitLabel="Request information"
            />
          </div>
        </aside>
      </div>
    </article>
  );
}
