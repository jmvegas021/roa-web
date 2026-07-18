import { Hero } from "@/components/home/Hero";
import { FeaturedListings } from "@/components/home/FeaturedListings";
import { SearchEntry } from "@/components/home/SearchEntry";
import { TeamTeaser } from "@/components/home/TeamTeaser";
import { NeighborhoodsTeaser } from "@/components/home/NeighborhoodsTeaser";
import { Testimonials } from "@/components/home/Testimonials";
import { ContactCta } from "@/components/home/ContactCta";
import { listingsManager } from "@/lib/idx/listings-service";

export const revalidate = 300;

export default async function HomePage() {
  const { listings, source } = await listingsManager.getFeatured(6);

  return (
    <>
      <Hero />
      <FeaturedListings listings={listings} source={source} />
      <SearchEntry />
      <TeamTeaser />
      <NeighborhoodsTeaser />
      <Testimonials />
      <ContactCta />
    </>
  );
}
