import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { SectionHeading } from "@/components/ui/SectionPrimitives";
import { agentsManager } from "@/lib/idx/listings-service";

export const metadata: Metadata = {
  title: "Kevin Shoun — Belton & Temple TX Realtor",
  description:
    "Meet Kevin Shoun, Broker Associate with Realty of America. Residential real estate in Belton, Temple, and Central Texas.",
  alternates: { canonical: "/agents" },
};

export const revalidate = 600;

export default async function AgentsPage() {
  const { agents } = await agentsManager.getTeam();

  return (
    <div className="pt-32 lg:pt-36">
      <section className="px-6 pb-24 lg:px-10 lg:pb-32">
        <div className="mx-auto max-w-7xl">
          <Breadcrumbs
            items={[{ name: "Agents", path: "/agents" }]}
            className="mb-8"
          />
          <SectionHeading
            as="h1"
            eyebrow="The office"
            title="Kevin Shoun"
            description="Residential representation across Belton, Temple, and Central Texas."
          />
          <div className="mt-16 grid max-w-md gap-12">
            {agents.map((agent) => (
              <Link
                key={agent.id}
                href={`/agents/${agent.slug}`}
                className="group block cursor-pointer focus-visible:outline-offset-4"
              >
                <div className="relative aspect-[3/4] overflow-hidden bg-stone-800">
                  <Image
                    src={agent.imageUrl}
                    alt={agent.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition duration-700 ease-out group-hover:scale-[1.04] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                  />
                </div>
                <h2 className="font-display mt-6 text-3xl text-stone-50 transition duration-200 group-hover:text-gold">
                  {agent.name}
                </h2>
                <p className="mt-2 text-sm text-stone-400">{agent.title}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
