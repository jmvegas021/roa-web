import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ListingDetail } from "@/components/listings/ListingDetail";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { listingsManager } from "@/lib/idx/listings-service";
import { buildListingSchema } from "@/lib/seo/structuredData";

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
  const title = `${listing.address}, ${listing.city}, ${listing.state}`;
  const description =
    listing.description.slice(0, 155).trim() ||
    `${listing.bedrooms} bed, ${listing.bathrooms} bath home in ${listing.city}, ${listing.state}.`;

  return {
    title,
    description,
    alternates: { canonical: `/listings/${listing.id}` },
    openGraph: {
      title,
      description,
      url: `/listings/${listing.id}`,
      type: "article",
      images: listing.imageUrl ? [{ url: listing.imageUrl }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: listing.imageUrl ? [listing.imageUrl] : [],
    },
  };
}

export default async function ListingDetailPage({ params }: PageProps) {
  const { id } = await params;
  const listing = await listingsManager.getById(id);

  if (!listing) {
    notFound();
  }

  const crumbs = [
    { name: "Listings", path: "/listings" },
    {
      name: listing.address,
      path: `/listings/${listing.id}`,
    },
  ];

  return (
    <div className="overflow-x-hidden pt-24 lg:pt-28">
      <JsonLd data={buildListingSchema(listing)} />
      <div className="mx-auto max-w-7xl space-y-6 px-6 lg:px-10">
        <Link
          href="/listings"
          className="text-xs uppercase tracking-[0.18em] text-stone-400 hover:text-gold"
        >
          ← All featured listings
        </Link>
        <Breadcrumbs items={crumbs} />
      </div>
      <ListingDetail listing={listing} />
    </div>
  );
}
