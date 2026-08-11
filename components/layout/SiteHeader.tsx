import Link from "next/link";
import { BrandLockup } from "@/components/brand/BrandLogo";

const NAV = [
  { href: "/listings", label: "Listings" },
  { href: "/search", label: "Search" },
  { href: "/neighborhoods", label: "Neighborhoods" },
  { href: "/agents", label: "Agents" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

interface SiteHeaderProps {
  transparent?: boolean;
}

export function SiteHeader({ transparent = false }: SiteHeaderProps) {
  return (
    <header
      className={`absolute inset-x-0 top-0 z-50 ${
        transparent ? "bg-transparent" : "bg-stone-950/90 backdrop-blur-sm"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-4 lg:px-10 lg:py-5">
        <BrandLockup
          logoWidth={300}
          priority
          className="max-w-[min(100%,18rem)] sm:max-w-[min(100%,20rem)] lg:max-w-none"
        />

        <nav aria-label="Primary" className="hidden items-center gap-1 lg:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="inline-flex min-h-11 cursor-pointer items-center px-3 text-sm tracking-wide text-stone-400 transition duration-200 hover:text-stone-50"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <Link
          href="/contact"
          className="inline-flex min-h-11 shrink-0 cursor-pointer items-center border border-gold/50 px-5 text-xs uppercase tracking-[0.18em] text-gold transition duration-200 hover:bg-gold hover:text-stone-950"
        >
          Private consult
        </Link>
      </div>

      <nav
        aria-label="Mobile"
        className="flex gap-1 overflow-x-auto border-t border-stone-800/80 px-4 py-1 lg:hidden"
      >
        {NAV.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="inline-flex min-h-11 shrink-0 cursor-pointer items-center px-3 text-xs uppercase tracking-[0.16em] text-stone-400 transition duration-200 hover:text-stone-50"
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
