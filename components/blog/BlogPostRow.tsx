import Image from "next/image";
import Link from "next/link";
import { formatBlogDate } from "@/lib/blog/format-date";
import { CATEGORY_LABELS } from "@/lib/blog/types";
import type { BlogPostSummary } from "@/lib/blog/types";
import { withBasePath } from "@/lib/site/basePath";

interface BlogPostRowProps {
  post: BlogPostSummary;
  index: number;
}

export function BlogPostRow({ post, index }: BlogPostRowProps) {
  const reverse = index % 2 === 1;

  return (
    <article
      className={`grid gap-10 border-t border-stone-800 py-16 lg:grid-cols-2 lg:gap-16 lg:py-20 ${
        reverse ? "lg:[&>*:first-child]:order-2" : ""
      }`}
    >
      <Link
        href={`/blog/${post.slug}`}
        className="group relative block aspect-[4/3] overflow-hidden bg-stone-800 focus-visible:outline-offset-4"
      >
        <Image
          src={withBasePath(post.heroImage)}
          alt={post.heroAlt}
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover transition duration-[650ms] ease-out group-hover:scale-[1.04] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/50 via-transparent to-transparent opacity-80 transition duration-200 group-hover:opacity-100" />
      </Link>
      <div className="flex flex-col justify-center">
        <p className="text-xs uppercase tracking-[0.22em] text-gold">
          {CATEGORY_LABELS[post.category]} · {formatBlogDate(post.publishedAt)}
        </p>
        <h2 className="font-display mt-3 text-4xl text-stone-50 md:text-5xl">
          <Link
            href={`/blog/${post.slug}`}
            className="transition duration-200 hover:text-gold"
          >
            {post.title}
          </Link>
        </h2>
        <p className="mt-5 max-w-md text-base leading-relaxed text-stone-400">
          {post.description}
        </p>
        <p className="mt-6 text-xs uppercase tracking-[0.16em] text-stone-400">
          {post.tags.join(" · ")}
        </p>
      </div>
    </article>
  );
}
