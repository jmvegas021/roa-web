export const DEFAULT_AUTHOR = "Kevin Shoun";
export const POSTS_PER_PAGE = 9;
export const BLOG_CONTENT_DIR = "content/blog";

export const BLOG_SORT_VALUES = ["new", "relevant", "hottest"] as const;
export type BlogSort = (typeof BLOG_SORT_VALUES)[number];

export const BLOG_SORT_LABELS: Record<BlogSort, string> = {
  new: "New",
  relevant: "Relevant",
  hottest: "Hottest",
};
