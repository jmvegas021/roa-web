import Image from "next/image";
import { ButtonLink, SectionHeading } from "@/components/ui/SectionPrimitives";
import { TEAM } from "@/lib/content/team";

export function TeamTeaser() {
  const kevin = TEAM.find((agent) => agent.isPrimary) ?? TEAM[0];

  return (
    <section className="bg-stone-950 px-6 py-24 lg:px-10 lg:py-32">
      <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-2 lg:items-center lg:gap-24">
        <div className="relative aspect-[4/5] overflow-hidden bg-stone-800">
          <Image
            src={kevin.imageUrl}
            alt={kevin.name}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
        <div>
          <SectionHeading
            eyebrow="The practice"
            title="Discretion is our first offering."
            description="Kevin Shoun leads a Central Texas practice rooted in market fluency and white-glove care — for founders, families, and anyone who prefers fewer conversations and clearer outcomes."
          />
          <p className="mt-8 max-w-lg text-base leading-[1.7] text-stone-400">
            Most consequential homes are won quietly. We pair restrained
            marketing with deliberate negotiation so every introduction feels
            intentional — never rushed, never loud.
          </p>
          <p className="mt-6 text-sm uppercase tracking-[0.18em] text-gold">
            {kevin.name}
            <span className="mx-2 text-stone-700">·</span>
            <span className="text-stone-400">{kevin.title}</span>
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <ButtonLink href="/agents/kevin-shoun">Meet Kevin</ButtonLink>
            <ButtonLink href="/about" variant="ghost">
              Our story
            </ButtonLink>
          </div>
        </div>
      </div>
    </section>
  );
}
