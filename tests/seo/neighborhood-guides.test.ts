import assert from "node:assert/strict";
import { test } from "node:test";
import { NEIGHBORHOOD_GUIDES } from "@/lib/content/neighborhood-guides";
import { NEIGHBORHOODS } from "@/lib/content/neighborhoods";

test("every neighborhood has one unique local guide", () => {
  const guideSlugs = NEIGHBORHOOD_GUIDES.map(({ slug }) => slug).sort();
  const neighborhoodSlugs = NEIGHBORHOODS.map(({ slug }) => slug).sort();

  assert.deepEqual(guideSlugs, neighborhoodSlugs);
  assert.equal(new Set(guideSlugs).size, guideSlugs.length);
});

test("local guides meet minimum copy and metadata requirements", () => {
  for (const guide of NEIGHBORHOOD_GUIDES) {
    const bodyCopy = [
      guide.introduction,
      guide.lifestyle,
      guide.realEstate,
      guide.planning,
    ].join(" ");

    assert.ok(countWords(bodyCopy) >= 150, `${guide.slug} needs more copy`);
    assert.ok(guide.description.length >= 40, `${guide.slug} description short`);
    assert.ok(
      guide.description.length <= 180,
      `${guide.slug} description long`
    );
  }
});

function countWords(content: string): number {
  return content.trim().split(/\s+/).length;
}
