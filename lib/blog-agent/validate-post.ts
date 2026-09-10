import matter from "gray-matter";
import { extractFaq } from "@/lib/blog/extract-faq";
import { parseFrontmatter } from "@/lib/blog/frontmatter";
import {
  BANNED_PROOF_PATTERNS,
  INTERNAL_LINK_PATTERN,
  MAX_FAQ_COUNT,
  MAX_H2_COUNT,
  MAX_INTERNAL_LINKS,
  MAX_MARKDOWN_CHARS,
  MAX_WORD_COUNT,
  MIN_FAQ_COUNT,
  MIN_H2_COUNT,
  MIN_INTERNAL_LINKS,
  MIN_WORD_COUNT,
} from "./constants";
import type { PublishMode, ValidateResult } from "./types";

export function validatePost(
  markdown: string,
  options: {
    mode: PublishMode;
    existingSlugs: Set<string>;
    today?: string;
  }
): ValidateResult {
  const errors: string[] = [];
  if (!markdown?.trim()) {
    return { ok: false, errors: ["Markdown is empty."] };
  }
  if (markdown.length > MAX_MARKDOWN_CHARS) {
    return { ok: false, errors: ["Markdown exceeds the 200kb publish limit."] };
  }

  const { data, content } = matter(markdown);
  const body = content.trim();
  const slugGuess =
    typeof data.slug === "string" ? data.slug : "unknown-slug";
  const frontmatter = parseFrontmatter(data, slugGuess);

  if (!frontmatter) {
    errors.push(
      "Frontmatter failed the site schema (title, description, slug, dates, tags, category, hero, keywords)."
    );
    return { ok: false, errors };
  }

  if (options.mode === "create" && options.existingSlugs.has(frontmatter.slug)) {
    errors.push(
      `Slug "${frontmatter.slug}" already exists. Switch to edit instead of creating a duplicate.`
    );
  }
  if (options.mode === "edit" && !options.existingSlugs.has(frontmatter.slug)) {
    errors.push(
      `Slug "${frontmatter.slug}" is not a live post. Create it first, or fix the slug.`
    );
  }

  if (frontmatter.author !== "Kevin Shoun") {
    errors.push('author must be "Kevin Shoun".');
  }
  if (frontmatter.keywords.length < 4) {
    errors.push("keywords must include at least 4 secondary phrases.");
  }
  if (!frontmatter.heroImage.startsWith("/images/")) {
    errors.push("heroImage must be a site-root path under /images/.");
  }

  if (/^#\s+/m.test(body)) {
    errors.push("Do not add a body # heading; the title is the H1.");
  }

  const faq = extractFaq(body);
  if (options.mode === "create") {
    const h2Count = (body.match(/^##\s+(?!#).+$/gm) || []).length;
    if (h2Count < MIN_H2_COUNT || h2Count > MAX_H2_COUNT) {
      errors.push(
        `Need ${MIN_H2_COUNT}–${MAX_H2_COUNT} ## headings (found ${h2Count}). FAQ counts as one.`
      );
    }
    if (faq.length < MIN_FAQ_COUNT || faq.length > MAX_FAQ_COUNT) {
      errors.push(
        `Need ${MIN_FAQ_COUNT}–${MAX_FAQ_COUNT} FAQ questions under ## FAQ or ## Frequently asked questions (found ${faq.length}).`
      );
    }
    const linkCount = countInternalLinks(body);
    if (linkCount < MIN_INTERNAL_LINKS || linkCount > MAX_INTERNAL_LINKS) {
      errors.push(
        `Need ${MIN_INTERNAL_LINKS}–${MAX_INTERNAL_LINKS} internal links in prose (found ${linkCount}).`
      );
    }
    const words = countWords(body);
    if (words < MIN_WORD_COUNT || words > MAX_WORD_COUNT) {
      errors.push(
        `Create posts must be ${MIN_WORD_COUNT}–${MAX_WORD_COUNT} words (found ${words}).`
      );
    }
  } else if (faq.length > 0 && (faq.length < MIN_FAQ_COUNT || faq.length > MAX_FAQ_COUNT)) {
    errors.push(
      `Existing FAQ must stay at ${MIN_FAQ_COUNT}–${MAX_FAQ_COUNT} questions (found ${faq.length}).`
    );
  }

  for (const pattern of BANNED_PROOF_PATTERNS) {
    if (pattern.test(body) || pattern.test(frontmatter.title)) {
      errors.push(`Remove banned phrasing matching ${pattern}.`);
    }
  }

  if (options.mode === "edit") {
    if (!frontmatter.updatedAt) {
      errors.push("Edits must set updatedAt to today (YYYY-MM-DD).");
    } else if (options.today && frontmatter.updatedAt !== options.today) {
      errors.push(`updatedAt must be "${options.today}".`);
    }
  }

  if (errors.length > 0) return { ok: false, errors };

  return {
    ok: true,
    slug: frontmatter.slug,
    title: frontmatter.title,
    markdown: markdown.endsWith("\n") ? markdown : `${markdown}\n`,
    frontmatter,
    body,
  };
}

function countWords(body: string): number {
  return body.split(/\s+/).filter(Boolean).length;
}

function countInternalLinks(body: string): number {
  const hrefs = new Set<string>();
  const pattern = new RegExp(INTERNAL_LINK_PATTERN.source, "g");
  for (const match of body.matchAll(pattern)) {
    if (match[1]) hrefs.add(match[1]);
  }
  return hrefs.size;
}
