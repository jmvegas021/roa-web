import fs from "node:fs";
import path from "node:path";
import { NEIGHBORHOODS } from "@/lib/content/neighborhoods";
import type { BlogCategory } from "@/lib/blog/types";
import { CLUSTER_FILE_PATH } from "./constants";
import type { ClusterFile } from "./types";

const clusterAbsolutePath = path.join(process.cwd(), CLUSTER_FILE_PATH);

export function loadClusterFile(): ClusterFile {
  const raw = fs.readFileSync(clusterAbsolutePath, "utf8");
  const parsed = JSON.parse(raw) as ClusterFile;
  if (!Array.isArray(parsed.topics)) return { topics: [] };
  return parsed;
}

export function serializeClusterFile(cluster: ClusterFile): string {
  return `${JSON.stringify(cluster, null, 2)}\n`;
}

export function markTopicPublished(
  cluster: ClusterFile,
  topicId: string,
  slug: string
): ClusterFile {
  return {
    topics: cluster.topics.map((topic) =>
      topic.id === topicId
        ? { ...topic, status: "published", publishedSlug: slug }
        : topic
    ),
  };
}

export function appendFollowUps(
  cluster: ClusterFile,
  followUps: string[]
): ClusterFile {
  const existingIds = new Set(cluster.topics.map((topic) => topic.id));
  const next = [...cluster.topics];

  for (const line of followUps.map((item) => item.trim()).filter(Boolean)) {
    const id = slugifyTopicId(line);
    if (!id || existingIds.has(id)) continue;
    if (next.some((topic) => titlesMatch(topic.title, line))) continue;
    existingIds.add(id);
    next.push({
      id,
      title: trimTitle(line),
      primaryKeyword: trimTitle(line).slice(0, 80),
      secondaries: [],
      category: inferCategory(line),
      place: inferPlace(line),
      status: "queued",
      source: "follow-up",
    });
  }

  return { topics: next };
}

export function slugifyTopicId(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function titlesMatch(left: string, right: string): boolean {
  return slugifyTopicId(left) === slugifyTopicId(right);
}

function trimTitle(value: string): string {
  return value.replace(/^[\d.]+[\s)-]*/, "").trim().slice(0, 120);
}

function inferPlace(text: string): string {
  const haystack = text.toLowerCase();
  const match = NEIGHBORHOODS.find(
    (neighborhood) =>
      haystack.includes(neighborhood.slug) ||
      haystack.includes(neighborhood.name.toLowerCase())
  );
  return match?.slug ?? "central-texas";
}

function inferCategory(text: string): BlogCategory {
  const haystack = text.toLowerCase();
  if (/pcs|military|fort cavazos|reloc|moving to/.test(haystack)) {
    return "relocation";
  }
  if (/market|rates|pricing|conditions/.test(haystack)) return "market";
  if (/living|neighborhood|downtown|lake|square/.test(haystack)) {
    return "neighborhoods";
  }
  return "guides";
}
