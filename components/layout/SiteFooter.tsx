import Link from "next/link";
import { BrandLockup } from "@/components/brand/BrandLogo";
import { SITE } from "@/lib/content/team";

export function SiteFooter() {
  return (
    <footer className="border-t border-stone-800 bg-stone-900">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-16 lg:grid-cols-[1.4fr_1fr_1fr] lg:px-10 lg:py-20">
        <div>
          <BrandLockup logoWidth={340} />
          <p className="mt-5 max-w-sm text-base leading-relaxed text-stone-400">
            Quiet luxury representation across Salado, Belton, Temple,
            Georgetown, and Central Texas. By appointment.
          </p>
        </div>

        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-stone-400">
            Explore
          </p>
          <ul className="mt-5 space-y-1 text-sm text-stone-50">
            <li>
              <Link
                href="/listings"
                className="inline-flex min-h-11 cursor-pointer items-center transition duration-200 hover:text-gold"
              >
                Featured collection
              </Link>
            </li>
            <li>
              <Link
                href="/search"
                className="inline-flex min-h-11 cursor-pointer items-center transition duration-200 hover:text-gold"
              >
                MLS search
              </Link>
            </li>
            <li>
              <Link
                href="/neighborhoods"
                className="inline-flex min-h-11 cursor-pointer items-center transition duration-200 hover:text-gold"
              >
                Neighborhoods
              </Link>
            </li>
            <li>
              <Link
                href="/blog"
                className="inline-flex min-h-11 cursor-pointer items-center transition duration-200 hover:text-gold"
              >
                Journal
              </Link>
            </li>
            <li>
              <Link
                href="/agents/kevin-shoun"
                className="inline-flex min-h-11 cursor-pointer items-center transition duration-200 hover:text-gold"
              >
                Kevin Shoun
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-stone-400">
            Contact
          </p>
          <ul className="mt-5 space-y-1 text-sm text-stone-50">
            <li>
              <a
                href={`tel:${SITE.phone}`}
                className="inline-flex min-h-11 cursor-pointer items-center transition duration-200 hover:text-gold"
              >
                {SITE.phone}
              </a>
            </li>
            <li>
              <a
                href={`mailto:${SITE.email}`}
                className="inline-flex min-h-11 cursor-pointer items-center transition duration-200 hover:text-gold"
              >
                {SITE.email}
              </a>
            </li>
            <li className="pt-2 text-stone-400">{SITE.address}</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-stone-800 px-6 py-6 text-center text-xs leading-relaxed text-stone-400 lg:px-10">
        <p>
          © {new Date().getFullYear()} {SITE.brand}. All rights reserved. Equal
          Housing Opportunity.
        </p>
        <p className="mt-2">
          Listing information provided by IDX Broker / participating MLSs. All
          data deemed reliable but not guaranteed.
        </p>
      </div>
    </footer>
  );
}
