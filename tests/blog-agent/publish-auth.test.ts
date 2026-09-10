import assert from "node:assert/strict";
import { test } from "node:test";
import { extractPublishToken } from "@/lib/blog-agent/publish-auth";

test("extractPublishToken reads Bearer, x-api-key, and URL key", () => {
  assert.equal(
    extractPublishToken(
      new Request("https://www.kevinshoun.com/api/blog/mcp", {
        headers: { authorization: "Bearer secret-one" },
      })
    ),
    "secret-one"
  );
  assert.equal(
    extractPublishToken(
      new Request("https://www.kevinshoun.com/api/blog/mcp", {
        headers: { "x-api-key": "secret-two" },
      })
    ),
    "secret-two"
  );
  assert.equal(
    extractPublishToken(
      new Request("https://www.kevinshoun.com/api/blog/mcp?key=secret-three")
    ),
    "secret-three"
  );
  assert.equal(
    extractPublishToken(new Request("https://www.kevinshoun.com/api/blog/mcp")),
    ""
  );
});
