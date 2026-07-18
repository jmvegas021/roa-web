import Link from "next/link";
import Image from "next/image";
import { SectionHeading } from "@/components/ui/SectionPrimitives";
import { NEIGHBORHOODS } from "@/lib/content/neighborhoods";

export function NeighborhoodsTeaser() {
  const featured = NEIGHBORHOODS.slice(0, 3);

  return (
    <section className="bg-stone-900 px-6 py-24 lg:px-10 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="Central Texas"
          title="Markets we know by heart"
          description="Editorial guides to Belton, Temple, Salado, and the Bell County corridor — a sense of place, not a checklist."
        />
        <div className="mt-14 grid gap-10 md:grid-cols-3">
          {featured.map((place) => (
            <Link
              key={place.slug}
              href={`/neighborhoods#${place.slug}`}
              className="group block cursor-pointer focus-visible:outline-offset-4"
            >
              <div className="relative aspect-[3/4] overflow-hidden bg-stone-800">
                <Image
                  src={place.imageUrl}
                  alt={place.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition duration-700 ease-out group-hover:scale-[1.04] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6">
                  <p className="text-xs uppercase tracking-[0.2em] text-gold">
                    {place.region}
                  </p>
                  <h3 className="font-display mt-2 text-3xl text-stone-50">
                    {place.name}
                  </h3>
                </div>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-stone-400">
                {place.summary}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
