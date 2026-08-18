import assert from "node:assert/strict";
import { test } from "node:test";
import { getListingAvailability } from "@/lib/seo/structuredData";

test("sold and closed listings are not advertised as available", () => {
  assert.equal(
    getListingAvailability("Sold"),
    "https://schema.org/SoldOut"
  );
  assert.equal(
    getListingAvailability("Closed"),
    "https://schema.org/SoldOut"
  );
});

test("pending and active listings retain accurate availability", () => {
  assert.equal(
    getListingAvailability("Under Contract"),
    "https://schema.org/PreOrder"
  );
  assert.equal(
    getListingAvailability("Active"),
    "https://schema.org/InStock"
  );
});
