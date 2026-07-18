#!/usr/bin/env node
/**
 * Smoke-test IDX credentials + featured listing mapping (no secrets printed).
 *
 *   node scripts/test-idx.mjs
 */
import { readFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

function loadEnvFile(name) {
  const path = join(root, name);
  if (!existsSync(path)) return;
  for (const line of readFileSync(path, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) continue;
    const eq = trimmed.indexOf("=");
    const key = trimmed.slice(0, eq).trim();
    const value = trimmed.slice(eq + 1).trim();
    if (!(key in process.env)) process.env[key] = value;
  }
}

loadEnvFile(".env");
loadEnvFile(".env.local");

const key = process.env.IDX_API_KEY || "";
if (key.length < 10) {
  console.error("FAIL: IDX_API_KEY is not configured in .env or .env.local");
  process.exit(1);
}

async function idxGet(path) {
  const response = await fetch(`https://api.idxbroker.com${path}`, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      accesskey: key,
      outputtype: "json",
      apiversion: process.env.IDX_API_VERSION || "1.8.0",
    },
  });
  const text = await response.text();
  const data = text ? JSON.parse(text) : null;
  if (!response.ok) {
    throw new Error(`${path} → ${response.status} ${text.slice(0, 200)}`);
  }
  return data;
}

function unwrap(payload) {
  if (!payload || typeof payload !== "object") return payload;
  if (Array.isArray(payload)) return payload;
  if ("data" in payload) return payload.data;
  return payload;
}

function imageUrl(raw) {
  const image = raw.image;
  if (typeof image === "string" && image.startsWith("http")) return image;
  if (image && typeof image === "object") {
    const entries = Object.entries(image).sort(
      ([a], [b]) => Number(a) - Number(b)
    );
    for (const [, value] of entries) {
      if (value && typeof value === "object" && value.url) return value.url;
    }
  }
  return "";
}

async function main() {
  console.log("OK  credentials present");

  const account = await idxGet("/clients/accountinfo");
  console.log(
    "OK  account:",
    account.displayName || account.clientName,
    "/",
    account.companyName
  );

  const featured = await idxGet("/clients/featured");
  const collection = unwrap(featured);
  const listings = Object.values(collection || {}).filter(
    (item) => item && typeof item === "object" && item.listingID
  );

  console.log("OK  featured raw:", listings.length);
  if (!listings.length) {
    console.error("FAIL: no featured listings returned");
    process.exit(1);
  }

  let withImages = 0;
  for (const listing of listings.slice(0, 5)) {
    const img = imageUrl(listing);
    if (img) withImages += 1;
    const price = listing.price || listing.listingPrice;
    console.log(
      `  - ${listing.listingID} | ${listing.address}, ${listing.cityName} | ${price} | img=${img ? "yes" : "no"}`
    );
  }

  console.log(
    `OK  sample images resolved: ${withImages}/${Math.min(5, listings.length)}`
  );
  console.log("\nIDX local smoke test passed.");
}

main().catch((error) => {
  console.error("FAIL:", error.message || error);
  process.exit(1);
});
