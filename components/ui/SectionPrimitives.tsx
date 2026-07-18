import Link from "next/link";
import type { ReactNode } from "react";

interface ButtonLinkProps {
  href: string;
  children: ReactNode;
  variant?: "gold" | "ghost";
  className?: string;
}

export function ButtonLink({
  href,
  children,
  variant = "gold",
  className = "",
}: ButtonLinkProps) {
  const base =
    "inline-flex min-h-11 cursor-pointer items-center justify-center px-7 py-3 text-xs uppercase tracking-[0.2em] transition duration-200";
  const styles =
    variant === "gold"
      ? "bg-gold text-stone-950 hover:bg-accent-muted"
      : "border border-stone-50/40 text-stone-50 hover:border-gold hover:text-gold";
  const classes = `${base} ${styles} ${className}`;
  const isExternal = href.startsWith("http");

  if (isExternal) {
    return (
      <a
        href={href}
        className={classes}
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={classes}>
      {children}
    </Link>
  );
}

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  /** Use h1 for primary page titles; h2 for in-page sections. */
  as?: "h1" | "h2";
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  as = "h2",
}: SectionHeadingProps) {
  const alignment = align === "center" ? "text-center mx-auto" : "text-left";
  const HeadingTag = as;
  return (
    <div className={`max-w-2xl ${alignment}`}>
      {eyebrow ? (
        <p className="text-xs uppercase tracking-[0.24em] text-gold">{eyebrow}</p>
      ) : null}
      <HeadingTag className="font-display mt-4 text-[clamp(2.25rem,4vw,3.5rem)] leading-[1.05] text-stone-50 text-balance">
        {title}
      </HeadingTag>
      {description ? (
        <p className="mt-5 max-w-xl text-base leading-[1.7] text-stone-400">
          {description}
        </p>
      ) : null}
    </div>
  );
}
