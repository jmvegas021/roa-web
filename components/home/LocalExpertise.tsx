import Link from "next/link";
import { RevealOnScroll } from "@/components/motion/RevealOnScroll";

export function LocalExpertise() {
  return (
    <section className="border-y border-stone-800 bg-stone-950 px-6 py-20 lg:px-10 lg:py-28">
      <RevealOnScroll className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-gold">
            Local representation
          </p>
          <h2 className="font-display mt-4 text-4xl leading-tight text-stone-50 md:text-5xl">
            Real estate guidance for Salado and Central Texas
          </h2>
        </div>
        <div className="space-y-6 text-base leading-8 text-stone-300">
          <p>
            Kevin Shoun represents buyers and sellers across Salado, Belton,
            Temple, Georgetown, Harker Heights, and the surrounding Bell and
            Williamson County communities. Each search begins with the life a
            client is planning: the setting, commute, property type, timing,
            and level of stewardship the move requires.
          </p>
          <p>
            That may mean comparing a Salado village home with acreage,
            evaluating newer construction in Temple or Georgetown, preparing a
            Belton property for market, or coordinating a military relocation
            near Fort Cavazos. The work stays property-specific, with careful
            attention to condition, contracts, local context, and the
            professionals needed for informed due diligence.
          </p>
          <p>
            Explore the{" "}
            <Link href="/neighborhoods" className="text-gold hover:underline">
              Central Texas neighborhood guides
            </Link>{" "}
            or{" "}
            <Link href="/contact" className="text-gold hover:underline">
              arrange a private consultation
            </Link>{" "}
            to define the next move.
          </p>
        </div>
      </RevealOnScroll>
    </section>
  );
}
