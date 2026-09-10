import assert from "node:assert/strict";
import { test } from "node:test";
import { isPublicMcpMethod } from "@/lib/blog-agent/mcp-server";

test("MCP handshake methods are public so Claude can Connect without the secret header", () => {
  assert.equal(isPublicMcpMethod("initialize"), true);
  assert.equal(isPublicMcpMethod("ping"), true);
  assert.equal(isPublicMcpMethod("tools/list"), true);
  assert.equal(isPublicMcpMethod("notifications/initialized"), true);
  assert.equal(isPublicMcpMethod("tools/call"), false);
  assert.equal(isPublicMcpMethod(undefined), false);
});
