import { callBlogTool } from "@/lib/blog-agent/mcp-handlers";
import { MCP_TOOLS } from "@/lib/blog-agent/mcp-tools";

export const PUBLIC_MCP_METHODS = new Set([
  "initialize",
  "ping",
  "notifications/initialized",
  "tools/list",
]);

export function isPublicMcpMethod(method: string | undefined): boolean {
  return typeof method === "string" && PUBLIC_MCP_METHODS.has(method);
}

export const PUBLIC_MCP_TOOLS = new Set([
  "list_blog_posts",
  "suggest_next_topic",
  "get_blog_post",
  "list_hero_images",
  "list_post_images",
]);

export function isPublicMcpRequest(
  method: string | undefined,
  toolName?: string
): boolean {
  if (isPublicMcpMethod(method)) return true;
  return method === "tools/call" && !!toolName && PUBLIC_MCP_TOOLS.has(toolName);
}

export function mcpToolNameFromBody(body: unknown): string | undefined {
  if (!body || typeof body !== "object") return undefined;
  const params = (body as { params?: { name?: unknown } }).params;
  return typeof params?.name === "string" ? params.name : undefined;
}

export function jsonRpcId(body: unknown): string | number | null {
  if (!body || typeof body !== "object" || !("id" in body)) return null;
  const id = (body as { id?: unknown }).id;
  if (typeof id === "string" || typeof id === "number") return id;
  return null;
}

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
            serverInfo: { name: "kevin-blog", version: "1.2.0" },
          },
        },
      };
    case "ping":
    case "notifications/initialized":
      return { status: 200, payload: { jsonrpc: "2.0", id: body.id, result: {} } };
    case "tools/list":
      return {
        status: 200,
        payload: { jsonrpc: "2.0", id: body.id, result: { tools: MCP_TOOLS } },
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
  const result = await callBlogTool(
    body.params?.name,
    body.params?.arguments ?? {}
  );
  return {
    status: 200,
    payload: {
      jsonrpc: "2.0",
      id: body.id,
      result: {
        content: [{ type: "text", text: result.text }],
        isError: result.isError,
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

export { publishArgsSchema } from "@/lib/blog-agent/mcp-tools";
