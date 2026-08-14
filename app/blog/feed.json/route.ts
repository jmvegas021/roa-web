import { loadPostSummaries } from "@/lib/blog/load-posts";
import { toFeedItem } from "@/lib/blog/to-feed";

export const dynamic = "force-static";
export const revalidate = 3600;

export function GET() {
  const feed = loadPostSummaries().map(toFeedItem);
  return Response.json(feed, {
    headers: {
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
