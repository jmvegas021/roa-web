import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import type { Components } from "react-markdown";
import { withBasePath } from "@/lib/site/basePath";

export function createMarkdownComponents(slug: string): Components {
  return {
    h1: ({ children }) => (
      <h2 className="font-display mt-12 text-[clamp(1.75rem,3vw,2.25rem)] leading-[1.15] text-stone-50 text-balance">
        {children}
      </h2>
    ),
    h2: ({ children }) => (
      <h2 className="font-display mt-12 text-[clamp(1.75rem,3vw,2.25rem)] leading-[1.15] text-stone-50 text-balance">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="font-display mt-8 text-2xl text-stone-50">{children}</h3>
    ),
    p: ({ children }) => (
      <p className="mt-5 text-base leading-[1.7] text-stone-400">{children}</p>
    ),
    ul: ({ children }) => (
      <ul className="mt-5 list-disc space-y-2 pl-5 text-stone-400">{children}</ul>
    ),
    ol: ({ children }) => (
      <ol className="mt-5 list-decimal space-y-2 pl-5 text-stone-400">
        {children}
      </ol>
    ),
    li: ({ children }) => <li className="leading-[1.7]">{children}</li>,
    strong: ({ children }) => (
      <strong className="font-medium text-stone-50">{children}</strong>
    ),
    blockquote: ({ children }) => (
      <blockquote className="font-display my-8 border-l border-gold/40 pl-5 text-xl leading-snug text-stone-50">
        {children}
      </blockquote>
    ),
    hr: () => <hr className="my-10 border-stone-800" />,
    a: ({ href, children }) => <MarkdownLink href={href}>{children}</MarkdownLink>,
    img: ({ src, alt }) => (
      <MarkdownImage src={typeof src === "string" ? src : undefined} alt={alt} slug={slug} />
    ),
  };
}

function MarkdownLink({
  href,
  children,
}: {
  href?: string;
  children?: ReactNode;
}) {
  if (!href) return <span>{children}</span>;
  const isInternal = href.startsWith("/");
  if (isInternal) {
    return (
      <Link href={href} className="text-gold transition duration-200 hover:underline">
        {children}
      </Link>
    );
  }
  return (
    <a
      href={href}
      className="text-gold transition duration-200 hover:underline"
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </a>
  );
}

function MarkdownImage({
  src,
  alt,
  slug,
}: {
  src?: string;
  alt?: string;
  slug: string;
}) {
  if (!src) return null;
  const resolved = resolvePostImage(src, slug);

  return (
    <span className="relative my-10 block aspect-[16/9] overflow-hidden bg-stone-800">
      <Image
        src={withBasePath(resolved)}
        alt={alt ?? ""}
        fill
        sizes="(max-width: 768px) 100vw, 42rem"
        className="object-cover"
      />
    </span>
  );
}

function resolvePostImage(src: string, slug: string): string {
  if (src.startsWith("http://") || src.startsWith("https://") || src.startsWith("/")) {
    return src;
  }
  return `/images/blog/${slug}/${src.replace(/^\.\//, "")}`;
}
