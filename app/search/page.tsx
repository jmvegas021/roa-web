import type { Metadata } from "next";
import { IdxWidget } from "@/components/idx/IdxWidget";
import { SectionHeading, ButtonLink } from "@/components/ui/SectionPrimitives";
import { getPublicIdxConfig } from "@/lib/idx/public-config";

export const metadata: Metadata = {
  title: "MLS Search",
  description:
    "Search Central Texas MLS inventory through IDX Broker — Office of Kevin Shoun, Realty of America.",
};

export default function SearchPage() {
  const { subdomain } = getPublicIdxConfig();
  const idxSearchUrl = subdomain
    ? `https://${subdomain}/idx/search/advanced`
    : "/wrapper";

  return (
    <div className="pt-28 lg:pt-32">
      <section className="px-6 pb-16 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="MLS"
            title="Search Central Texas"
            description="Full MLS results are delivered through IDX Broker. Featured office listings live on our custom gallery; use search below for the complete market."
          />
          <div className="mt-12 grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
            <IdxWidget type="quicksearch" title="Quick search" />
            <div className="border border-stone-800 bg-stone-900 p-8">
              <h2 className="font-display text-2xl text-stone-50">
                Need more filters?
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-stone-400">
                Open advanced IDX search for map tools, saved links, and full MLS
                detail pages inside our branded wrapper.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <ButtonLink href={idxSearchUrl}>Advanced search</ButtonLink>
                <ButtonLink href="/listings" variant="ghost">
                  Featured only
                </ButtonLink>
              </div>
            </div>
          </div>
          <IdxWidget
            type="showcase"
            title="IDX showcase"
            className="mt-12"
            fallbackHref="/listings"
          />
        </div>
      </section>
    </div>
  );
}
