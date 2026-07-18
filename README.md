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

Without IDX credentials, the site runs on curated **mock listings** and accepts leads locally (logged server-side).

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
6. **Leads** — Contact form posts via Server Action → `PUT /leads/lead`. Confirm lead preferences in IDX CRM settings.

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

All routes are served under **`/kevin`** in production (e.g. `/kevin/listings/`).

## Design system

See [`design-system/MASTER.md`](./design-system/MASTER.md) for tokens, composition rules, and anti-patterns.

## Deploy (static → dudewheresmyweb.site/kevin)

This site is a **static export**, not an SPA. Each route is a real HTML file under `/kevin` (e.g. `/kevin/listings/index.html`). There is no client-side catch-all router.

| Script | Purpose |
|--------|---------|
| `npm run build` | Next.js `output: 'export'` → `out/` with `basePath: /kevin` |
| `npm run preview` | Local check at http://localhost:4173/kevin/ |
| `npm run deploy` | FTP upload of `out/` → `ftp.dudewheresmyweb.site/kevin` |

```bash
cp .env.example .env.local
# set NEXT_PUBLIC_SITE_URL=https://www.dudewheresmyweb.site/kevin
# optional: IDX_* at build time to bake live featured listings into HTML

npm install
npm run build
npm run preview   # sanity-check locally

FTP_PASSWORD='your-ftp-password' npm run deploy
npm run verify
```

If the page loads but CSS/JS 404 with MIME `text/html`, **Cloudflare cached an early 404**. Purge cache for `www.dudewheresmyweb.site/kevin` (CF Dashboard → Caching → Purge), then hard-refresh. Also turn **Rocket Loader off** for this host/path — it rewrites Next script tags and breaks the app.

**Deploy layout**

```
out/                    ← Next export (asset URLs already use /kevin/…)
  index.html
  listings/index.html
  _next/…
  .htaccess

FTP remote:
  /kevin/               ← upload contents of out/ here
```

Contact form uses `mailto:` (no server actions on static hosting). IDX widgets still load client-side when subdomain/IDs are set. Featured listings/agents are snapshotted at **build** time.

### IDX Dynamic Wrapper (when ready)

Point IDX Control Panel → Wrappers → Dynamic Wrapper URL to:

```
https://www.dudewheresmyweb.site/kevin/wrapper/
```
