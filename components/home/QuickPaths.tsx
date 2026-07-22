import Link from "next/link";
import { RevealOnScroll } from "@/components/motion/RevealOnScroll";

const PATHS = [
  { href: "/search", label: "Home Search" },
  { href: "/#valuation", label: "Home Valuation" },
  { href: "/contact", label: "Contact" },
] as const;

/** Templeton-style quick path strip — text links only, no cards. */
export function QuickPaths() {
  return (
    <section
      aria-label="Quick paths"
      className="border-y border-stone-800/80 bg-stone-950 px-6 py-8 lg:px-10"
    >
      <RevealOnScroll>
        <nav className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-10 gap-y-4">
          {PATHS.map((path) => (
            <Link
              key={path.href}
              href={path.href}
              className="text-xs uppercase tracking-[0.22em] text-stone-300 transition duration-200 hover:text-gold"
            >
              {path.label}
            </Link>
          ))}
        </nav>
      </RevealOnScroll>
    </section>
  );
}
