import { ButtonLink, SectionHeading } from "@/components/ui/SectionPrimitives";
import { IdxWidget } from "@/components/idx/IdxWidget";

/** Home teaser — full map search lives on /search. */
export function SearchEntry() {
  return (
    <section className="bg-stone-900 px-6 py-24 lg:px-10 lg:py-28">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2 lg:items-center">
        <SectionHeading
          eyebrow="MLS search"
          title="Begin with intention"
          description="Explore the full MLS on an interactive map — filter by price, beds, and location, then open any home for details."
        />
        <div className="space-y-6">
          <IdxWidget
            type="mapsearch"
            title="Map search"
            fallbackHref="/search"
          />
          <div className="flex flex-wrap gap-4">
            <ButtonLink href="/search">Open MLS search</ButtonLink>
            <ButtonLink href="/listings" variant="ghost">
              Featured collection
            </ButtonLink>
          </div>
        </div>
      </div>
    </section>
  );
}
