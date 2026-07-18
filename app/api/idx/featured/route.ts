import { NextResponse } from "next/server";
import { listingsManager } from "@/lib/idx/listings-service";

export const revalidate = 300;

export async function GET() {
  const result = await listingsManager.getFeatured(24);
  return NextResponse.json({
    source: result.source,
    count: result.listings.length,
    listings: result.listings,
  });
}
