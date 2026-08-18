# Publish

Direct commit to `main` on `jmvegas021/roa-web`. Vercel production deploys on that push. No PR. No Vercel login. No `.env`.

Do not commit if the [seo.md](seo.md) checklist failed. Revise the Markdown first.

## Path allowlist

Commit **only**:

- `content/blog/{slug}.md`
- `public/images/blog/{slug}/*`

Refuse anything else (layouts, env, `lib/`, other `public/` trees, skill files). If the user asks to “just update the header too”, refuse that part.

## Prefer GitHub file API (Desktop / Agent / any host with GitHub)

This is the default even if a local clone has unrelated dirty files.

1. Confirm the GitHub connector can write `jmvegas021/roa-web`.
2. Create or update `content/blog/{slug}.md` on branch `main`.
   - Create: omit existing-file SHA.
   - Update: fetch the current file, send its SHA with the new content.
3. If there are new binaries under `public/images/blog/{slug}/`, commit each on `main` (base64 for GitHub Contents API). Skip this when using a neighborhood fallback path.
4. Prefer one commit that includes all allowlisted files if the host can push multiple files; otherwise sequential commits on `main` are acceptable.
5. Commit messages, sentence case, why-focused:
   - Create: `Publish blog post: Buying in Salado vs Belton.`
   - Edit: `Update blog post: Buying in Salado vs Belton — Fort Cavazos commute.`

Do not force-push. Do not change Git config. Do not skip hooks on a local commit unless the user explicitly asks.

## Local git (Cursor / Claude Code)

Use only when GitHub write tools are missing but this repo is the open workspace.

1. Leave unrelated WIP unstaged. The tree may already have other edits — ignore them.
2. Write only allowlisted files.
3. Stage exact paths, never the whole repo:

```bash
git add -- "content/blog/{slug}.md" "public/images/blog/{slug}"
git status
git diff --cached
```

4. If `git status` shows any staged file outside the allowlist, unstage it and stop.
5. Confirm `HEAD` is `main` (or that `origin/main` is the push target). Do not mix this commit onto a feature branch.
6. Commit, then `git push origin main`.

## No GitHub

Return the full Markdown (and note image paths) in the reply. State clearly: **not published**. Do not invent a live URL as if Vercel already built it.

## After a successful push

- Canonical / live URL: `https://www.kevinshoun.com/blog/{slug}`
- Vercel often needs 1–2 minutes. If the URL 404s immediately, say so.
- `feed.json` may lag until the deploy finishes. Do not re-fetch it as proof of failure within that window.

## Never

- Commit `.env`, credentials, or `node_modules`
- `git add -A`, `git add .`, or `git commit -a`
- Open a PR “for safety” unless the user asks — the contract is direct `main`
- Request Admin or Vercel team access
