import { ButtonLink, SectionHeading } from "@/components/ui/SectionPrimitives";
import { IdxWidget } from "@/components/idx/IdxWidget";

export function SearchEntry() {
  return (
    <section className="bg-stone-900 px-6 py-24 lg:px-10 lg:py-28">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2 lg:items-center">
        <SectionHeading
          eyebrow="MLS search"
          title="Begin with intention"
          description="Use our branded search to explore the full MLS. Featured office listings are presented in our custom gallery; complete market inventory lives in IDX search."
        />
        <div className="space-y-6">
          <IdxWidget
            type="quicksearch"
            title="Quick search"
            fallbackHref="/search"
          />
          <div className="flex flex-wrap gap-4">
            <ButtonLink href="/search">Open search</ButtonLink>
            <ButtonLink href="/wrapper" variant="ghost">
              Advanced IDX
            </ButtonLink>
          </div>
        </div>
      </div>
    </section>
  );
}
