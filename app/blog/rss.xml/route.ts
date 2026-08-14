import { SITE } from "@/lib/content/team";
import { loadPostSummaries } from "@/lib/blog/load-posts";
import { blogDateToUtcString } from "@/lib/blog/format-date";
import { absoluteUrl } from "@/lib/site/siteUrl";

export const dynamic = "force-static";
export const revalidate = 3600;

export function GET() {
  const posts = loadPostSummaries();
  const feedUrl = absoluteUrl("/blog/rss.xml");
  const items = posts.map(toRssItem).join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(`${SITE.office} Journal`)}</title>
    <link>${escapeXml(absoluteUrl("/blog"))}</link>
    <description>${escapeXml(`Guides and market notes from ${SITE.office} at ${SITE.brand}.`)}</description>
    <language>en-us</language>
    <atom:link href="${escapeXml(feedUrl)}" rel="self" type="application/rss+xml"/>
    ${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}

function toRssItem(post: ReturnType<typeof loadPostSummaries>[number]): string {
  const url = absoluteUrl(`/blog/${post.slug}`);
  const updated = post.updatedAt ?? post.publishedAt;
  return `<item>
      <title>${escapeXml(post.title)}</title>
      <link>${escapeXml(url)}</link>
      <guid isPermaLink="true">${escapeXml(url)}</guid>
      <pubDate>${blogDateToUtcString(updated)}</pubDate>
      <description>${escapeXml(post.description)}</description>
    </item>`;
}

function escapeXml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}
