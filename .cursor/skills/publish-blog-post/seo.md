# SEO (required)

Traditional ranking and AI citation both matter. Voice stays luxury editorial — not realtor spam, not keyword stuffing.

**Read this file before drafting. Do not publish, commit, or call a post live if any Create or Edit gate below fails.** Fix the draft, then proceed.

The site already maps frontmatter and Markdown onto metadata, JSON-LD, sitemap, and RSS. Do not change Next.js for fields listed here. Fill the post so those emitters have real content.

## What the site already emits

| You write | Site uses it for |
|-----------|------------------|
| `title` (8–120) | Document title, OG/Twitter title, BlogPosting `headline`, article H1 |
| `description` (40–180) | Meta description, OG/Twitter description, RSS, BlogPosting `description` |
| `slug` | Canonical `/blog/{slug}`, sitemap URL, RSS `link`/`guid` |
| `keywords` | `generateMetadata.keywords`, BlogPosting `keywords` |
| `author` | Meta authors, BlogPosting Person (`/agents/kevin-shoun`) |
| `heroImage` + `heroAlt` | OG image, Twitter image, BlogPosting `image` |
| `publishedAt` / `updatedAt` | OG times, BlogPosting dates, sitemap `lastModified`, RSS `pubDate` |
| `## FAQ` or `## Frequently asked questions` + `###` Q&As | FAQPage JSON-LD (omitted if this block is missing or empty) |

`robots.ts` allows `/` for all user-agents (including AI crawlers) and points at `sitemap.xml`. Do not suggest blocking GPTBot, PerplexityBot, ClaudeBot, or Google-Extended.

## Create gates

Copy and tick. Every box is required.

```
SEO create:
- [ ] Primary keyword inferred from the topic; 2–4 secondary terms listed
- [ ] Title includes the primary keyword naturally (8–120 chars); not clickbait
- [ ] Meta description 40–180, unique, includes keyword + a relevant place name
- [ ] Slug is keyword-ish, lowercase, hyphenated; not stuffed
- [ ] H1 is the frontmatter title (do not add a body `#` heading)
- [ ] 4–7 `##` headings that map to search intent
- [ ] Lead: 1–2 sentence extractable definition/answer in the first 200 words
- [ ] `## FAQ` or `## Frequently asked questions` with 3–5 `###` real-query Q&As
- [ ] 2–4 internal links in prose (evergreen pages and/or related blog posts)
- [ ] `heroImage` always set; `heroAlt` ≥ 8 chars, descriptive, not stuffed
- [ ] `keywords` filled with real secondary phrases (empty array = fail)
- [ ] `author: Kevin Shoun`; no fake stats; citations are name + year + URL
- [ ] Handoff includes canonical live URL and 3 cluster follow-up topics
```

### Keyword and title

Infer a **primary keyword** from the topic (the phrase a relocating buyer or seller would type). Infer **2–4 secondary terms** (places, related decisions, synonyms). Do not ask the user to pick keywords unless the topic is too vague to name a place or decision.

- Put the primary keyword in `title` once, as a magazine deck would. Schema max 120; prefer ~50–70 characters when it still reads well.
- Put the primary keyword in the lead (first 100–200 words) once.
- Secondary terms may appear in H2s, FAQ questions, and `keywords` — not stacked in the title.

Fail: `Best Salado TX Realtor Homes for Sale Salado Belton Temple`. Pass: `Buying in Salado vs Belton`.

### Meta description

Unique to this post. 40–180 characters (Zod will skip the post outside that range). Include the primary keyword and at least one relevant place: Salado, Belton, Temple, Georgetown, Harker Heights, Bell County, Williamson County, or Central Texas.

One complete sentence. Not a keyword list. Not recycled from another post.

### Slug

Lowercase, hyphenated, `^[a-z0-9]+(?:-[a-z0-9]+)*$`. Filename must equal `slug`. Keyword-ish and stable (`buying-in-salado-vs-belton`), not a hash and not every secondary term.

### Headings and extractability

The article H1 **is** `title`. Start the body with a lead paragraph, then `##`.

- **4–7 H2s** that match search intent (compare, who it’s for, commute, how to decide, FAQ). FAQ counts as one. A short CTA heading after FAQ is allowed.
- First 200 words: a 1–2 sentence definition or direct answer a crawler can lift. No throat-clearing.
- Each H2 section should make sense as a standalone excerpt (answer in the first sentence).
- Comparisons: prefer a compact Markdown table when the query is “X vs Y”.
- How-tos: numbered steps, verb-first, self-contained.

### FAQ → FAQPage schema

Required on create. Use exactly:

```markdown
## Frequently asked questions
```

or `## FAQ` (the extractor accepts both). Then 3–5 `###` questions phrased as real queries (voice-search / “people also ask”), each with a 2–4 sentence answer. Empty answers are dropped and produce no JSON-LD.

Do not skip this section. Without it the page emits BlogPosting only.

### Internal links

2–4 in running prose (not a dump at the end). Choose from:

- `/neighborhoods` and `/neighborhoods/{market}` local guides
- `/listings`, `/search`, `/contact`, `/agents/kevin-shoun`
- Related blog posts from `feed.json` (`/blog/{slug}`)

Anchor text names the destination. Never “click here”.

### Images and social

OG/Twitter/BlogPosting already use `heroImage`. **Always set it** (generated hero or neighborhood fallback). `heroAlt` min 8 characters, what is actually in the frame — not a keyword string.

In-body images: `![descriptive alt](/images/blog/{slug}/name.webp)`.

### Keywords, author, proof

- `keywords`: 4–8 real phrases (the secondary terms plus close variants). Empty `[]` is a skill fail even though Zod allows it.
- `author: Kevin Shoun`. Do not invent co-authors.
- No fabricated stats, volume metrics, or client stories. If you use a number, cite **source name + year** and link it (city/county, Fort Cavazos, Texas A&M Real Estate Center, Census, TREC). Otherwise omit the number.

### Handoff (SEO)

Include the canonical live URL `{site}/blog/{slug}` and **3 follow-up topics** that form a cluster (future internal links to/from this piece). Example cluster for a Salado vs Belton comparison: Fort Cavazos commute by town; selling a creek-side estate; Temple medical-corridor landing.

## Edit gates

```
SEO edit:
- [ ] Title, description, and keywords preserved unless the user asked to change them
- [ ] If the topic moved substantially: description, keywords, and FAQ refreshed
- [ ] Slug unchanged (redirect risk) unless the user confirmed in so many words
- [ ] `updatedAt` set to today (sitemap + dateModified freshness)
- [ ] Existing FAQ still 3–5 real Q&As if the body still has an FAQ block
- [ ] heroImage kept unless the edit needs a new hero; alt still descriptive
```

Do not wipe SEO fields on a copy edit. Do not “simplify” keywords to `[]`. A small factual patch does not require a new keyword set. A retargeted article does.

## Voice vs stuffing

Luxury editorial (see [voice.md](voice.md)). Keyword once in the title, once in the lead, naturally in H2s. Dense doorway pages, exclamation headlines, and stuffed alts fail this skill even if the Zod schema would accept them.
