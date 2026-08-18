# Realty of America — Office of Kevin Shoun

Luxury marketing site for Central Texas real estate, with hybrid **IDX Broker** integration:

- **API** → featured listings, agents, lead capture (server-only)
- **Widgets + dynamic wrapper** → full MLS search & detail pages

## Stack

- Next.js 15 (App Router) · TypeScript · Tailwind CSS v4
- Cormorant Garamond + Outfit
- Zod env / lead validation

## Quick start

```bash
cp .env.example .env.local
npm install
npm run dev
```

Without IDX credentials, the site runs on curated **mock listings**. Forms do **not** fake a thank-you unless IDX or Resend actually accepts the lead.

## Environment variables

| Variable | Required | Purpose |
|----------|----------|---------|
| `IDX_API_KEY` | For live API | 22-char access key from IDX Control Panel → Access Control |
| `IDX_ACCOUNT_ID` | Optional | Account reference / docs |
| `IDX_ANCILLARY_KEY` | Optional | Partner ancillary key (higher rate limits) |
| `IDX_API_VERSION` | Optional | Default `1.8.0` |
| `NEXT_PUBLIC_SITE_URL` | Recommended | Canonical site URL (OG + wrapper docs) |
| `NEXT_PUBLIC_IDX_SUBDOMAIN` | For widgets | e.g. `youraccount.idxbroker.com` |
| `NEXT_PUBLIC_IDX_QUICK_SEARCH_ID` | Optional | Widget ID from IDX Control Panel |
| `NEXT_PUBLIC_IDX_SHOWCASE_ID` | Optional | Showcase widget ID |
| `RESEND_API_KEY` | For inbox email | Resend API key — emails Kevin when a form is submitted |
| `LEAD_NOTIFY_EMAIL` | Optional | Inbox To: address. Defaults to `kevin.shoun@realtyofamerica.com` |
| `RESEND_FROM_EMAIL` | Optional | From: override until `kevinshoun.com` is verified on Resend |
| `LEAD_FROM_EMAIL` | Optional | Alternate From: (`Office of Kevin Shoun <noreply@kevinshoun.com>`) |

**Never** prefix `IDX_API_KEY` with `NEXT_PUBLIC_`. All API calls go through `lib/idx/IdxBrokerClient.ts` on the server.

## IDX Control Panel setup

1. **API key** — Home → Access Control → create/copy access key → set `IDX_API_KEY`.
2. **Featured listings** — Ensure office/agent listings are marked featured in IDX so `GET /clients/featured` returns inventory.
3. **Widgets** — Design → Widgets → create Quick Search / Showcase → copy IDs into `NEXT_PUBLIC_IDX_*` and set `NEXT_PUBLIC_IDX_SUBDOMAIN`.
4. **Dynamic wrapper** — Design → Wrappers → Dynamic Wrapper URL → production URL:
   ```
   https://YOUR_DOMAIN/wrapper
   ```
   MLS results and details render inside `#idxStart` while keeping site chrome.
5. **Approved domains** — Add your production (and preview) domains under IDX approved websites for MLS compliance.
6. **Leads** — Valuation and consultation forms post via Server Action → IDX `PUT /leads/lead` (address field, not `property`) **and** a Resend email to `LEAD_NOTIFY_EMAIL` / Kevin’s office inbox. Duplicate emails return IDX 409 and are treated as success. Confirm lead preferences in IDX CRM settings.

### Inbox email (Resend)

IDX CRM alone is easy to miss. Create a free [Resend](https://resend.com) account with Kevin’s email, add `RESEND_API_KEY` to Vercel **Production** and **Preview**, and verify `kevinshoun.com` (or use Resend’s onboarding From: via `RESEND_FROM_EMAIL` until DNS is set). Forms succeed if **either** Resend or IDX works; they fail clearly if neither is configured.

### Rate limits

Platinum-class accounts ≈ **500 requests/hour** per access key. Featured listings are cached with `revalidate: 300` (5 minutes).

### Hybrid model (important)

The IDX API **does not** return full MLS search results. This site intentionally:

| Need | Mechanism |
|------|-----------|
| Home / `/listings` gallery | API featured listings → custom UI |
| Contact / listing inquiry | Server Action → leads API |
| Full MLS search & details | Widgets + `/wrapper` + IDX-hosted pages |

## Routes

| Path | Purpose |
|------|---------|
| `/` | Luxury home |
| `/listings` | Featured inventory |
| `/listings/[id]` | Featured detail + inquiry |
| `/search` | Quick search widget + advanced links |
| `/wrapper` | IDX dynamic wrapper template |
| `/agents` · `/agents/kevin-shoun` | Team |
| `/about` · `/contact` · `/neighborhoods` | Marketing |
| `/api/idx/featured` | JSON proxy of featured listings (server) |

## Design system

See [`design-system/MASTER.md`](./design-system/MASTER.md) for tokens, composition rules, and anti-patterns.

## Deploy (Vercel — primary)

Default build is a **Next.js server app** (SSR, Server Actions, Image Optimization). The IDX API key stays in Vercel env vars and never reaches the browser.

1. Import [jmvegas021/roa-web](https://github.com/jmvegas021/roa-web) in Vercel (already linked if using this repo).
2. Set Production env:
   - `NEXT_PUBLIC_SITE_URL=https://www.kevinshoun.com`
   - `IDX_API_KEY=…` (optional until live MLS)
   - `RESEND_API_KEY=…` (required for inbox delivery)
   - `LEAD_NOTIFY_EMAIL=kevin.shoun@realtyofamerica.com` (optional; this is the default)
   - `RESEND_FROM_EMAIL=…` if the domain is not verified yet
   - widget vars as needed
3. Deploy — Framework Preset: Next.js, Build Command: `npm run build`, Output: default (no static export).

```bash
npm run build
npm start
```

IDX Dynamic Wrapper URL:

```
https://www.kevinshoun.com/wrapper
```

## Optional: static FTP export (`/kevin`)

For Apache hosting under `https://www.dudewheresmyweb.site/kevin`:

```bash
npm run build:static   # output: 'export' + basePath /kevin → out/
npm run preview:static
FTP_PASSWORD='…' npm run deploy:ftp
npm run verify:static
```

Static mode has no Server Actions; use the Vercel deploy for live IDX leads.