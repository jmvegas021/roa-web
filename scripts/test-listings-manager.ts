import { readFileSync } from "node:fs";
import { listingsManager } from "../lib/idx/listings-service";

for (const file of [".env", ".env.local"]) {
  try {
    for (const line of readFileSync(file, "utf8").split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) continue;
      const index = trimmed.indexOf("=");
      const key = trimmed.slice(0, index);
      const value = trimmed.slice(index + 1);
      if (!process.env[key]) process.env[key] = value;
    }
  } catch {
    // optional file
  }
}

async function main() {
  const result = await listingsManager.getFeatured(24);
  console.log("source=", result.source, "count=", result.listings.length);
  for (const listing of result.listings.slice(0, 5)) {
    console.log(
      `  ${listing.id} | ${listing.address}, ${listing.city} | $${listing.price} | ${listing.bedrooms}bd/${listing.bathrooms}ba | img=${listing.imageUrl.startsWith("http")}`
    );
  }
  if (result.source !== "idx" || result.listings.length === 0) {
    process.exit(1);
  }
}

main();
