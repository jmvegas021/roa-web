# Realty of America — Design System Master

Office of Kevin Shoun · Central Texas · Luxury editorial

## Brand Voice

Restrained, confident, editorial. Quiet luxury — boutique, private, appointment-first. Million-dollar listing aesthetic — not suburban generic, not teal SaaS. Photography-first. Extreme negative space. Champagne accent used sparingly. Powersuit Blue family as the ink foundation.

Prefer: *collection / consult / discretion / by appointment* over *inventory / inquire / deals*.

## Source brand (ROA.com)

Official ROA Marketing Hub colors:

| Name | Hex | Role |
|------|-----|------|
| Powersuit Blue | `#10295A` | Primary brand / logo lettering |
| Legacy Green | `#1A9175` | Logo A accents only |
| Power Pink | `#DB1263` | Secondary brand (not used on this office site) |
| Misty Grey | `#E6E7E8` | Light surface family |
| Barely There | `#F1F2F2` | Near-white |
| Pure White | `#FFFFFF` | Logo / light UI |

Public site CTAs use Powersuit Blue on white. This office site elevates that blue into deep ink for dark editorial luxury.

## Color Tokens

| Token | Value | Usage |
|-------|-------|-------|
| `--color-stone-950` | `#070E1C` | Page background (ink navy) |
| `--color-stone-900` | `#0E1830` | Alternate sections / elevated plane |
| `--color-stone-800` | `#1A2744` | Subtle surface (not default cards) |
| `--color-stone-700` | `#2A3A56` | Borders / form edges |
| `--color-stone-50` | `#F2F4F7` | Primary text (cool white) |
| `--color-stone-400` | `#9AA6B8` | Muted / supporting text |
| `--color-gold` | `#C5A87A` | Champagne accent, CTAs, hairlines |
| `--color-gold-muted` | `#A88F63` | Hover / pressed champagne |
| `--color-roa-blue` | `#10295A` | Official Powersuit Blue cue |
| `--color-roa-green` | `#1A9175` | Logo green only |

## Logo

Asset: `/images/roa-kevin-shoun-logo.png` — combined ROA + Kevin Shoun lockup (white lettering, Legacy Green accents) for dark chrome.

| Location | Rule |
|----------|------|
| **Header** | Required — `BrandLockup` ~300px (Kevin already in mark; no office subtitle) |
| **Footer** | Required — `BrandLockup` ~340px |
| **Hero** | Forbidden — typography/copy brand only |

Alt text: `Realty of America — Kevin Shoun`. Never place the logo image in the first viewport hero stack.

## Typography

| Role | Family | Notes |
|------|--------|-------|
| Display | **Cormorant Garamond** | Oversized headlines |
| Body / UI | **Outfit** | Geometric sans; nav, body, forms |

Scale:

- Hero display: `clamp(2.85rem, 7.5vw, 5.75rem)` · leading ~0.92
- Section heads: `clamp(2.25rem, 4vw, 3.5rem)` · leading ~1.05
- Body: `1rem` / `1.65–1.7` line-height (never below 16px on mobile)

## Motion

1. Staggered hero fade-up (region → headline → support → CTA)
2. Slow ken-burns on hero imagery
3. Soft media hover scale on listings / agents (`scale-[1.04]`, ~700ms ease-out)

Respect `prefers-reduced-motion: reduce` — disable ken-burns, stagger, and hover scale.

## Composition Rules

- **First viewport:** Region/brand text (not logo image), one headline, one supporting sentence, one CTA group, full-bleed hero. Nothing else.
- **Full-bleed hero only** — no inset media cards, stats, or pills in the hero.
- **No cards by default.** Cards only when they contain interaction (listing selection, forms).
- **One job per section:** one headline, one short support line.
- Dual CTAs: primary champagne (collection) + ghost (private consult).
- Stats / social proof, if ever used, stay **below the fold** and must be real — never invent volume metrics.

## Interaction & a11y

- Touch targets ≥ 44×44px (`min-h-11`)
- `cursor-pointer` on all links/buttons
- Champagne `focus-visible` rings (`outline: 2px solid gold`)
- Form inputs ≥ 16px; labeled fields; live status on submit
- CTA contrast: champagne fill + ink text

## Spacing

Section vertical rhythm: `py-24`–`py-32` desktop; generous mobile. Content max-width `max-w-7xl` (≈80rem) for grids; editorial copy `max-w-3xl`. Inner pages offset sticky/absolute header with `pt-32` / `pt-36`.

## Anti-patterns (do not ship)

- Purple / indigo gradients or glassmorphism overload
- Cream + terracotta “AI luxury” default
- Flat corporate Powersuit Blue full-page backgrounds (use ink navy instead)
- Teal SaaS (Legacy Green as UI fill)
- Pill clusters, stat strips, emoji icons in hero
- Inset hero images, floating badges, promo stickers
- Inter / Roboto / Playfair as primary fonts
- Dense broadsheet newspaper layouts
- Fake brokerage stats copied from demos

## References

- Presentation lessons: `design-system/references/ashford-vale-notes.md`
