import Image from "next/image";
import { ButtonLink } from "@/components/ui/SectionPrimitives";
import { HERO_IMAGE } from "@/lib/content/mock-listings";
import { SITE } from "@/lib/content/team";

export function Hero() {
  return (
    <section className="relative min-h-[100svh] overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src={HERO_IMAGE}
          alt="Luxury Central Texas estate at dusk"
          fill
          priority
          sizes="100vw"
          className="object-cover animate-ken-burns"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-stone-950/92 via-stone-950/58 to-stone-950/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-transparent to-stone-950/45" />
      </div>

      <div className="relative mx-auto flex min-h-[100svh] max-w-7xl flex-col justify-end px-6 pb-24 pt-40 lg:px-10 lg:pb-32">
        <p className="animate-fade-up text-xs uppercase tracking-[0.28em] text-gold">
          Central Texas
          <span className="mx-3 text-stone-400">·</span>
          Austin · Hill Country
        </p>
        <h1 className="font-display animate-fade-up-delay-1 mt-6 max-w-3xl text-[clamp(2.85rem,7.5vw,5.75rem)] leading-[0.92] text-stone-50 text-balance">
          The finest addresses, quietly represented.
        </h1>
        <p className="animate-fade-up-delay-2 mt-6 max-w-lg text-base leading-relaxed text-stone-400 sm:text-lg">
          {SITE.office} — boutique luxury representation across Austin, Round
          Rock, Georgetown, and the Hill Country.
        </p>
        <div className="animate-fade-up-delay-3 mt-10 flex flex-wrap gap-4">
          <ButtonLink href="/listings">View collection</ButtonLink>
          <ButtonLink href="/contact" variant="ghost">
            Private consult
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
