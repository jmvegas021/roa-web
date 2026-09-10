# Edit an existing post

Same skill, second mode. Apply only what the user asked. **Preserve or improve SEO** (see [seo.md](seo.md) Edit gates). Keep voice and structure unless they asked to change those.

## 1. Resolve the post

From title or URL:

- URL or path `/blog/{slug}` → use that slug (strip query/hash).
- Title → case-insensitive match against `list_blog_posts` or `GET {site}/blog/feed.json` (`title` field). Also compare a slugified title to `slug`.
  - **One match** → proceed.
  - **Several** → list `title` + `url` and ask which one.
  - **None** → say so. Do not create a new post unless they then ask to create.

If the feed is down: `list_blog_posts` on the Kevin Shoun Blog connector, or list locally, and match the same way. Do not skip inventory. Do not use GitHub MCP.

## 2. Fetch source

`get_blog_post` with `slug`. Use the raw Markdown, not the rendered HTML at `/blog/{slug}`.

If the repo is open locally, that file is acceptable **after** confirming it matches production (or fetching via `get_blog_post` anyway). Do not edit a stale local copy that differs from live.

If the file does not exist: stop. Tell the user. Do not create unless they switch to Mode A.

## 3. Patch

- Change only the requested sections, facts, or metadata.
- Set `updatedAt` to today’s `"YYYY-MM-DD"` (sitemap `lastModified` and BlogPosting `dateModified`).
- Do not change `publishedAt` or `slug` unless they explicitly ask. Slug change is a redirect risk — **refuse** until they confirm in so many words.
- Do not wipe `title`, `description`, or `keywords` unless asked. A copy edit is not a keyword reset.
- If the topic moved substantially, refresh `description`, `keywords`, and the FAQ block to match the new intent.
- Keep category/tags unless the edit’s subject clearly moved (and then adjust).
- Re-read [voice.md](voice.md). Do not introduce a second voice or start stuffing keywords.
- Word count may move outside 900–1,600 on a small patch; do not pad to hit a quota.
- If they asked to “add a section”, insert it in a logical place with an H2; do not rewrite the whole piece.

## 4. Images

Keep the existing `heroImage` unless the edit needs a new hero. Prefer a neighborhood fallback over blocking on an image tool. See [image-prompts.md](image-prompts.md).

## 5. Commit

`publish_blog_post` with `mode: edit` and the full Markdown. See [publish.md](publish.md). Do not call GitHub MCP. Do not commit if the [seo.md](seo.md) Edit gates failed.

## 6. Handoff

```
Canonical: {site}/blog/{slug}
(Vercel may take 1–2 minutes.)

What changed:
- {bullet: section added / fact corrected / hero kept / updatedAt set}
- SEO: {preserved | description/keywords/FAQ refreshed | slug unchanged}

Social caption: only if they asked; otherwise omit.
```

## Duplicate / create collision

If Mode A inventory finds this title or slug already live, switch here instead of writing a second file.
