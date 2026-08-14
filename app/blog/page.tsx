import type { Metadata } from "next";
import { Suspense } from "react";
import { BlogCatalog } from "@/components/blog/BlogCatalog";
import { BlogPostRow } from "@/components/blog/BlogPostRow";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { SectionHeading } from "@/components/ui/SectionPrimitives";
import { POSTS_PER_PAGE } from "@/lib/blog/constants";
import { loadPostSummaries } from "@/lib/blog/load-posts";

export const metadata: Metadata = {
  title: "Journal — Salado, Belton & Central Texas",
  description:
    "Guides and market notes from the Office of Kevin Shoun — Salado, Belton, Temple, Georgetown, and Central Texas, written for buyers and relocation.",
  alternates: {
    canonical: "/blog",
    types: {
      "application/rss+xml": "/blog/rss.xml",
    },
  },
};

export const revalidate = 3600;

export default function BlogIndexPage() {
  const posts = loadPostSummaries();
  const preview = posts.slice(0, POSTS_PER_PAGE);

  return (
    <div className="pt-32 lg:pt-36">
      <section className="px-6 pb-6 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <Breadcrumbs
            items={[{ name: "Journal", path: "/blog" }]}
            className="mb-8"
          />
          <SectionHeading
            as="h1"
            eyebrow="Journal"
            title="Notes from the corridor"
            description="Editorial guides to Salado, Belton, Temple, Georgetown, and Central Texas — character, cadence, and the decisions that actually matter."
          />
        </div>
      </section>
      <section className="px-6 pb-24 lg:px-10 lg:pb-32">
        <div className="mx-auto max-w-7xl">
          <Suspense fallback={<BlogCatalogFallback posts={preview} />}>
            <BlogCatalog posts={posts} />
          </Suspense>
        </div>
      </section>
    </div>
  );
}

function BlogCatalogFallback({
  posts,
}: {
  posts: ReturnType<typeof loadPostSummaries>;
}) {
  return (
    <div>
      {posts.map((post, index) => (
        <BlogPostRow key={post.slug} post={post} index={index} />
      ))}
    </div>
  );
}
