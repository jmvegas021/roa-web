import type { Metadata } from "next";
import { ContactForm } from "@/components/forms/ContactForm";
import { SectionHeading } from "@/components/ui/SectionPrimitives";
import { SITE } from "@/lib/content/team";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact the Office of Kevin Shoun — Realty of America, Central Texas luxury real estate.",
};

export default function ContactPage() {
  return (
    <div className="pt-32 lg:pt-36">
      <section className="mx-auto grid max-w-7xl gap-14 px-6 pb-24 lg:grid-cols-2 lg:gap-20 lg:px-10 lg:pb-32">
        <div>
          <SectionHeading
            eyebrow="By appointment"
            title="Tell us what you’re seeking"
            description="Share a few details and our office will follow up. For time-sensitive matters, call directly."
          />
          <div className="mt-10 space-y-1 text-base text-stone-50">
            <p>
              <a
                href={`tel:${SITE.phone}`}
                className="inline-flex min-h-11 cursor-pointer items-center transition duration-200 hover:text-gold"
              >
                {SITE.phone}
              </a>
            </p>
            <p>
              <a
                href={`mailto:${SITE.email}`}
                className="inline-flex min-h-11 cursor-pointer items-center transition duration-200 hover:text-gold"
              >
                {SITE.email}
              </a>
            </p>
            <p className="pt-2 text-stone-400">{SITE.address}</p>
          </div>
        </div>
        <div className="border border-stone-800/80 bg-stone-900 p-6 sm:p-10">
          <ContactForm submitLabel="Request a consultation" />
        </div>
      </section>
    </div>
  );
}
