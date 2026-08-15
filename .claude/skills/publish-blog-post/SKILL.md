---
name: publish-blog-post
description: >-
  Creates or edits Kevin Shoun blog posts as Markdown in jmvegas021/roa-web
  with required SEO (primary keyword, meta description, FAQ, BlogPosting and
  FAQPage schema, internal links) and commits only content/blog/ and
  public/images/blog/ to main so Vercel deploys at /blog. Use when the user
  asks to write a blog post, publish a journal piece, optimize keywords or
  FAQ schema, update the post, edit the article at a URL, or change the blog
  titled something. Also use for "write a journal post", "publish to the
  blog", "SEO the Salado article", "add FAQ", "fix the Salado vs Belton
  article", or similar create/edit requests.
---

# Publish blog post

Portable skill for Claude Desktop, Claude Agent, Claude Code, and Cursor. Writes Kevin Shoun blog posts to `/blog`. GitHub Write on `jmvegas021/roa-web` is what goes live. This skill contains no Vercel, Git, or Resend secrets.

Read supporting files when needed (one level deep):

- [seo.md](seo.md) — **read before drafting.** Do not publish if the checklist fails.
- [frontmatter.md](frontmatter.md) — fields, YAML example, slug rules
- [voice.md](voice.md) — brand voice (luxury editorial, not keyword stuffing)
- [image-prompts.md](image-prompts.md) — hero photography
- [publish.md](publish.md) — commit to `main`, path allowlist
- [edit.md](edit.md) — resolve title/URL, patch, bump `updatedAt`

## Constants

| Key | Value |
|-----|--------|
| GitHub | `jmvegas021/roa-web` |
| Branch | `main` |
| Site | `https://roa-web-tau.vercel.app` |
| Feed | `{site}/blog/feed.json` |
| Live index | `{site}/blog` |
| Live post | `{site}/blog/{slug}` |
| Markdown | `content/blog/{slug}.md` |
| Images | `public/images/blog/{slug}/` |

Allowlist (commit these prefixes only): `content/blog/` and `public/images/blog/`.

## Mode

**Create** if the user wants a new post (topic, “write”, “publish a blog post”).

**Edit** if they name an existing post — title, `https://…/blog/{slug}`, `/blog/{slug}`, “update the post”, “edit the article at”, “change the blog titled”, “fix the … article”. Follow [edit.md](edit.md).

If unclear, ask one question: create or edit?

## Hard rules

- Read [seo.md](seo.md) before drafting. Do not publish, commit, or call a URL live if that checklist fails.
- Do not invent market statistics, volume metrics, or client stories.
- Do not touch any path outside the allowlist. Do not commit `.env` or unrelated WIP. Never `git add -A` / `git add .`.
- Do not create a duplicate slug. If the slug or title already exists, offer edit instead.
- Do not change `slug` or `publishedAt` unless the user explicitly confirms (slug change is a redirect risk — refuse until they confirm).
- Do not skip inventory (feed or GitHub `content/blog/` listing).
- Do not skip FAQ, `keywords`, or internal links on create.
- Do not call Cursor-only image tools as the only image path. Desktop/Agent will not have them. Never block publish on a missing image tool.
- Do not enable or request Vercel login, Admin GitHub, or `.env` access.
- Plain Markdown only (no MDX/JSX). Quote ISO dates in frontmatter (`"YYYY-MM-DD"`).
- Voice stays luxury editorial. Never stuff title, slug, alt, or body with keywords.

## Mode A — Create

Copy and track:

```
Create:
- [ ] Intake (primary keyword + 2–4 secondaries)
- [ ] Inventory
- [ ] Read seo.md → brief → draft
- [ ] Images (heroImage always set)
- [ ] SEO checklist pass (seo.md) — fail = do not publish
- [ ] Commit to main (or draft-only)
- [ ] Handoff (canonical URL + 3 cluster topics)
```

### 1. Intake

Topic is required. Infer **primary keyword**, **2–4 secondary terms**, audience, and category from the topic. Ask only if the request is vague (no place, no reader, no decision). Do not treat keywords as optional.

| Category | Use when |
|----------|----------|
| `guides` | How-to, buyer/seller education, comparisons |
| `neighborhoods` | Place character, lifestyle, corridor notes |
| `market` | Pricing, inventory conditions, rates, seasonality |
| `relocation` | PCS, Fort Cavazos, incoming military, out-of-state |

Audience defaults: high-income professionals relocating to or already in Salado, Belton, Temple, Georgetown, Harker Heights, Bell & Williamson Counties.

Author defaults to `Kevin Shoun`. Set `priority` 1–10 (flagship comparison/timely market 7–10; standard guide 4–6; niche 2–4). Set `featured: true` only for flagship pieces or when asked.

### 2. Inventory

`GET https://roa-web-tau.vercel.app/blog/feed.json`

Expect `{ slug, title, url, tags, category, publishedAt, updatedAt, description }[]`.

- If title or slug already exists → stop creating; offer Mode B.
- Pick 2–4 internal links from the feed plus evergreen pages: `/neighborhoods` (anchors `#salado` `#belton` `#temple` `#georgetown` `#harker-heights` `#central-texas`), `/listings`, `/agents/kevin-shoun`, `/contact`.

If the feed 404s or fails: list `content/blog/` on GitHub `main` (or the local checkout). Still refuse duplicates. Do not skip this step.

### 3. Brief → draft

Read [seo.md](seo.md), [voice.md](voice.md), and [frontmatter.md](frontmatter.md) **before writing**. Write 900–1,600 words.

- Title includes the primary keyword naturally (8–120 chars). H1 is `title` (no body `#`).
- Meta `description` 40–180, unique, keyword + relevant place name(s).
- Slug is keyword-ish, lowercase, hyphenated; never stuffed. Filename equals `slug`.
- Definition-first lead: 1–2 extractable sentences in the first 200 words. No “in today’s market”.
- 4–7 `##` sections mapped to search intent. One idea per section.
- 2–4 internal links in prose (not a dump at the end).
- `## Frequently asked questions` (or `## FAQ`) with 3–5 `###` questions phrased as real queries — required so FAQPage JSON-LD has content.
- `keywords` filled with the secondary terms (empty array = fail).
- Real citations only (city/county, Fort Cavazos official, Texas A&M Real Estate Center, Census, TREC). Name + year + URL. If a number cannot be cited, omit it.
- Close with a restrained consult CTA to `/contact` — appointment, not a hard sell.

Run the Create gates in [seo.md](seo.md). If any fail, revise. Do not commit yet.

### 4. Images

Read [image-prompts.md](image-prompts.md). Generate a hero if the host can; otherwise point `heroImage` at an existing neighborhood photo. **Always set `heroImage`** (OG, Twitter, and BlogPosting image use it). `heroAlt` min 8 characters, descriptive of the photo, not stuffed. Publish without new binaries if needed.

### 5. Commit to `main`

If [seo.md](seo.md) failed, stop. Read [publish.md](publish.md). Prefer GitHub create/update on `main`. If GitHub is unavailable, return the full Markdown and say it was not published.

### 6. Handoff

```
Canonical: {site}/blog/{slug}
(Vercel may take 1–2 minutes.)

Changed: content/blog/{slug}.md
Images: {paths or “existing neighborhood fallback”}

SEO:
- Primary: {keyword}
- Secondaries: {…}
- FAQPage: {n} questions
- Checklist: pass

Social caption:
{2–3 sentences, Kevin’s voice, no hashtag spam}

Follow-up cluster (internal-link later):
1. …
2. …
3. …
```

## Mode B — Edit

Triggers: “update this post”, “edit [title]”, “change https://…/blog/…”, “fix the Salado vs Belton article.”

Follow [edit.md](edit.md) and the Edit gates in [seo.md](seo.md): resolve from title or URL → fetch `content/blog/{slug}.md` from GitHub (not rendered HTML) → apply only the requested edits → **preserve or improve SEO** (do not wipe title/description/keywords unless asked; refresh those plus FAQ if the topic moved) → never change `slug` without explicit confirm → set `updatedAt` to today → commit allowlisted paths only after SEO edit gates pass → hand off canonical URL + a short diff summary.

## Hosts

| Host | Publish path |
|------|----------------|
| Claude Desktop / Agent + GitHub Write | GitHub create/update file on `main` |
| Cursor / Claude Code, repo open | Write files, `git add` allowlisted paths only, commit, `git push origin main` |
| Skill only (no GitHub) | Draft Markdown in the reply. Do not claim it is live. |

Do not use Cursor `GenerateImage` as the only image method.
