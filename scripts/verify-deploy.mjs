#!/usr/bin/env node
/**
 * Verify critical assets on the live /kevin deploy return the right MIME types.
 * Exits 1 if any asset is missing or served as text/html (typical CF-cached 404).
 *
 *   npm run verify
 *   VERIFY_BASE=https://www.dudewheresmyweb.site/kevin npm run verify
 */
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = join(root, "out");
const base = (process.env.VERIFY_BASE || "https://www.dudewheresmyweb.site/kevin").replace(
  /\/$/,
  ""
);

function findCss() {
  const cssDir = join(outDir, "_next/static/css");
  if (!existsSync(cssDir)) return null;
  const file = readdirSync(cssDir).find((name) => name.endsWith(".css"));
  return file ? `/_next/static/css/${file}` : null;
}

function collectPaths() {
  const paths = ["/", "/favicon.ico", "/images/realty-of-america-logo.png"];
  const css = findCss();
  if (css) paths.push(css);

  const index = join(outDir, "index.html");
  if (existsSync(index)) {
    const html = readFileSync(index, "utf8");
    const matches = html.matchAll(/(?:href|src)="(\/kevin\/_next\/[^"]+)"/g);
    for (const match of matches) {
      const path = match[1].replace(/^\/kevin/, "");
      if (!paths.includes(path)) paths.push(path);
    }
  }

  return paths;
}

async function check(path) {
  const url = `${base}${path}`;
  const response = await fetch(url, { redirect: "manual" });
  const type = response.headers.get("content-type") || "";
  const okStatus = response.status >= 200 && response.status < 400;
  const looksLikeHtml = type.includes("text/html");
  const expectsBinary =
    path.includes("/_next/") ||
    path.includes("/images/") ||
    path.endsWith(".ico") ||
    path.endsWith(".css") ||
    path.endsWith(".js") ||
    path.endsWith(".woff2");

  const ok = okStatus && !(expectsBinary && looksLikeHtml);
  return { url, status: response.status, type, ok };
}

async function main() {
  if (!existsSync(outDir)) {
    console.error("Missing out/. Run `npm run build` first.");
    process.exit(1);
  }

  const paths = collectPaths();
  console.log(`Checking ${paths.length} URLs against ${base}\n`);

  let failed = 0;
  for (const path of paths) {
    const result = await check(path);
    const mark = result.ok ? "OK " : "FAIL";
    console.log(`${mark}  ${result.status}  ${result.type}  ${result.url}`);
    if (!result.ok) failed += 1;
  }

  if (failed) {
    console.error(
      `\n${failed} check(s) failed.\n` +
        "If origin is fine but MIME is text/html, purge Cloudflare cache for /kevin/*\n" +
        "(Dashboard → Caching → Configuration → Purge Cache → Custom: www.dudewheresmyweb.site/kevin)."
    );
    process.exit(1);
  }

  console.log("\nAll checks passed.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
