import type { BlogCategory, BlogFrontmatter } from "@/lib/blog/types";

export type ClusterStatus = "queued" | "published";
export type ClusterSource = "seed" | "follow-up";
export type PublishMode = "create" | "edit";

export interface ClusterTopic {
  id: string;
  title: string;
  primaryKeyword: string;
  secondaries: string[];
  category: BlogCategory;
  place: string;
  status: ClusterStatus;
  source: ClusterSource;
  publishedSlug?: string;
}

export interface ClusterFile {
  topics: ClusterTopic[];
}

export interface ValidateSuccess {
  ok: true;
  slug: string;
  title: string;
  markdown: string;
  frontmatter: BlogFrontmatter;
  body: string;
}

export interface ValidateFailure {
  ok: false;
  errors: string[];
}

export type ValidateResult = ValidateSuccess | ValidateFailure;

export interface GithubRepoFile {
  path: string;
  content?: string;
  encoding?: "utf-8" | "base64";
  delete?: boolean;
}

export interface PlaceHero {
  image: string;
  alt: string;
}
