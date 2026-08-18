import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { KevinLocalExpertise } from "@/components/agents/KevinLocalExpertise";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { ButtonLink } from "@/components/ui/SectionPrimitives";
import { ContactForm } from "@/components/forms/ContactForm";
import { agentsManager } from "@/lib/idx/listings-service";
import { TEAM } from "@/lib/content/team";

export const metadata: Metadata = {
  title: "Kevin Shoun — Salado & Central Texas Real Estate Professional",
  description:
    "Kevin Shoun, real estate professional at Realty of America. Buyers, sellers, military relocation, land, and farm & ranch across Salado, Belton, Temple, and Georgetown.",
  alternates: { canonical: "/agents/kevin-shoun" },
  openGraph: {
    title: "Kevin Shoun — Salado & Central Texas Realtor",
    description:
      "Real estate professional at Realty of America serving Salado, Belton, Temple, Georgetown, and Central Texas.",
    url: "/agents/kevin-shoun",
    images: [{ url: "/images/kevin-shoun.webp" }],
  },
};

export default async function KevinShounPage() {
  const agent =
    (await agentsManager.getBySlug("kevin-shoun")) ??
    TEAM.find((member) => member.slug === "kevin-shoun");

  if (!agent) notFound();

  return (
    <div className="pt-32 lg:pt-36">
      <article className="mx-auto grid max-w-7xl gap-12 px-6 pb-24 lg:grid-cols-2 lg:gap-20 lg:px-10 lg:pb-32">
        <div className="relative aspect-[4/5] overflow-hidden bg-stone-800">
          <Image
            src={agent.imageUrl}
            alt={`${agent.name}, Salado and Central Texas real estate professional`}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
        <div>
          <Breadcrumbs
            items={[
              { name: "Agents", path: "/agents" },
              { name: agent.name, path: "/agents/kevin-shoun" },
            ]}
            className="mb-8"
          />
          <p className="text-xs uppercase tracking-[0.22em] text-gold">
            {agent.title}
          </p>
          <h1 className="font-display mt-4 text-5xl text-stone-50 md:text-6xl">
            {agent.name}
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-stone-400">
            {agent.bio}
          </p>
          <KevinLocalExpertise />
          {agent.specialties.length > 0 ? (
            <ul className="mt-8 flex flex-wrap gap-3">
              {agent.specialties.map((item) => (
                <li
                  key={item}
                  className="border border-stone-700 px-3 py-1 text-xs uppercase tracking-[0.14em] text-stone-400"
                >
                  {item}
                </li>
              ))}
            </ul>
          ) : null}
          <div className="mt-10 space-y-2 text-sm text-stone-50">
            <p>
              <a href={`tel:${agent.phone}`} className="hover:text-gold">
                {agent.phone}
              </a>
            </p>
            <p>
              <a href={`mailto:${agent.email}`} className="hover:text-gold">
                {agent.email}
              </a>
            </p>
          </div>
          <div className="mt-10 flex flex-wrap gap-4">
            <ButtonLink href="/contact">Work with Kevin</ButtonLink>
            <ButtonLink href="/listings" variant="ghost">
              View listings
            </ButtonLink>
          </div>
          <div className="mt-14 border-t border-stone-800 pt-10">
            <h2 className="font-display text-2xl text-stone-50">
              Private consultation
            </h2>
            <div className="mt-6">
              <ContactForm submitLabel="Request a call" />
            </div>
          </div>
          <p className="mt-8 text-sm text-stone-400">
            <Link href="/agents" className="text-gold hover:underline">
              ← All agents
            </Link>
          </p>
        </div>
      </article>
    </div>
  );
}
