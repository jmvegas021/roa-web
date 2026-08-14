# Frontmatter

Every post is `content/blog/{slug}.md`. Filename **must** match `slug`. YAML only — no MDX.

Quote date strings so parsers do not coerce them to Date objects.

The loader validates YAML with the Zod schema in `lib/blog/frontmatter.ts`. Invalid posts are skipped (logged, not thrown). Match this contract exactly — field names, types, lengths, and required vs optional. SEO usage of these fields is in [seo.md](seo.md).

## Required fields

| Field | Rules |
|-------|--------|
| `title` | String, **8–120** characters. Editorial, not clickbait. Include the primary keyword naturally. Quote if it contains `:`. |
| `description` | String, **40–180** characters. Meta + OG + RSS. Unique one sentence. Include the primary keyword and a relevant place name (Salado, Belton, Temple, Georgetown, Central Texas, …). |
| `slug` | Must match `^[a-z0-9]+(?:-[a-z0-9]+)*$` and the filename (no `.md`). Keyword-ish; never stuffed. |
| `publishedAt` | Quoted `"YYYY-MM-DD"`. Create: today. Edit: do not change unless asked. |
| `tags` | YAML list of non-empty strings, **at least one**. Lowercase place/intent terms: `salado`, `belton`, `temple`, `georgetown`, `harker-heights`, `buyers`, `sellers`, `relocation`, `market`, `land`, `military`. |
| `category` | Exactly one of `guides` \| `neighborhoods` \| `market` \| `relocation`. |
| `heroImage` | **Always set.** String path, not an object. Site-root, e.g. `/images/blog/{slug}/hero.webp` or `/images/neighborhoods/salado.webp`. OG, Twitter, and BlogPosting `image` use this field. Alt text is a sibling field (`heroAlt`), not nested. |
| `heroAlt` | String, **at least 8** characters. Concrete description of the photo. No keyword stuffing. |
| `keywords` | YAML list of non-empty strings. **Required on create** (4–8 real secondary phrases). Empty `[]` loads in Zod but **fails [seo.md](seo.md)**. |

## Optional

| Field | Rules |
|-------|--------|
| `updatedAt` | Quoted `"YYYY-MM-DD"`. Omit on create (or set equal to `publishedAt`). **Always set on edit** to today. |
| `author` | String, min 2. Defaults to `Kevin Shoun` if omitted. **Set it explicitly** on create. |
| `featured` | Boolean. Defaults to `false` if omitted. |
| `priority` | Integer **1–10** (editorial heat). Defaults to `5` if omitted. |

Do not add fields the schema does not list. Do not nest `heroImage` (`src`/`url`/`alt` objects fail validation).

## Slug

1. Lowercase; prefer the primary keyword plus a short differentiator if needed.
2. Replace spaces and punctuation with hyphens.
3. Collapse repeat hyphens; strip leading/trailing hyphens.
4. Keep it stable and readable (`buying-in-salado-vs-belton`, not a hash and not every secondary term).

Do not change an existing slug without an explicit user confirm (redirect risk).

## Example

```yaml
---
title: Buying in Salado vs Belton
description: A calm comparison of Salado and Belton for buyers who want creek-side character or lake-town living in Bell County — without the usual relocation noise.
slug: buying-in-salado-vs-belton
publishedAt: "2026-08-13"
author: Kevin Shoun
tags:
  - salado
  - belton
  - buyers
category: guides
featured: true
priority: 8
heroImage: /images/blog/buying-in-salado-vs-belton/hero.webp
heroAlt: Limestone and live oaks along a quiet stretch of Salado Creek at dusk.
keywords:
  - Salado vs Belton
  - Bell County homes
  - buying in Salado
  - Belton TX real estate
  - Central Texas relocation
---
```

Fallback hero (no new image file):

```yaml
heroImage: /images/neighborhoods/salado.webp
heroAlt: Twelve Oaks and creek-side canopy in Salado, Texas.
```

## Body conventions

- ATX headings (`##`, `###`). The site uses `title` as the article H1 — do not add a body `#`. Start with a lead paragraph (extractable definition in the first 200 words), then 4–7 `##` sections.
- Images in body: `![descriptive alt](/images/blog/{slug}/name.webp)`
- Internal links: 2–4 in prose, e.g. `[label](/neighborhoods#belton)`
- External citations: full `https://` URLs with source name + year
- FAQ block **required on create** (either H2 works for FAQPage JSON-LD extraction):

```markdown
## Frequently asked questions

### How long is the commute from Belton to Fort Cavazos?

Answer in 2–4 sentences. Cite a real source if you use a number.
```

- Close with a short `##` CTA section, not a sales script.
