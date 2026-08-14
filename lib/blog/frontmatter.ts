import { z } from "zod";
import { DEFAULT_AUTHOR } from "./constants";
import type { BlogFrontmatter } from "./types";

const isoDate = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD");

export const blogFrontmatterSchema = z.object({
  title: z.string().min(8).max(120),
  description: z.string().min(40).max(180),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  publishedAt: isoDate,
  updatedAt: isoDate.optional(),
  author: z.string().min(2).default(DEFAULT_AUTHOR),
  tags: z.array(z.string().min(1)).min(1),
  category: z.enum(["guides", "neighborhoods", "market", "relocation"]),
  featured: z.boolean().default(false),
  priority: z.number().int().min(1).max(10).default(5),
  heroImage: z.string().min(1),
  heroAlt: z.string().min(8),
  keywords: z.array(z.string().min(1)).default([]),
});

export function parseFrontmatter(
  data: unknown,
  filenameSlug: string
): BlogFrontmatter | null {
  const parsed = blogFrontmatterSchema.safeParse(data);
  if (!parsed.success) {
    console.error(
      `[blog] invalid frontmatter in ${filenameSlug}.md`,
      parsed.error.flatten()
    );
    return null;
  }
  if (parsed.data.slug !== filenameSlug) {
    console.error(
      `[blog] slug mismatch in ${filenameSlug}.md (frontmatter: ${parsed.data.slug})`
    );
    return null;
  }
  return parsed.data;
}
