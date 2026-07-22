import { RevealOnScroll } from "@/components/motion/RevealOnScroll";
import { SectionHeading } from "@/components/ui/SectionPrimitives";
import { TESTIMONIALS } from "@/lib/content/neighborhoods";

export function Testimonials() {
  return (
    <section className="bg-stone-950 px-6 py-24 lg:px-10 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <RevealOnScroll>
          <SectionHeading
            eyebrow="Client words"
            title="Quiet confidence, lasting trust"
          />
        </RevealOnScroll>
        <div className="mt-14 grid gap-12 md:grid-cols-3">
          {TESTIMONIALS.map((item, index) => (
            <RevealOnScroll key={item.name} delayMs={index * 90}>
              <blockquote className="border-t border-gold/30 pt-8">
                <p className="font-display text-2xl leading-snug text-stone-50">
                  “{item.quote}”
                </p>
                <footer className="mt-6 text-sm text-stone-400">
                  <cite className="not-italic text-stone-50">{item.name}</cite>
                  <span className="mt-1 block">{item.detail}</span>
                </footer>
              </blockquote>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
