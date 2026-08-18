import type { Metadata } from "next";
import { SectionHeading, ButtonLink } from "@/components/ui/SectionPrimitives";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { SITE } from "@/lib/content/team";

export const metadata: Metadata = {
  title: "About Kevin Shoun & Realty of America",
  description:
    "About the Office of Kevin Shoun at Realty of America — Salado, Belton, Temple, Georgetown, and Central Texas residential real estate.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <div className="pt-32 lg:pt-36">
      <section className="px-6 pb-24 lg:px-10 lg:pb-32">
        <div className="mx-auto max-w-3xl">
          <Breadcrumbs
            items={[{ name: "About", path: "/about" }]}
            className="mb-8"
          />
          <SectionHeading
            as="h1"
            eyebrow={SITE.brand}
            title="Precision is the advantage."
            description="The Office of Kevin Shoun represents buyers and sellers across Salado, Belton, Temple, Georgetown, and Central Texas — with clarity, discretion, and white-glove care."
          />
          <div className="prose-luxury mt-14 space-y-6 text-base">
            <p>
              For consequential moves, volume marketing is rarely the smartest
              path. We pair deep Bell and Williamson County fluency with
              restrained presentation and deliberate negotiation — so every
              decision feels intentional.
            </p>
            <p>
              As part of {SITE.brand}, our office combines national brokerage
              strength with a boutique client experience: fewer concurrent
              priorities, more presence at every milestone. Kevin’s background
              in military leadership and relocation shapes a practice built for
              high-stakes timelines, military PCS moves, and professionals who
              cannot afford noise.
            </p>
            <p>
              Whether you are acquiring a Salado estate, listing a Belton
              residence, exploring farm and ranch acreage, or relocating to
              Georgetown, we bring calm expertise and a network built for
              Central Texas.
            </p>
            <p>
              The process begins with the property and the decision around it.
              We coordinate pricing, presentation, inspections, contract
              strategy, and local diligence with the appropriate specialists,
              while keeping the client’s timing and long-term objectives at the
              center of every recommendation.
            </p>
          </div>
          <div className="mt-14 flex flex-wrap gap-4">
            <ButtonLink href="/agents/kevin-shoun">Meet Kevin</ButtonLink>
            <ButtonLink href="/contact" variant="ghost">
              Private consult
            </ButtonLink>
          </div>
        </div>
      </section>
    </div>
  );
}
