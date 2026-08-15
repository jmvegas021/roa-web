import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogArticle } from "@/components/blog/BlogArticle";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { extractFaq } from "@/lib/blog/extract-faq";
import { loadPostBySlug, loadPublishedPosts } from "@/lib/blog/load-posts";
import {
  buildBlogPostingSchema,
  buildFaqPageSchema,
} from "@/lib/seo/blog-schema";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = 3600;

export function generateStaticParams() {
  return loadPublishedPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = loadPostBySlug(slug);
  if (!post) return { title: "Blog post not found" };

  const url = `/blog/${post.slug}`;
  return {
    title: post.title,
    description: post.description,
    keywords: post.keywords,
    authors: [{ name: post.author, url: "/agents/kevin-shoun" }],
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      title: post.title,
      description: post.description,
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt ?? post.publishedAt,
      authors: [post.author],
      tags: post.tags,
      images: [{ url: post.heroImage, alt: post.heroAlt }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: [post.heroImage],
    },
  };
}

export default async function BlogArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const post = loadPostBySlug(slug);
  if (!post) notFound();

  const faq = extractFaq(post.body);
  const schema = [
    buildBlogPostingSchema(post),
    ...(faq.length ? [buildFaqPageSchema(faq)] : []),
  ];

  return (
    <div className="overflow-x-hidden pt-24 lg:pt-28">
      <JsonLd data={schema} />
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <Breadcrumbs
          items={[
            { name: "Blog", path: "/blog" },
            { name: post.title, path: `/blog/${post.slug}` },
          ]}
          className="mb-8"
        />
      </div>
      <BlogArticle post={post} />
    </div>
  );
}
