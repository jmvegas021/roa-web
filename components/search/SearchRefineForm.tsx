"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { buildOnSiteSearchPath } from "@/lib/idx/search-urls";

interface SearchRefineFormProps {
  initialQuery?: string;
}

/** On-site refine form — navigates within /search only. */
export function SearchRefineForm({ initialQuery = "" }: SearchRefineFormProps) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    router.push(buildOnSiteSearchPath(query));
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-3 sm:flex-row sm:items-stretch"
      role="search"
    >
      <label htmlFor="search-refine-q" className="sr-only">
        Refine search by address or city
      </label>
      <input
        id="search-refine-q"
        name="q"
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Address, street, or city"
        autoComplete="street-address"
        className="min-h-12 flex-1 border border-stone-700 bg-stone-950 px-4 text-base text-stone-50 placeholder:text-stone-400 focus:border-gold focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
      />
      <button
        type="submit"
        className="inline-flex min-h-12 cursor-pointer items-center justify-center bg-gold px-7 text-xs uppercase tracking-[0.2em] text-stone-950 transition duration-200 hover:bg-accent-muted"
      >
        Search
      </button>
    </form>
  );
}
