import type { Metadata } from "next";
import { Hero } from "@/components/home/Hero";
import { QuickPaths } from "@/components/home/QuickPaths";
import { MeetKevin } from "@/components/home/MeetKevin";
import { FeaturedListings } from "@/components/home/FeaturedListings";
import { JourneyPaths } from "@/components/home/JourneyPaths";
import { Testimonials } from "@/components/home/Testimonials";
import { HomeValuation } from "@/components/home/HomeValuation";
import { NeighborhoodsTeaser } from "@/components/home/NeighborhoodsTeaser";
import { ContactCta } from "@/components/home/ContactCta";
import { listingsManager } from "@/lib/idx/listings-service";
import { DEFAULT_DESCRIPTION } from "@/lib/site/siteUrl";

export const revalidate = 300;

export const metadata: Metadata = {
  title: {
    absolute:
      "Kevin Shoun | Realty of America — Salado & Central Texas Realtor",
  },
  description: DEFAULT_DESCRIPTION,
  alternates: { canonical: "/" },
  openGraph: {
    title: "Kevin Shoun | Realty of America — Salado & Central Texas",
    description: DEFAULT_DESCRIPTION,
    url: "/",
  },
};

export default async function HomePage() {
  const { listings, source } = await listingsManager.getFeatured(6);

  return (
    <>
      <Hero />
      <QuickPaths />
      <MeetKevin />
      <FeaturedListings listings={listings} source={source} />
      <JourneyPaths />
      <Testimonials />
      <HomeValuation />
      <NeighborhoodsTeaser />
      <ContactCta />
    </>
  );
}
