import fs from "node:fs";
import path from "node:path";
import {
  appendFollowUps,
  loadClusterFile,
  markTopicPublished,
  serializeClusterFile,
} from "../../lib/blog-agent/cluster-store";
import { blogMarkdownPath } from "../../lib/blog-agent/commit-post";
import { CLUSTER_FILE_PATH } from "../../lib/blog-agent/constants";
import { hasRecentPublish, selectNextTopic } from "../../lib/blog-agent/select-topic";
import { loadPostSummaries } from "../../lib/blog/load-posts";
import { validatePost } from "../../lib/blog-agent/validate-post";
import { generatePost } from "./generate-post";

async function main() {
  const dryRun = process.env.DRY_RUN === "1";
  const posts = loadPostSummaries();

  if (!process.env.FORCE_TOPIC && hasRecentPublish(posts)) {
    console.log("Skipping: a post was published within the cooldown window.");
    return;
  }

  const cluster = loadClusterFile();
  const forced = process.env.FORCE_TOPIC?.trim();
  const topic = forced
    ? cluster.topics.find((item) => item.id === forced || item.title === forced) ??
      null
    : selectNextTopic(posts, cluster.topics);

  if (!topic) {
    console.log("Skipping: no queued cluster topic.");
    return;
  }

  console.log(`Drafting: ${topic.title} (${topic.id})`);
  const existingSlugs = new Set(posts.map((post) => post.slug));
  let draft = await generatePost(topic);
  let validated = validatePost(draft.markdown, { mode: "create", existingSlugs });

  if (!validated.ok) {
    console.warn("First draft failed gates:", validated.errors);
    draft = await generatePost(topic, {
      revisionErrors: validated.errors,
      previousMarkdown: draft.markdown,
    });
    validated = validatePost(draft.markdown, { mode: "create", existingSlugs });
  }

  if (!validated.ok) {
    console.error("Revision still failed:", validated.errors);
    process.exit(1);
  }

  const nextCluster = appendFollowUps(
    markTopicPublished(cluster, topic.id, validated.slug),
    draft.followUps
  );
  const markdownPath = path.join(process.cwd(), blogMarkdownPath(validated.slug));
  const clusterPath = path.join(process.cwd(), CLUSTER_FILE_PATH);

  if (dryRun) {
    console.log(`DRY_RUN canonical would be /blog/${validated.slug}`);
    console.log(validated.markdown);
    console.log("Follow-ups:", draft.followUps);
    return;
  }

  fs.mkdirSync(path.dirname(markdownPath), { recursive: true });
  fs.writeFileSync(markdownPath, validated.markdown, "utf8");
  fs.writeFileSync(clusterPath, serializeClusterFile(nextCluster), "utf8");
  console.log(`Wrote ${markdownPath}`);
  console.log(`Updated ${clusterPath}`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
