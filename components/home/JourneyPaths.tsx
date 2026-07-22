import Link from "next/link";
import { RevealOnScroll } from "@/components/motion/RevealOnScroll";
import { ButtonLink, SectionHeading } from "@/components/ui/SectionPrimitives";

const PATHS = [
  {
    title: "Acquire with intention",
    description:
      "Quiet access to residences that match your criteria — without the noise of a public chase.",
    cta: { href: "/search", label: "Search homes" },
  },
  {
    title: "List with discretion",
    description:
      "A private sale process built around timing, positioning, and introductions that stay intentional.",
    cta: { href: "/contact", label: "Request a seller consult" },
    secondary: { href: "/#valuation", label: "Start with a valuation" },
  },
] as const;

/** Buyer / seller dual-path — text composition with a subtle divider, no cards. */
export function JourneyPaths() {
  return (
    <section className="bg-stone-950 px-6 py-24 lg:px-10 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <RevealOnScroll>
          <SectionHeading
            title="Where are you in the journey?"
            description="Whether you're acquiring your next Central Texas residence or preparing a private sale, we start with clarity—not noise."
          />
        </RevealOnScroll>

        <div className="mt-16 grid gap-12 border-t border-stone-800 pt-14 md:grid-cols-2 md:gap-0 md:divide-x md:divide-stone-800">
          {PATHS.map((path, index) => (
            <RevealOnScroll
              key={path.title}
              delayMs={index * 80}
              className={index === 0 ? "md:pr-12 lg:pr-16" : "md:pl-12 lg:pl-16"}
            >
              <h3 className="font-display text-2xl leading-snug text-stone-50 sm:text-3xl">
                {path.title}
              </h3>
              <p className="mt-4 max-w-md text-base leading-[1.7] text-stone-400">
                {path.description}
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
                <ButtonLink href={path.cta.href}>{path.cta.label}</ButtonLink>
                {"secondary" in path && path.secondary ? (
                  <Link
                    href={path.secondary.href}
                    className="inline-flex min-h-11 items-center text-xs uppercase tracking-[0.2em] text-stone-300 transition duration-200 hover:text-gold"
                  >
                    {path.secondary.label}
                  </Link>
                ) : null}
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
