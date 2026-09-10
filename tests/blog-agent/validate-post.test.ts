import assert from "node:assert/strict";
import { test } from "node:test";
import { validatePost } from "@/lib/blog-agent/validate-post";
import { hasRecentPublish, selectNextTopic } from "@/lib/blog-agent/select-topic";
import { loadClusterFile } from "@/lib/blog-agent/cluster-store";
import { parseGeneratedOutput } from "../../scripts/blog-agent/generate-post";
import type { ClusterTopic } from "@/lib/blog-agent/types";

const stubTopic = {
  id: "fort-cavazos-commute-by-town",
  title: "Fort Cavazos commute from Salado, Belton, and Harker Heights",
  primaryKeyword: "Fort Cavazos commute",
  secondaries: ["PCS"],
  category: "relocation" as const,
  place: "harker-heights",
  status: "queued" as const,
  source: "seed" as const,
};

test("empty markdown fails", () => {
  const result = validatePost("  ", { mode: "create", existingSlugs: new Set() });
  assert.equal(result.ok, false);
});

test("create rejects a live slug", () => {
  const markdown = samplePost("buying-in-salado-vs-belton");
  const result = validatePost(markdown, {
    mode: "create",
    existingSlugs: new Set(["buying-in-salado-vs-belton"]),
  });
  assert.equal(result.ok, false);
  if (!result.ok) {
    assert.match(result.errors.join(" "), /already exists/);
  }
});

test("valid create sample passes gates", () => {
  const result = validatePost(samplePost("lake-belton-homes"), {
    mode: "create",
    existingSlugs: new Set(["buying-in-salado-vs-belton"]),
  });
  assert.equal(result.ok, true, result.ok ? "" : result.errors.join("; "));
});

test("cluster seed has queued topics and picker returns one", () => {
  const cluster = loadClusterFile();
  assert.ok(cluster.topics.length >= 8);
  const topic = selectNextTopic([], cluster.topics);
  assert.ok(topic);
  assert.equal(topic.status, "queued");
});

test("cooldown detects a post published today", () => {
  const today = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Chicago",
  }).format(new Date());
  assert.equal(
    hasRecentPublish([
      {
        title: "x",
        description: "A unique meta description about Belton that is long enough.",
        slug: "x",
        publishedAt: today,
        author: "Kevin Shoun",
        tags: ["belton"],
        category: "guides",
        featured: false,
        priority: 5,
        heroImage: "/images/neighborhoods/belton.webp",
        heroAlt: "Lake Belton shoreline in evening light",
        keywords: ["a", "b", "c", "d"],
        excerpt: "x",
      },
    ]),
    true
  );
});

test("parseGeneratedOutput splits follow-ups", () => {
  const parsed = parseGeneratedOutput(
    `${samplePost("parsed-output-slug")}\n===FOLLOWUPS===\nOne topic\nTwo topic\nThree topic\n`
  );
  assert.equal(parsed.followUps.length, 3);
  assert.match(parsed.markdown, /^---/);
});

test("stub topic shape is usable", () => {
  const topic: ClusterTopic = stubTopic;
  assert.equal(topic.place, "harker-heights");
});

function samplePost(slug: string): string {
  const paragraph = Array.from({ length: 18 }, () => "Belton and Salado sit on the same corridor and ask different things of a buyer.").join(" ");
  return `---
title: "Living near Lake Belton in Bell County"
description: "A calm guide to Lake Belton homes for buyers comparing Belton neighborhoods and Central Texas lake living."
slug: ${slug}
publishedAt: "2026-09-08"
author: Kevin Shoun
tags:
  - belton
  - buyers
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

Lake Belton is the geographic fact that organizes much of daily life in [Belton](/neighborhoods/belton). Buyers who want water close at hand should start with the lake, then the street, not the other way around.

## Who the lake is for

${paragraph}

## Streets versus the water

${paragraph}

## How to compare a listing

Walk the [listings](/listings) with elevation and access in mind, then decide whether [Temple](/neighborhoods/temple) employment still fits the drive.

## What to inspect before an offer

${paragraph}

## Frequently asked questions

### Is every Belton address a lake address?

No. Lake proximity is a specific street question. Some homes are a short drive from a ramp; others sit on the water with their own constraints.

### Does lake living change insurance questions?

It can. Elevation, flood information, and the difference between a view and legal access all belong in diligence — not in a brochure caption.

### Who should start in Belton instead of Salado?

Buyers who want a wider housing range and lake recreation usually begin in Belton and use Salado as the comparison.

## A private next step

When the street and the water agree, [request a consult](/contact). Representation here is matching the property to the week you will actually live.
`;
}
