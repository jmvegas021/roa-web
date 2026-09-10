import { z } from "zod";
import { readGithubFile } from "@/lib/blog-agent/commit-post";
import { MAX_MARKDOWN_CHARS } from "@/lib/blog-agent/constants";
import { listHeroAssets } from "@/lib/blog-agent/hero-catalog";
import {
  publishValidatedMarkdown,
  suggestedTopicPayload,
} from "@/lib/blog-agent/publish-markdown";

interface JsonRpcRequest {
  jsonrpc?: string;
  id?: string | number | null;
  method?: string;
  params?: {
    name?: string;
    arguments?: Record<string, unknown>;
    protocolVersion?: string;
  };
}

const publishArgsSchema = z.object({
  markdown: z.string().min(20).max(MAX_MARKDOWN_CHARS),
  mode: z.enum(["create", "edit"]).optional(),
  followUps: z.array(z.string().min(3).max(160)).max(5).optional(),
  topicId: z.string().min(1).max(80).optional(),
});

const TOOLS = [
  {
    name: "list_blog_posts",
    description:
      "List live Kevin Shoun blog posts and the next suggested cluster topic. Use before drafting to avoid duplicates.",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
  },
  {
    name: "suggest_next_topic",
    description:
      "Return the next unpublished cluster topic for an autonomous or scheduled post.",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
  },
  {
    name: "list_hero_images",
    description:
      "List on-site hero images already deployed. Set heroImage to one of these paths and copy the matching alt. Do not invent filenames, ask the user for a URL, or block publish for a new photo.",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
  },
  {
    name: "get_blog_post",
    description:
      "Fetch the raw Markdown source for an existing post by slug. Use this before editing. Never scrape rendered HTML.",
    inputSchema: {
      type: "object",
      properties: {
        slug: {
          type: "string",
          description: "Post slug, e.g. buying-in-salado-vs-belton",
        },
      },
      required: ["slug"],
      additionalProperties: false,
    },
  },
  {
    name: "publish_blog_post",
    description:
      "Validate and publish a full Markdown blog post to kevinshoun.com (commits content/blog/{slug}.md on main). Do not use GitHub MCP.",
    inputSchema: {
      type: "object",
      properties: {
        markdown: {
          type: "string",
          description: "Full post including YAML frontmatter",
        },
        mode: {
          type: "string",
          enum: ["create", "edit"],
          description: "create is default; use edit when updating a live slug",
        },
        followUps: {
          type: "array",
          items: { type: "string" },
          description: "Optional 3 cluster follow-up topics",
        },
        topicId: {
          type: "string",
          description: "Optional cluster.json topic id to mark published",
        },
      },
      required: ["markdown"],
      additionalProperties: false,
    },
  },
];

export async function handleMcpRequest(body: JsonRpcRequest): Promise<{
  status: number;
  payload: unknown;
}> {
  if (body.jsonrpc !== "2.0" || !body.method) {
    return rpcError(body.id, -32600, "Invalid Request");
  }

  if (body.id === undefined || body.id === null) {
    return { status: 202, payload: null };
  }

  switch (body.method) {
    case "initialize":
      return {
        status: 200,
        payload: {
          jsonrpc: "2.0",
          id: body.id,
          result: {
            protocolVersion: body.params?.protocolVersion ?? "2025-03-26",
            capabilities: { tools: { listChanged: false } },
            serverInfo: { name: "kevin-blog", version: "1.0.0" },
          },
        },
      };
    case "ping":
    case "notifications/initialized":
      return { status: 200, payload: { jsonrpc: "2.0", id: body.id, result: {} } };
    case "tools/list":
      return {
        status: 200,
        payload: { jsonrpc: "2.0", id: body.id, result: { tools: TOOLS } },
      };
    case "tools/call":
      return callTool(body);
    default:
      return rpcError(body.id, -32601, `Unknown method: ${body.method}`);
  }
}

async function callTool(body: JsonRpcRequest): Promise<{
  status: number;
  payload: unknown;
}> {
  const name = body.params?.name;
  const args = body.params?.arguments ?? {};
  try {
    if (name === "list_blog_posts") {
      const payload = await suggestedTopicPayload();
      return toolText(body.id, JSON.stringify(payload, null, 2));
    }
    if (name === "suggest_next_topic") {
      const suggested = (await suggestedTopicPayload()).suggested;
      return toolText(
        body.id,
        suggested
          ? JSON.stringify(suggested, null, 2)
          : "No queued cluster topics remain."
      );
    }
    if (name === "list_hero_images") {
      return toolText(
        body.id,
        JSON.stringify(
          {
            note: "These files already exist on kevinshoun.com. Point heroImage at path. Never invent /images/blog/{slug}/ files unless this list includes them.",
            images: listHeroAssets(),
          },
          null,
          2
        )
      );
    }
    if (name === "get_blog_post") {
      const slug = String(args.slug ?? "").trim();
      if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
        return toolText(body.id, "Invalid slug.", true);
      }
      const markdown = await readGithubFile(`content/blog/${slug}.md`);
      if (!markdown) return toolText(body.id, `No post found for ${slug}.`, true);
      return toolText(body.id, markdown);
    }
    if (name === "publish_blog_post") {
      const parsed = publishArgsSchema.safeParse(args);
      if (!parsed.success) {
        return toolText(body.id, parsed.error.message, true);
      }
      const published = await publishValidatedMarkdown({
        markdown: parsed.data.markdown,
        mode: parsed.data.mode ?? "create",
        followUps: parsed.data.followUps,
        topicId: parsed.data.topicId,
      });
      if (!published.ok) {
        return toolText(
          body.id,
          `Publish failed:\n${published.errors.map((error) => `- ${error}`).join("\n")}`,
          true
        );
      }
      return toolText(body.id, JSON.stringify(published.result, null, 2));
    }
    return toolText(body.id, `Unknown tool: ${name}`, true);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Publish failed.";
    return toolText(body.id, message, true);
  }
}

function toolText(
  id: JsonRpcRequest["id"],
  text: string,
  isError = false
): { status: number; payload: unknown } {
  return {
    status: 200,
    payload: {
      jsonrpc: "2.0",
      id,
      result: {
        content: [{ type: "text", text }],
        isError,
      },
    },
  };
}

function rpcError(
  id: JsonRpcRequest["id"],
  code: number,
  message: string
): { status: number; payload: unknown } {
  return {
    status: 200,
    payload: { jsonrpc: "2.0", id: id ?? null, error: { code, message } },
  };
}

export { publishArgsSchema };
