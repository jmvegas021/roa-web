import { loadPostSummaries } from "@/lib/blog/load-posts";
import { PRODUCTION_SITE_URL } from "@/lib/site/siteUrl";
import {
  appendFollowUps,
  loadClusterFile,
  markTopicPublished,
  serializeClusterFile,
} from "./cluster-store";
import {
  blogMarkdownPath,
  commitAllowlistedFiles,
  listGithubBlogSlugs,
} from "./commit-post";
import { CLUSTER_FILE_PATH } from "./constants";
import { selectNextTopic } from "./select-topic";
import type { GithubRepoFile, PublishMode } from "./types";
import { validatePost } from "./validate-post";

export interface PublishMarkdownInput {
  markdown: string;
  mode: PublishMode;
  followUps?: string[];
  topicId?: string;
}

export interface PublishMarkdownResult {
  canonicalUrl: string;
  slug: string;
  title: string;
  sha: string;
  files: string[];
}

export function todayCentralIso(now = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Chicago",
  }).format(now);
}

export async function publishValidatedMarkdown(
  input: PublishMarkdownInput
): Promise<
  | { ok: true; result: PublishMarkdownResult }
  | { ok: false; status: number; errors: string[] }
> {
  const githubSlugs = await listGithubBlogSlugs();
  const diskSlugs = loadPostSummaries().map((post) => post.slug);
  const existingSlugs = new Set([...githubSlugs, ...diskSlugs]);

  const validated = validatePost(input.markdown, {
    mode: input.mode,
    existingSlugs,
    today: todayCentralIso(),
  });
  if (!validated.ok) return { ok: false, status: 422, errors: validated.errors };

  const files: GithubRepoFile[] = [
    { path: blogMarkdownPath(validated.slug), content: validated.markdown },
  ];

  const cluster = loadClusterFile();
  const topicId =
    input.topicId ??
    cluster.topics.find(
      (topic) =>
        topic.status === "queued" &&
        topic.title.toLowerCase() === validated.title.toLowerCase()
    )?.id;
  let nextCluster = cluster;
  if (topicId) nextCluster = markTopicPublished(nextCluster, topicId, validated.slug);
  if (input.followUps?.length) {
    nextCluster = appendFollowUps(nextCluster, input.followUps);
  }
  if (JSON.stringify(nextCluster) !== JSON.stringify(cluster)) {
    files.push({
      path: CLUSTER_FILE_PATH,
      content: serializeClusterFile(nextCluster),
    });
  }

  const message =
    input.mode === "edit"
      ? `Update blog post: ${validated.title}.`
      : `Publish blog post: ${validated.title}.`;

  const committed = await commitAllowlistedFiles(files, message);
  return {
    ok: true,
    result: {
      canonicalUrl: `${PRODUCTION_SITE_URL}/blog/${validated.slug}`,
      slug: validated.slug,
      title: validated.title,
      sha: committed.sha,
      files: committed.files,
    },
  };
}

export async function suggestedTopicPayload() {
  const posts = loadPostSummaries();
  const githubSlugs = await listGithubBlogSlugs().catch(() => [] as string[]);
  const topic = selectNextTopic(posts, loadClusterFile().topics, githubSlugs);
  return {
    suggested: topic,
    liveCount: posts.length,
    posts: posts.map((post) => ({
      slug: post.slug,
      title: post.title,
      url: `${PRODUCTION_SITE_URL}/blog/${post.slug}`,
      category: post.category,
      publishedAt: post.publishedAt,
    })),
  };
}
