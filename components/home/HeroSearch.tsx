"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import {
  HERO_CITY_CHIPS,
  buildIdxCityResultsUrl,
} from "@/lib/content/hero-media";
import { getPublicIdxConfig } from "@/lib/idx/public-config";

export function HeroSearch() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const { subdomain } = getPublicIdxConfig();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) {
      router.push("/search");
      return;
    }
    router.push(`/search?q=${encodeURIComponent(trimmed)}`);
  }

  return (
    <div className="w-full max-w-xl">
      <form
        onSubmit={handleSubmit}
        className="group flex flex-col gap-3 sm:flex-row sm:items-stretch"
        role="search"
      >
        <label htmlFor="hero-search-q" className="sr-only">
          Search by address, city, or neighborhood
        </label>
        <input
          id="hero-search-q"
          name="q"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search by address, city, or neighborhood"
          autoComplete="street-address"
          className="min-h-12 flex-1 border border-stone-50/25 bg-stone-950/55 px-4 text-base text-stone-50 backdrop-blur-sm placeholder:text-stone-400 transition duration-200 group-focus-within:border-gold/70 focus:border-gold focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold sm:min-h-14 sm:px-5"
        />
        <button
          type="submit"
          className="inline-flex min-h-12 cursor-pointer items-center justify-center bg-gold px-7 text-xs uppercase tracking-[0.2em] text-stone-950 transition duration-200 hover:bg-accent-muted hover:scale-[1.02] active:scale-[0.99] motion-reduce:transform-none sm:min-h-14"
        >
          Search
        </button>
      </form>

      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2">
        <span className="text-[0.65rem] uppercase tracking-[0.2em] text-stone-400">
          Browse
        </span>
        {HERO_CITY_CHIPS.map((chip) => {
          const href = subdomain
            ? buildIdxCityResultsUrl(subdomain, chip.city)
            : `/search?q=${encodeURIComponent(chip.city)}`;
          return (
            <a
              key={chip.city}
              href={href}
              className="text-sm text-stone-300 transition duration-200 hover:text-gold"
              {...(subdomain
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {})}
            >
              {chip.label}
            </a>
          );
        })}
      </div>
    </div>
  );
}
