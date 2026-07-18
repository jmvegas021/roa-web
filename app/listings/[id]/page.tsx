import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ListingDetail } from "@/components/listings/ListingDetail";
import { listingsManager } from "@/lib/idx/listings-service";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  const { listings } = await listingsManager.getFeatured(50);
  return listings.map((listing) => ({ id: listing.id }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const listing = await listingsManager.getById(id);
  if (!listing) {
    return { title: "Listing not found" };
  }
  return {
    title: `${listing.address}, ${listing.city}`,
    description: listing.description.slice(0, 160),
    openGraph: {
      images: listing.imageUrl ? [{ url: listing.imageUrl }] : [],
    },
  };
}

export default async function ListingDetailPage({ params }: PageProps) {
  const { id } = await params;
  const listing = await listingsManager.getById(id);

  if (!listing) {
    notFound();
  }

  return (
    <div className="pt-24 lg:pt-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <Link
          href="/listings"
          className="text-xs uppercase tracking-[0.18em] text-stone-400 hover:text-gold"
        >
          ← All featured listings
        </Link>
      </div>
      <ListingDetail listing={listing} />
    </div>
  );
}
