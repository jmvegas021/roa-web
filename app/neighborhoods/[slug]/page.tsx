import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { ButtonLink } from "@/components/ui/SectionPrimitives";
import {
  getNeighborhoodGuide,
  NEIGHBORHOOD_GUIDES,
  type NeighborhoodGuide,
} from "@/lib/content/neighborhood-guides";
import {
  NEIGHBORHOODS,
  type Neighborhood,
} from "@/lib/content/neighborhoods";
import { buildNeighborhoodPlaceSchema } from "@/lib/seo/neighborhood-schema";

interface PageProps {
  params: Promise<{ slug: string }>;
}

interface GuideContentProps {
  guide: NeighborhoodGuide;
}

export function generateStaticParams() {
  return NEIGHBORHOOD_GUIDES.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const guide = getNeighborhoodGuide(slug);
  const neighborhood = findNeighborhood(slug);
  if (!guide || !neighborhood)
    return { title: "Neighborhood not found", robots: { index: false } };

  const canonical = `/neighborhoods/${slug}`;
  return {
    title: guide.title,
    description: guide.description,
    alternates: { canonical },
    openGraph: {
      title: guide.title,
      description: guide.description,
      url: canonical,
      images: [{ url: neighborhood.imageUrl, alt: neighborhood.name }],
    },
  };
}

export default async function NeighborhoodGuidePage({ params }: PageProps) {
  const { slug } = await params;
  const guide = getNeighborhoodGuide(slug);
  const neighborhood = findNeighborhood(slug);
  if (!guide || !neighborhood) notFound();

  return (
    <article className="pt-28 lg:pt-32">
      <JsonLd data={buildNeighborhoodPlaceSchema(guide, neighborhood)} />
      <GuideHero guide={guide} neighborhood={neighborhood} />
      <GuideContent guide={guide} />
    </article>
  );
}

function GuideHero({
  guide,
  neighborhood,
}: {
  guide: NeighborhoodGuide;
  neighborhood: Neighborhood;
}) {
  return (
    <header className="px-6 pb-14 lg:px-10 lg:pb-20">
      <div className="mx-auto max-w-7xl">
        <Breadcrumbs
          items={[
            { name: "Neighborhoods", path: "/neighborhoods" },
            { name: neighborhood.name, path: `/neighborhoods/${guide.slug}` },
          ]}
          className="mb-8"
        />
        <p className="text-xs uppercase tracking-[0.22em] text-gold">
          {neighborhood.region}
        </p>
        <h1 className="font-display mt-4 max-w-4xl text-5xl leading-tight text-stone-50 md:text-6xl">
          {guide.title}
        </h1>
        <p className="mt-7 max-w-3xl text-lg leading-relaxed text-stone-300">
          {guide.introduction}
        </p>
      </div>
    </header>
  );
}

function GuideContent({ guide }: GuideContentProps) {
  const sections = [
    ["Daily life and location", guide.lifestyle],
    ["Understanding the real estate", guide.realEstate],
    ["Planning a confident move", guide.planning],
  ];

  return (
    <div className="mx-auto grid max-w-7xl gap-12 px-6 pb-24 lg:grid-cols-[1.05fr_0.95fr] lg:px-10 lg:pb-32">
      <div className="space-y-12">
        {sections.map(([title, content]) => (
          <section key={title}>
            <h2 className="font-display text-3xl text-stone-50">{title}</h2>
            <p className="mt-4 text-base leading-8 text-stone-300">{content}</p>
          </section>
        ))}
        <div className="flex flex-wrap gap-4 pt-2">
          <ButtonLink href="/contact">Plan a private consultation</ButtonLink>
          <ButtonLink href="/listings" variant="ghost">
            Explore listings
          </ButtonLink>
        </div>
      </div>
      <GuideImage guide={guide} />
    </div>
  );
}

function GuideImage({ guide }: GuideContentProps) {
  const neighborhood = findNeighborhood(guide.slug);
  if (!neighborhood) return null;

  return (
    <div className="relative aspect-[4/5] overflow-hidden bg-stone-800 lg:sticky lg:top-28">
      <Image
        src={neighborhood.imageUrl}
        alt={`${neighborhood.name}, Texas`}
        fill
        sizes="(max-width: 1024px) 100vw, 45vw"
        className="object-cover"
      />
    </div>
  );
}

function findNeighborhood(slug: string): Neighborhood | undefined {
  return NEIGHBORHOODS.find((neighborhood) => neighborhood.slug === slug);
}
