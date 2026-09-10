import { callBlogTool } from "@/lib/blog-agent/mcp-handlers";
import { MCP_TOOLS } from "@/lib/blog-agent/mcp-tools";

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
            serverInfo: { name: "kevin-blog", version: "1.1.0" },
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
