"use client";

import type { BlogSort } from "@/lib/blog/constants";
import { BLOG_SORT_LABELS, BLOG_SORT_VALUES } from "@/lib/blog/constants";

interface BlogToolbarProps {
  sort: BlogSort;
  query: string;
  onSortChange: (sort: BlogSort) => void;
  onQueryChange: (query: string) => void;
}

export function BlogToolbar({
  sort,
  query,
  onSortChange,
  onQueryChange,
}: BlogToolbarProps) {
  return (
    <div className="flex flex-col gap-8 border-t border-stone-800 py-8 lg:flex-row lg:items-end lg:justify-between">
      <div role="tablist" aria-label="Sort journal" className="flex flex-wrap gap-1">
        {BLOG_SORT_VALUES.map((value) => {
          const isActive = sort === value;
          return (
            <button
              key={value}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => onSortChange(value)}
              className={`inline-flex min-h-11 cursor-pointer items-center px-3 text-xs uppercase tracking-[0.18em] transition duration-200 ${
                isActive
                  ? "border-b border-gold text-stone-50"
                  : "border-b border-transparent text-stone-400 hover:text-stone-50"
              }`}
            >
              {BLOG_SORT_LABELS[value]}
            </button>
          );
        })}
      </div>
      <label className="block w-full max-w-sm">
        <span className="sr-only">Search journal</span>
        <input
          type="search"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="Search titles, places, topics"
          className="w-full border-0 border-b border-stone-700 bg-transparent py-3 text-base text-stone-50 placeholder:text-stone-400 transition duration-200 focus:border-gold focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
        />
      </label>
    </div>
  );
}
