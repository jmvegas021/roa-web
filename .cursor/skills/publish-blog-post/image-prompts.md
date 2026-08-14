# Image prompts

Hero photography should feel like the site: photography-first, extreme negative space, quiet luxury, Central Texas light. No people grinning at the camera, no handshake stock, no text or logos in the frame.

Do **not** treat Cursor `GenerateImage` as the only path. Claude Desktop / Agent may have a different image tool, or none.

Never block publish on a missing image tool.

## When a host can generate images

1. Generate one **hero** (landscape, ~16:9 or 3:2). Optional: one in-body still if the draft needs it.
2. Photoreal. No illustration, no CGI glow, no watermark, no typography.
3. Save under `public/images/blog/{slug}/`. Prefer WebP (`hero.webp`). PNG/JPEG is acceptable if the host cannot emit WebP — then set `heroImage` to the real filename.
4. Commit those files with the Markdown (allowlist only). See [publish.md](publish.md).
5. Always set `heroImage` (OG, Twitter, and BlogPosting image). `heroAlt` is at least 8 characters and describes what is actually in the picture — not a keyword string.

### Prompt template

Use this direction; swap the place and time of day:

```
Photoreal editorial photograph, Central Texas, quiet luxury real estate.
Subject: [limestone house under live oaks / Salado Creek at low water / Lake Belton shoreline at blue hour / Georgetown square courthouse at golden hour / open ranch pasture with distant oaks].
Camera: full-frame, 35–50mm, shallow but readable depth, natural light, no flash.
Mood: restrained, private, appointment-first. Empty of people. No cars in the foreground. No signage. No logos. No text.
Color: ink-navy shadows, warm limestone, champagne-hour light. Not teal, not terracotta, not HDR suburban listing photo.
Aspect: 16:9 landscape. High detail, magazine print quality.
```

Keep the frame specific to the post’s place. A relocation piece to Belton should not use a generic Austin skyline.

## When no image tool exists

Point `heroImage` at an existing site asset. Do not copy files out of `public/images/neighborhoods/` unless you are writing a *new* file under `public/images/blog/{slug}/` (allowlisted). Referencing the existing public path is enough.

| Post is about | `heroImage` |
|---------------|-------------|
| Salado, creek, Main Street | `/images/neighborhoods/salado.webp` |
| Belton, Lake Belton | `/images/neighborhoods/belton.webp` |
| Temple, medical hub | `/images/neighborhoods/temple.webp` |
| Georgetown, square, Williamson | `/images/neighborhoods/georgetown.webp` |
| Harker Heights, Fort Cavazos commute | `/images/neighborhoods/harker-heights.webp` |
| Land, ranch, acreage, broader region | `/images/neighborhoods/central-texas.webp` |
| Unclear | `/images/neighborhoods/salado.webp` |

Write honest `heroAlt` for that file (creek-side Salado canopy, Lake Belton, Temple skyline, Williamson County Courthouse, Harker Heights residence, Central Texas pasture/bluebonnets).

## Edits

Replace or add images only if the requested edit needs it. Keep the existing hero otherwise.

## Do not

- Put the ROA logo in a generated hero.
- Use people, children, military uniforms, or identifiable private homes.
- Block the commit because conversion to WebP failed.
- Write images outside `public/images/blog/{slug}/` (except referencing already-deployed `/images/neighborhoods/…`).
