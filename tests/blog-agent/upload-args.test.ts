import assert from "node:assert/strict";
import { test } from "node:test";
import { uploadArgsSchema } from "@/lib/blog-agent/mcp-tools";

test("uploadArgsSchema requires imageUrl or data, not both", () => {
  assert.equal(
    uploadArgsSchema.safeParse({ slug: "things-to-do-in-salado-texas" }).success,
    false
  );
  assert.equal(
    uploadArgsSchema.safeParse({
      slug: "things-to-do-in-salado-texas",
      imageUrl: "https://tile.loc.gov/image.jpg",
      data: "a".repeat(40),
    }).success,
    false
  );
});

test("uploadArgsSchema accepts https imageUrl and rejects http", () => {
  const ok = uploadArgsSchema.safeParse({
    slug: "things-to-do-in-salado-texas",
    imageUrl: "https://tile.loc.gov/image-services/iiif/hero.jpg",
    setAsHero: true,
    alt: "The historic Stagecoach Inn porch in Salado, Texas",
  });
  assert.equal(ok.success, true);

  const http = uploadArgsSchema.safeParse({
    slug: "things-to-do-in-salado-texas",
    imageUrl: "http://example.com/hero.jpg",
  });
  assert.equal(http.success, false);

  const creds = uploadArgsSchema.safeParse({
    slug: "things-to-do-in-salado-texas",
    imageUrl: "https://user:pass@example.com/hero.jpg",
  });
  assert.equal(creds.success, false);
});
