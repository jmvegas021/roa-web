import assert from "node:assert/strict";
import { test } from "node:test";
import {
  createImageUploadTicket,
  verifyImageUploadTicket,
} from "@/lib/blog-agent/image-upload-ticket";

test("image upload tickets round-trip and reject tampers", () => {
  process.env.BLOG_PUBLISH_SECRET = "unit-test-blog-publish-secret";
  const created = createImageUploadTicket({
    slug: "things-to-do-in-salado-texas",
    filename: "hero.webp",
    alt: "Historic Stagecoach Inn porch in Salado, Texas",
    setAsHero: true,
  });
  assert.match(created.putUrl, /^https:\/\/www\.kevinshoun\.com\/api\/blog\/images\?ticket=/);
  const token = new URL(created.putUrl).searchParams.get("ticket");
  const payload = verifyImageUploadTicket(token);
  assert.equal(payload.slug, "things-to-do-in-salado-texas");
  assert.equal(payload.setAsHero, true);
  assert.throws(() => verifyImageUploadTicket(`${token}x`));
});
