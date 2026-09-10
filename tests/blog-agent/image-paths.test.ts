import assert from "node:assert/strict";
import { test } from "node:test";
import { isAllowlistedPath } from "@/lib/blog-agent/commit-post";
import {
  decodeImageData,
  detectImageExtension,
  gitBlogImagePath,
  isSiteImagePath,
  publicBlogImagePath,
  sanitizeImageFilename,
} from "@/lib/blog-agent/image-paths";
import { patchFrontmatter } from "@/lib/blog-agent/patch-frontmatter";

test("allowlist accepts blog markdown and post images only", () => {
  assert.equal(isAllowlistedPath("content/blog/living-near-lake-belton.md"), true);
  assert.equal(
    isAllowlistedPath("public/images/blog/living-near-lake-belton/hero.webp"),
    true
  );
  assert.equal(isAllowlistedPath("public/images/neighborhoods/salado.webp"), false);
  assert.equal(isAllowlistedPath("content/editorial/cluster.json"), true);
});

test("sanitizes image filenames and public paths", () => {
  assert.equal(sanitizeImageFilename("Hero.WEBP"), "hero.webp");
  assert.equal(
    publicBlogImagePath("things-to-do-in-salado-texas", "hero.webp"),
    "/images/blog/things-to-do-in-salado-texas/hero.webp"
  );
  assert.equal(
    gitBlogImagePath("things-to-do-in-salado-texas", "hero.webp"),
    "public/images/blog/things-to-do-in-salado-texas/hero.webp"
  );
  assert.throws(() => sanitizeImageFilename("../secret.png"));
  assert.equal(isSiteImagePath("/images/neighborhoods/salado.webp"), true);
  assert.equal(isSiteImagePath("https://example.com/x.webp"), false);
});

test("detects jpeg magic bytes", () => {
  const jpeg = Buffer.from([0xff, 0xd8, 0xff, 0xe0, ...Buffer.alloc(32, 1)]);
  assert.equal(detectImageExtension(jpeg), "jpg");
  const encoded = jpeg.toString("base64");
  assert.equal(decodeImageData(`data:image/jpeg;base64,${encoded}`).equals(jpeg), true);
});

test("patchFrontmatter updates hero fields", () => {
  const markdown = `---
title: "Living near Lake Belton in Bell County"
description: "A calm guide to Lake Belton homes for buyers comparing Belton neighborhoods and Central Texas lake living."
slug: living-near-lake-belton
publishedAt: "2026-09-08"
author: Kevin Shoun
tags:
  - belton
category: neighborhoods
featured: false
priority: 5
heroImage: /images/neighborhoods/belton.webp
heroAlt: Lake Belton shoreline and established streets in Belton, Texas
keywords:
  - Lake Belton homes
  - Belton TX lake living
  - buying on Lake Belton
  - Bell County waterfront
---

Lead paragraph.
`;
  const next = patchFrontmatter(markdown, {
    heroImage: "/images/blog/living-near-lake-belton/hero.webp",
    heroAlt: "Evening light on Lake Belton from a quiet cove",
    updatedAt: "2026-09-10",
  });
  assert.match(next, /heroImage: \/images\/blog\/living-near-lake-belton\/hero.webp/);
  assert.match(next, /updatedAt: ["']?2026-09-10/);
});
