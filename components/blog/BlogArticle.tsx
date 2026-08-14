import Image from "next/image";
import { MarkdownBody } from "@/components/blog/MarkdownBody";
import { ButtonLink } from "@/components/ui/SectionPrimitives";
import { formatBlogDate } from "@/lib/blog/format-date";
import { CATEGORY_LABELS } from "@/lib/blog/types";
import type { BlogPost } from "@/lib/blog/types";
import { withBasePath } from "@/lib/site/basePath";

interface BlogArticleProps {
  post: BlogPost;
}

export function BlogArticle({ post }: BlogArticleProps) {
  const displayed = post.updatedAt ?? post.publishedAt;
  const isUpdated = Boolean(post.updatedAt && post.updatedAt !== post.publishedAt);

  return (
    <article className="pb-24 lg:pb-32">
      <div className="relative aspect-[16/9] overflow-hidden bg-stone-800 lg:aspect-[21/9]">
        <Image
          src={withBasePath(post.heroImage)}
          alt={post.heroAlt}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-transparent to-transparent" />
      </div>
      <div className="mx-auto max-w-3xl px-6 pt-12 lg:px-10 lg:pt-16">
        <p className="text-xs uppercase tracking-[0.22em] text-gold">
          {CATEGORY_LABELS[post.category]}
        </p>
        <h1 className="font-display mt-4 text-balance text-[clamp(2.25rem,4vw,3.5rem)] leading-[1.05] text-stone-50">
          {post.title}
        </h1>
        <p className="mt-5 text-sm text-stone-400">
          {post.author} · {isUpdated ? "Updated" : "Published"}{" "}
          {formatBlogDate(displayed)}
        </p>
        <p className="mt-8 text-lg leading-relaxed text-stone-400">
          {post.description}
        </p>
        <div className="mt-12">
          <MarkdownBody content={post.body} slug={post.slug} />
        </div>
        <div className="mt-16 flex flex-wrap gap-4 border-t border-stone-800 pt-12">
          <ButtonLink href="/contact">Private consult</ButtonLink>
          <ButtonLink href="/listings" variant="ghost">
            Featured collection
          </ButtonLink>
        </div>
      </div>
    </article>
  );
}
