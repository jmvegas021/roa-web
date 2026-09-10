import matter from "gray-matter";
import { parseFrontmatter } from "@/lib/blog/frontmatter";

function isoDate(value: unknown): string | undefined {
  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toISOString().slice(0, 10);
  }
  return undefined;
}

export function patchFrontmatter(
  markdown: string,
  patch: Record<string, string | string[] | boolean | number>
): string {
  const parsed = matter(markdown);
  const next = { ...parsed.data, ...patch };
  const publishedAt = isoDate(next.publishedAt) ?? String(next.publishedAt ?? "");
  const updatedAt = isoDate(next.updatedAt) ?? (typeof next.updatedAt === "string" ? next.updatedAt : undefined);
  const slug = typeof next.slug === "string" ? next.slug : "";
  const rebuilt = matter.stringify(parsed.content.trimStart(), {
    ...next,
    publishedAt,
    ...(updatedAt ? { updatedAt } : {}),
  });
  const { data } = matter(rebuilt);
  if (!parseFrontmatter(data, slug)) {
    throw new Error("Patched frontmatter no longer matches the site schema.");
  }
  return rebuilt.endsWith("\n") ? rebuilt : `${rebuilt}\n`;
}
