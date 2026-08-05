import type { Metadata } from "next";
import Image from "next/image";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { SectionHeading } from "@/components/ui/SectionPrimitives";
import { NEIGHBORHOODS } from "@/lib/content/neighborhoods";

export const metadata: Metadata = {
  title: "Salado, Belton, Temple & Georgetown Neighborhoods",
  description:
    "Neighborhood guides for Salado, Belton, Temple, Georgetown, and Central Texas — character-focused market notes from the Office of Kevin Shoun.",
  alternates: { canonical: "/neighborhoods" },
};

export default function NeighborhoodsPage() {
  return (
    <div className="pt-28 lg:pt-32">
      <section className="px-6 pb-12 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <Breadcrumbs
            items={[{ name: "Neighborhoods", path: "/neighborhoods" }]}
            className="mb-8"
          />
          <SectionHeading
            as="h1"
            eyebrow="Central Texas"
            title="Neighborhoods & corridors"
            description="Markets we know intimately across Salado, Belton, Temple, Georgetown, and Bell–Williamson Counties — written for buyers and sellers who want a sense of character, not a checklist."
          />
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 pb-24 lg:px-10 lg:pb-32">
        {NEIGHBORHOODS.map((place, index) => (
          <section
            key={place.slug}
            id={place.slug}
            className={`grid gap-10 border-t border-stone-800 py-16 lg:grid-cols-2 lg:gap-16 lg:py-20 ${
              index % 2 === 1 ? "lg:[&>*:first-child]:order-2" : ""
            }`}
          >
            <div className="relative aspect-[4/3] overflow-hidden bg-stone-800">
              <Image
                src={place.imageUrl}
                alt={place.name}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            <div className="flex flex-col justify-center">
              <p className="text-xs uppercase tracking-[0.22em] text-gold">
                {place.region}
              </p>
              <h2 className="font-display mt-3 text-4xl text-stone-50 md:text-5xl">
                {place.name}
              </h2>
              <p className="mt-5 max-w-md text-base leading-relaxed text-stone-400">
                {place.summary}
              </p>
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
