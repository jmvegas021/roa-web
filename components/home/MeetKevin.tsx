import Image from "next/image";
import Link from "next/link";
import { ParallaxBand } from "@/components/motion/ParallaxBand";
import { RevealOnScroll } from "@/components/motion/RevealOnScroll";
import { ButtonLink } from "@/components/ui/SectionPrimitives";
import { NEIGHBORHOODS } from "@/lib/content/neighborhoods";
import { TEAM } from "@/lib/content/team";

/** Belton market exterior — parallax backdrop (not the profile portrait). */
const MEET_KEVIN_BACKGROUND =
  NEIGHBORHOODS.find((n) => n.slug === "belton")?.imageUrl ??
  NEIGHBORHOODS[0].imageUrl;

/** Meet Kevin — bio + portrait over a real-estate parallax band. */
export function MeetKevin() {
  const kevin = TEAM.find((agent) => agent.isPrimary) ?? TEAM[0];

  return (
    <ParallaxBand
      imageSrc={MEET_KEVIN_BACKGROUND}
      imageAlt=""
      className="min-h-[70vh]"
      intensity={56}
      overlayClassName="bg-gradient-to-r from-stone-950 via-stone-950/90 to-roa-blue/45"
    >
      <div className="mx-auto flex min-h-[70vh] max-w-7xl items-center px-6 py-24 lg:px-10 lg:py-32">
        <div className="grid w-full items-center gap-12 lg:grid-cols-2 lg:gap-16 xl:gap-20">
          <RevealOnScroll>
            <p className="text-xs uppercase tracking-[0.24em] text-gold">
              Meet Kevin
            </p>
            <h2 className="font-display mt-4 text-[clamp(2.25rem,4vw,3.75rem)] leading-[1.05] text-stone-50 text-balance">
              {kevin.name}
            </h2>
            <p className="mt-3 text-sm uppercase tracking-[0.16em] text-stone-400">
              {kevin.title}
            </p>
            <p className="mt-8 text-base leading-[1.75] text-stone-300 sm:text-lg">
              {kevin.bio}
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <ButtonLink href="/agents/kevin-shoun">Full profile</ButtonLink>
              <Link
                href="/contact"
                className="inline-flex min-h-11 items-center text-xs uppercase tracking-[0.2em] text-stone-300 transition duration-200 hover:text-gold"
              >
                Private consult
              </Link>
            </div>
          </RevealOnScroll>

          <RevealOnScroll delayMs={120} className="mx-auto w-full max-w-md lg:mx-0 lg:max-w-none lg:justify-self-end">
            <div className="relative aspect-[4/5] w-full max-w-md overflow-hidden bg-stone-800 lg:ml-auto">
              <Image
                src={kevin.imageUrl}
                alt={`${kevin.name}, Belton and Temple Texas real estate agent`}
                fill
                sizes="(max-width: 1024px) 90vw, 28rem"
                className="object-cover object-top"
              />
            </div>
          </RevealOnScroll>
        </div>
      </div>
    </ParallaxBand>
  );
}
