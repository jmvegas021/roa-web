import { z } from "zod";
import { MAX_MARKDOWN_CHARS } from "./constants";

export const publishArgsSchema = z.object({
  markdown: z.string().min(20).max(MAX_MARKDOWN_CHARS),
  mode: z.enum(["create", "edit"]).optional(),
  followUps: z.array(z.string().min(3).max(160)).max(5).optional(),
  topicId: z.string().min(1).max(80).optional(),
});

export const slugArgsSchema = z.object({
  slug: z.string().min(1).max(80),
});

const packedImageSchema = z
  .object({
    data: z.string().min(32),
    mimeType: z.string().min(8).max(40).optional(),
    mediaType: z.string().min(8).max(40).optional(),
    type: z.string().optional(),
  })
  .optional();

export const uploadArgsSchema = z
  .object({
    slug: z.string().min(1).max(80),
    data: z.string().min(32).optional(),
    imageUrl: z
      .string()
      .max(2000)
      .refine((value) => {
        try {
          const parsed = new URL(value);
          return parsed.protocol === "https:" && !parsed.username && !parsed.password;
        } catch {
          return false;
        }
      }, "imageUrl must be a public https URL with no credentials.")
      .optional(),
    file: packedImageSchema,
    image: packedImageSchema,
    mediaType: z.string().min(8).max(40).optional(),
    filename: z.string().min(6).max(80).optional(),
    alt: z.string().min(8).max(180).optional(),
    setAsHero: z.boolean().optional(),
  })
  .superRefine((value, ctx) => {
    const sources = [value.data, value.imageUrl, value.file?.data, value.image?.data].filter(Boolean);
    if (sources.length === 0) {
      ctx.addIssue({
        code: "custom",
        message:
          "Pass imageUrl, or call create_blog_image_upload and PUT the local file. Do not type large base64.",
      });
    }
    if (sources.length > 1) {
      ctx.addIssue({
        code: "custom",
        message: "Pass one image source only.",
      });
    }
  });

export const createUploadArgsSchema = z
  .object({
    slug: z.string().min(1).max(80),
    filename: z.string().min(6).max(80).optional(),
    alt: z.string().min(8).max(180).optional(),
    setAsHero: z.boolean().optional(),
  })
  .superRefine((value, ctx) => {
    if (value.setAsHero && (!value.alt || value.alt.trim().length < 8)) {
      ctx.addIssue({
        code: "custom",
        message: "setAsHero requires alt text of at least 8 characters.",
      });
    }
  });

export const setHeroArgsSchema = z.object({
  slug: z.string().min(1).max(80),
  path: z.string().min(8).max(160),
  alt: z.string().min(8).max(180),
});

export const deleteImageArgsSchema = z.object({
  slug: z.string().min(1).max(80),
  filename: z.string().min(6).max(80),
  confirm: z.literal(true),
});

export const deletePostArgsSchema = z.object({
  slug: z.string().min(1).max(80),
  confirm: z.literal(true),
});

const emptySchema = {
  type: "object" as const,
  properties: {},
  additionalProperties: false,
};

export const MCP_TOOLS = [
  {
    name: "list_blog_posts",
    description:
      "List live Kevin Shoun blog posts and the next suggested cluster topic.",
    inputSchema: emptySchema,
  },
  {
    name: "suggest_next_topic",
    description: "Return the next unpublished cluster topic.",
    inputSchema: emptySchema,
  },
  {
    name: "get_blog_post",
    description:
      "Fetch the raw Markdown for an existing post by slug. Use before editing. Never scrape HTML.",
    inputSchema: {
      type: "object",
      properties: {
        slug: { type: "string", description: "Post slug" },
      },
      required: ["slug"],
      additionalProperties: false,
    },
  },
  {
    name: "publish_blog_post",
    description:
      "Create or edit a post. Pass the full Markdown file. mode=edit when the slug already exists.",
    inputSchema: {
      type: "object",
      properties: {
        markdown: { type: "string" },
        mode: { type: "string", enum: ["create", "edit"] },
        followUps: { type: "array", items: { type: "string" } },
        topicId: { type: "string" },
      },
      required: ["markdown"],
      additionalProperties: false,
    },
  },
  {
    name: "delete_blog_post",
    description:
      "Delete a post and its uploaded images. Requires confirm=true. Cannot be undone.",
    inputSchema: {
      type: "object",
      properties: {
        slug: { type: "string" },
        confirm: { type: "boolean" },
      },
      required: ["slug", "confirm"],
      additionalProperties: false,
    },
  },
  {
    name: "list_hero_images",
    description:
      "Stock neighborhood and listing photos already on the site. Use when Kevin has no new file.",
    inputSchema: emptySchema,
  },
  {
    name: "list_post_images",
    description: "Images already uploaded under /images/blog/{slug}/.",
    inputSchema: {
      type: "object",
      properties: { slug: { type: "string" } },
      required: ["slug"],
      additionalProperties: false,
    },
  },
  {
    name: "upload_blog_image",
    description:
      "Commit a webp/jpeg/png into public/images/blog/{slug}/ on GitHub. Prefer imageUrl (public https). For a local Cowork/Desktop file, call create_blog_image_upload and PUT the bytes — do not type base64. Optional setAsHero+alt. Max ~1.2MB.",
    inputSchema: {
      type: "object",
      properties: {
        slug: { type: "string" },
        imageUrl: {
          type: "string",
          description:
            "Public https URL. The server downloads it and commits it. Use this for Library of Congress, Wikimedia, or any CDN.",
        },
        data: {
          type: "string",
          description: "Only if the MCP client attached the file. Never type base64 yourself.",
        },
        filename: { type: "string", description: "hero.webp or lake-shore.jpg" },
        alt: { type: "string" },
        setAsHero: { type: "boolean" },
      },
      required: ["slug"],
      additionalProperties: false,
    },
  },
  {
    name: "create_blog_image_upload",
    description:
      "Start a local-file upload. Returns a putUrl. PUT the raw image bytes (curl -T file putUrl). Commits to public/images/blog/{slug}/. Use this instead of typing base64. Optional setAsHero+alt.",
    inputSchema: {
      type: "object",
      properties: {
        slug: { type: "string" },
        filename: { type: "string" },
        alt: { type: "string" },
        setAsHero: { type: "boolean" },
      },
      required: ["slug"],
      additionalProperties: false,
    },
  },
  {
    name: "set_post_hero",
    description:
      "Point an existing post hero at a site path from list_hero_images or list_post_images. Updates alt and updatedAt.",
    inputSchema: {
      type: "object",
      properties: {
        slug: { type: "string" },
        path: { type: "string" },
        alt: { type: "string" },
      },
      required: ["slug", "path", "alt"],
      additionalProperties: false,
    },
  },
  {
    name: "delete_blog_image",
    description:
      "Delete one uploaded image. Requires confirm=true. If it is the current hero, falls back to the Salado neighborhood photo.",
    inputSchema: {
      type: "object",
      properties: {
        slug: { type: "string" },
        filename: { type: "string" },
        confirm: { type: "boolean" },
      },
      required: ["slug", "filename", "confirm"],
      additionalProperties: false,
    },
  },
];
