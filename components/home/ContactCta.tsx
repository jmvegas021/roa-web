import { ButtonLink, SectionHeading } from "@/components/ui/SectionPrimitives";

export function ContactCta() {
  return (
    <section className="bg-stone-900 px-6 py-24 lg:px-10 lg:py-32">
      <div className="mx-auto flex max-w-7xl flex-col items-start gap-10 md:flex-row md:items-end md:justify-between md:gap-16">
        <SectionHeading
          eyebrow="By appointment"
          title="When you’re ready for the right address."
          description="Every conversation is confidential. Every introduction is deliberate. Share what you’re seeking — the Office of Kevin Shoun will respond with clarity."
        />
        <ButtonLink href="/contact" className="shrink-0">
          Request a consultation
        </ButtonLink>
      </div>
    </section>
  );
}
