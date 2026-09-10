import assert from "node:assert/strict";
import { test } from "node:test";
import { isPublicMcpMethod, isPublicMcpRequest, mcpToolNameFromBody } from "@/lib/blog-agent/mcp-server";

test("MCP handshake methods are public so Claude can Connect without the secret header", () => {
  assert.equal(isPublicMcpMethod("initialize"), true);
  assert.equal(isPublicMcpMethod("ping"), true);
  assert.equal(isPublicMcpMethod("tools/list"), true);
  assert.equal(isPublicMcpMethod("notifications/initialized"), true);
  assert.equal(isPublicMcpMethod("tools/call"), false);
  assert.equal(isPublicMcpMethod(undefined), false);
});

test("list and suggest tools are public; publish and upload stay protected", () => {
  assert.equal(isPublicMcpRequest("tools/call", "list_blog_posts"), true);
  assert.equal(isPublicMcpRequest("tools/call", "suggest_next_topic"), true);
  assert.equal(isPublicMcpRequest("tools/call", "get_blog_post"), true);
  assert.equal(isPublicMcpRequest("tools/call", "list_hero_images"), true);
  assert.equal(isPublicMcpRequest("tools/call", "list_post_images"), true);
  assert.equal(isPublicMcpRequest("tools/call", "publish_blog_post"), false);
  assert.equal(isPublicMcpRequest("tools/call", "upload_blog_image"), false);
  assert.equal(isPublicMcpRequest("tools/call", "set_post_hero"), false);
  assert.equal(isPublicMcpRequest("tools/call", "delete_blog_post"), false);
  assert.equal(mcpToolNameFromBody({ params: { name: "list_blog_posts" } }), "list_blog_posts");
});
