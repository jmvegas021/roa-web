#!/usr/bin/env node
/**
 * Preview the static export as it will appear under /kevin on Apache.
 *
 * Next exports files to `out/` (not nested under kevin/), but asset URLs
 * are prefixed with /kevin. This script mirrors out/ → .preview/kevin/
 * and serves the parent folder so http://localhost:4173/kevin/ works.
 */
import { cpSync, mkdirSync, rmSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { spawn } from "node:child_process";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = join(root, "out");
const previewRoot = join(root, ".preview");
const kevinDir = join(previewRoot, "kevin");
const port = Number(process.env.PORT || 4173);

if (!existsSync(outDir)) {
  console.error("Missing out/. Run `npm run build` first.");
  process.exit(1);
}

rmSync(previewRoot, { recursive: true, force: true });
mkdirSync(kevinDir, { recursive: true });
cpSync(outDir, kevinDir, { recursive: true });

console.log(`\nStatic preview: http://localhost:${port}/kevin/\n`);

const child = spawn(
  "npx",
  ["--yes", "serve", previewRoot, "-l", String(port), "--no-port-switching"],
  { stdio: "inherit", cwd: root, shell: true }
);

child.on("exit", (code) => process.exit(code ?? 0));
