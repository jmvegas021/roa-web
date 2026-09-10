# Publish

Claude talks to **kevinshoun.com**, never GitHub. That is what avoids the 403 from GitHub MCP in Desktop/Cowork.

Do not commit if the [seo.md](seo.md) checklist failed. Revise the Markdown first.

## Path allowlist

The server will only write:

- `content/blog/{slug}.md`
- `content/editorial/cluster.json` (follow-up topics)
- `public/images/blog/{slug}/*.{webp,jpg,jpeg,png}`

Refuse layouts, env, `lib/`, logos, and other `public/` trees.

## Kevin’s computer (no setup script)

Kevin does **not** install Git, Node, a PAT, or a local script. One-time in Claude Desktop or Cowork:

1. Ask the site operator for `BLOG_PUBLISH_SECRET`.
2. Settings → Connectors → Add custom connector
   - Name: `Kevin Shoun Blog`
   - URL: `https://www.kevinshoun.com/api/blog/mcp?key=<BLOG_PUBLISH_SECRET>` (secret in the URL; Claude.ai/Cowork does not send custom headers)
   - Authentication: **None** (do not click Connect, do not use OAuth, do not add an Authorization header)
3. Restart Claude.

Do not put the secret in this skill file.

## Tools

Never GitHub MCP. Never the Anthropic GitHub connector.

| Kevin wants | Tool |
|---|---|
| See what is live | `list_blog_posts` |
| Next scheduled topic | `suggest_next_topic` |
| Read a post | `get_blog_post` |
| Write or rewrite a post | `publish_blog_post` (`mode: create` or `edit`) |
| Delete a post | `delete_blog_post` (`confirm: true`) |
| Stock photos | `list_hero_images` |
| Photos already on this post | `list_post_images` |
| Add a photo | `upload_blog_image` (`imageUrl`) or `create_blog_image_upload` then PUT the local file |
| Point hero at an existing path | `set_post_hero` |
| Remove an uploaded photo | `delete_blog_image` (`confirm: true`) |

Public fallback if the connector is down: `GET https://www.kevinshoun.com/blog/feed.json` (titles only).

### Create or edit copy

```
publish_blog_post
  markdown: <full Markdown file>
  mode: create
```

Use `mode: edit` on a live slug. Set `updatedAt` to today. Do not change `slug` unless the user confirmed.

### Images

The server commits images to `public/images/blog/{slug}/` on GitHub (then Vercel deploys them). Never GitHub MCP. Never type base64. Never tell Kevin the MCP cannot accept images.

**Public source (Library of Congress, Wikimedia, a CDN):**

```
upload_blog_image
  slug: things-to-do-in-salado-texas
  imageUrl: https://tile.loc.gov/image-services/iiif/service:pnp:highsm:29700:29760/full/1600,/0/default.jpg
  filename: hero.jpg
  alt: The white two-story galleried porch of the historic Stagecoach Inn beneath shade trees in Salado, Texas
  setAsHero: true
```

Do not crop-then-rehost. Use the public https file. The server downloads it and commits it.

**Local file in Cowork/Desktop (Kevin attached a photo, or you cropped one):**

```
create_blog_image_upload
  slug: things-to-do-in-salado-texas
  filename: hero.webp
  alt: Historic white two-story saloon building with wraparound porches in downtown Salado, Texas
  setAsHero: true
```

Then PUT the raw bytes (not base64) to `putUrl`:

```
curl -T ./hero.webp '<putUrl>'
```

If PUT/network fails, fall back to `upload_blog_image` + `imageUrl` of the original public source. Do not ask Kevin to host a file. Do not shrink and type base64.

Writes need `?key=<BLOG_PUBLISH_SECRET>` on the connector URL. Claude.ai/Cowork does not send Authorization. Auth None, not OAuth. Do not click Connect.

If `create_blog_image_upload` is missing, the connector is stale: remove **Kevin Shoun Blog** and add it again.

For an in-body still, omit `setAsHero` and insert `![alt](/images/blog/{slug}/{filename})` then `publish_blog_post` mode edit.

If there is no new file, `list_hero_images` then `set_post_hero`. Do not invent paths.

On success, hand off `canonicalUrl`. Vercel often needs 1–2 minutes.

## Never

- GitHub MCP (`push_files`, `create_or_update_file`, `get_file_contents`)
- Anthropic GitHub connector
- `delete_blog_post` without the user asking to delete
- Put `BLOG_PUBLISH_SECRET` or `BLOG_GITHUB_TOKEN` in chat
