# Publish

Claude talks to **kevinshoun.com**, never GitHub. That is what avoids the 403 from GitHub MCP in Desktop/Cowork.

Do not commit if the [seo.md](seo.md) checklist failed. Revise the Markdown first.

## Path allowlist

The server will only write:

- `content/blog/{slug}.md`
- `content/editorial/cluster.json` (follow-up topics)

Refuse to ask it to touch layouts, env, `lib/`, or other `public/` trees.

## Kevin’s computer (no setup script)

Kevin does **not** install Git, Node, a PAT, or a local script. One-time in Claude Desktop or Cowork:

1. Ask the site operator for `BLOG_PUBLISH_SECRET` (they generate it).
2. Settings → Connectors → Add custom connector
   - Name: `Kevin Shoun Blog`
   - URL: `https://www.kevinshoun.com/api/blog/mcp`
   - Header: `Authorization: Bearer <the secret>`
3. Restart Claude. You should see `list_blog_posts`, `suggest_next_topic`, `get_blog_post`, `publish_blog_post`.

Do not put the secret in this skill file. Do not ask Kevin for Admin GitHub, a PAT, or Vercel login.

## Publish tools (required)

Use the **Kevin Shoun Blog** connector. Never GitHub MCP. Never the Anthropic GitHub connector.

### Inventory / fetch

```
list_blog_posts
```

Existing post source (edit mode):

```
get_blog_post
  slug: buying-in-salado-vs-belton
```

Public fallback if the connector is down: `GET https://www.kevinshoun.com/blog/feed.json` (titles/slugs only — not the Markdown body).

### Commit (create or edit)

```
publish_blog_post
  markdown: <full Markdown file, including frontmatter>
  mode: create
  followUps:
    - Follow-up topic one
    - Follow-up topic two
    - Follow-up topic three
```

Use `mode: edit` when updating a live slug. Set `updatedAt` to today. Do not change `slug` unless the user confirmed.

If `publish_blog_post` is missing, POST the same JSON to `https://www.kevinshoun.com/api/blog/publish` with `Authorization: Bearer <secret>` from the connector env (do not invent a secret). If you cannot call HTTP either, return the Markdown and say **not published**.

On success, hand off `canonicalUrl`. Vercel often needs 1–2 minutes.

## Cursor / Claude Code with the repo open

Still prefer `publish_blog_post` so Cowork and Desktop behave the same. Local `git add` is a last resort and only for `content/blog/{slug}.md` (never `git add -A`).

## Never

- GitHub MCP (`push_files`, `create_or_update_file`, `get_file_contents`)
- Anthropic GitHub connector
- Commit `.env`, credentials, or `node_modules`
- Request Admin or Vercel team access
- Put `BLOG_PUBLISH_SECRET` or `BLOG_GITHUB_TOKEN` in chat logs if you can avoid it
