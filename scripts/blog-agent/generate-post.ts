import fs from "node:fs";
import path from "node:path";
import { PLACE_HEROES, SITE_ORIGIN } from "../../lib/blog-agent/constants";
import { loadPostSummaries } from "../../lib/blog/load-posts";
import type { ClusterTopic } from "../../lib/blog-agent/types";
import { todayCentralIso } from "../../lib/blog-agent/publish-markdown";

const FOLLOWUP_MARKER = "===FOLLOWUPS===";

export interface GeneratedDraft {
  markdown: string;
  followUps: string[];
}

export async function generatePost(
  topic: ClusterTopic,
  options?: { revisionErrors?: string[]; previousMarkdown?: string }
): Promise<GeneratedDraft> {
  const apiKey = process.env.ANTHROPIC_API_KEY?.trim();
  if (!apiKey) throw new Error("ANTHROPIC_API_KEY is not set.");

  const model = process.env.ANTHROPIC_MODEL?.trim() || "claude-sonnet-4-5";
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model,
      max_tokens: 8000,
      system: buildSystemPrompt(),
      messages: [{ role: "user", content: buildUserPrompt(topic, options) }],
    }),
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Anthropic request failed: ${response.status} ${detail.slice(0, 400)}`);
  }

  const payload = (await response.json()) as {
    content?: { type: string; text?: string }[];
  };
  const text = payload.content?.find((block) => block.type === "text")?.text;
  if (!text) throw new Error("Anthropic returned an empty draft.");
  return parseGeneratedOutput(text);
}

function buildSystemPrompt(): string {
  const skillDir = path.join(process.cwd(), ".cursor/skills/publish-blog-post");
  const skill = ["voice.md", "seo.md", "frontmatter.md"]
    .map((name) => fs.readFileSync(path.join(skillDir, name), "utf8"))
    .join("\n\n");
  return `You write Kevin Shoun blog posts for ${SITE_ORIGIN}.
Return ONLY the Markdown file, then ${FOLLOWUP_MARKER} and exactly 3 follow-up topics (one per line).
No preamble. No GitHub. No invented statistics or client stories.
If a number cannot be cited with a real name, year, and URL, omit it.
${skill}`;
}

function buildUserPrompt(
  topic: ClusterTopic,
  options?: { revisionErrors?: string[]; previousMarkdown?: string }
): string {
  const posts = loadPostSummaries();
  const hero = PLACE_HEROES[topic.place] ?? PLACE_HEROES["central-texas"];
  const inventory = posts
    .map((post) => `- ${post.title} (${SITE_ORIGIN}/blog/${post.slug}) [${post.category}]`)
    .join("\n");
  const forbidden = posts.map((post) => post.slug).join(", ");

  if (options?.revisionErrors?.length && options.previousMarkdown) {
    return `Revise this draft so every gate passes. Do not change the slug unless it is invalid.

Errors:
${options.revisionErrors.map((error) => `- ${error}`).join("\n")}

Draft:
${options.previousMarkdown}`;
  }

  return `Write a new post (Mode A — create).

Topic title: ${topic.title}
Primary keyword: ${topic.primaryKeyword}
Secondary terms: ${topic.secondaries.join(", ") || "infer 4–8"}
Category: ${topic.category}
Place slug: ${topic.place}
publishedAt: "${todayCentralIso()}"
author: Kevin Shoun
heroImage: ${hero.image}
heroAlt: ${hero.alt}

Existing posts (do not duplicate; internally link 2–4 of these or evergreen pages):
${inventory || "(none yet)"}

Forbidden slugs: ${forbidden || "(none)"}

Evergreen links to mix in: /neighborhoods, /neighborhoods/${topic.place === "central-texas" ? "salado" : topic.place}, /listings, /agents/kevin-shoun, /contact.
Plain Markdown only. Filename slug must be keyword-ish and unique.`;
}

export function parseGeneratedOutput(text: string): GeneratedDraft {
  const stripped = text
    .replace(/^```(?:markdown|md)?\s*/i, "")
    .replace(/```\s*$/i, "")
    .trim();
  const marker = stripped.indexOf(FOLLOWUP_MARKER);
  const markdown = (marker === -1 ? stripped : stripped.slice(0, marker)).trim();
  const followBlock = marker === -1 ? "" : stripped.slice(marker + FOLLOWUP_MARKER.length);
  const followUps = followBlock
    .split("\n")
    .map((line) => line.replace(/^[\d.*-]+\s*/, "").trim())
    .filter((line) => line.length > 3)
    .slice(0, 3);
  if (!markdown.startsWith("---")) {
    throw new Error("Model output did not start with YAML frontmatter.");
  }
  return { markdown: `${markdown}\n`, followUps };
}
