import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ButtonLink } from "@/components/ui/SectionPrimitives";
import { agentsManager } from "@/lib/idx/listings-service";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const { agents } = await agentsManager.getTeam();
  return agents.map((agent) => ({ slug: agent.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const agent = await agentsManager.getBySlug(slug);
  if (!agent) {
    return { title: "Agent not found", robots: { index: false } };
  }
  const title = `${agent.name} — Belton & Temple TX Realtor`;
  const description =
    agent.bio?.slice(0, 155).trim() ||
    `${agent.name}, ${agent.title} with Realty of America.`;
  return {
    title,
    description,
    alternates: { canonical: `/agents/${agent.slug}` },
    openGraph: {
      title,
      description,
      url: `/agents/${agent.slug}`,
      images: agent.imageUrl ? [{ url: agent.imageUrl }] : [],
    },
  };
}

export default async function AgentDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const agent = await agentsManager.getBySlug(slug);
  if (!agent) notFound();

  return (
    <div className="pt-28 lg:pt-32">
      <article className="mx-auto grid max-w-7xl gap-12 px-6 pb-24 lg:grid-cols-2 lg:gap-16 lg:px-10">
        <div className="relative aspect-[3/4] overflow-hidden bg-stone-800">
          <Image
            src={agent.imageUrl}
            alt={agent.name}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-gold">
            {agent.title}
          </p>
          <h1 className="font-display mt-4 text-5xl text-stone-50">
            {agent.name}
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-stone-400">
            {agent.bio}
          </p>
          <div className="mt-10 space-y-2 text-sm">
            {agent.phone ? (
              <p>
                <a href={`tel:${agent.phone}`} className="hover:text-gold">
                  {agent.phone}
                </a>
              </p>
            ) : null}
            {agent.email ? (
              <p>
                <a href={`mailto:${agent.email}`} className="hover:text-gold">
                  {agent.email}
                </a>
              </p>
            ) : null}
          </div>
          <div className="mt-10">
            <ButtonLink href="/contact">Contact the office</ButtonLink>
          </div>
        </div>
      </article>
    </div>
  );
}
