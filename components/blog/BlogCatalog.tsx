"use client";

import { useQueryStates } from "nuqs";
import { filterPostsByQuery, paginatePosts } from "@/lib/blog/filter-posts";
import { blogSearchParsers } from "@/lib/blog/search-params";
import { sortPosts } from "@/lib/blog/sort-posts";
import type { BlogPostSummary } from "@/lib/blog/types";
import { BlogPagination } from "./BlogPagination";
import { BlogPostRow } from "./BlogPostRow";
import { BlogToolbar } from "./BlogToolbar";

interface BlogCatalogProps {
  posts: BlogPostSummary[];
}

export function BlogCatalog({ posts }: BlogCatalogProps) {
  const [{ sort, q, page }, setParams] = useQueryStates(blogSearchParsers, {
    history: "push",
  });

  const filtered = filterPostsByQuery(posts, q);
  const sorted = sortPosts(filtered, sort, q);
  const paginated = paginatePosts(sorted, page);

  return (
    <div>
      <BlogToolbar
        sort={sort}
        query={q}
        onSortChange={(next) => setParams({ sort: next, page: 1 })}
        onQueryChange={(next) => setParams({ q: next || null, page: 1 })}
      />
      {paginated.total === 0 ? (
        <p className="border-t border-stone-800 py-16 text-base text-stone-400">
          No blog posts match that search. Try a town, a tag, or a quieter
          phrase.
        </p>
      ) : (
        <div>
          {paginated.items.map((post, index) => (
            <BlogPostRow key={post.slug} post={post} index={index} />
          ))}
        </div>
      )}
      <BlogPagination
        page={paginated.page}
        totalPages={paginated.totalPages}
        onPageChange={(next) => setParams({ page: next })}
      />
    </div>
  );
}
