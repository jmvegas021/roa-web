export type BlogCategory =
  | "guides"
  | "neighborhoods"
  | "market"
  | "relocation";

export interface BlogFrontmatter {
  title: string;
  description: string;
  slug: string;
  publishedAt: string;
  updatedAt?: string;
  author: string;
  tags: string[];
  category: BlogCategory;
  featured: boolean;
  priority: number;
  heroImage: string;
  heroAlt: string;
  keywords: string[];
}

export interface BlogPost extends BlogFrontmatter {
  body: string;
  excerpt: string;
}

export type BlogPostSummary = Omit<BlogPost, "body">;

export interface BlogFeedItem {
  slug: string;
  title: string;
  url: string;
  tags: string[];
  category: BlogCategory;
  publishedAt: string;
  updatedAt: string;
  description: string;
}

export interface BlogFaqItem {
  question: string;
  answer: string;
}

export const CATEGORY_LABELS: Record<BlogCategory, string> = {
  guides: "Guide",
  neighborhoods: "Neighborhoods",
  market: "Market",
  relocation: "Relocation",
};
