#!/usr/bin/env node
/**
 * Upload the static export (out/) to ftp.dudewheresmyweb.site under /kevin.
 *
 * Credentials via env (never commit secrets):
 *   FTP_HOST     default: ftp.dudewheresmyweb.site
 *   FTP_USER     default: dude
 *   FTP_PASSWORD required
 *   FTP_REMOTE   default: kevin
 *   FTP_SECURE   set to "1" for explicit FTPS
 *
 * Example:
 *   FTP_PASSWORD='…' npm run deploy
 */
import { existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { Client } from "basic-ftp";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = join(root, "out");

const host = process.env.FTP_HOST || "ftp.dudewheresmyweb.site";
const user = process.env.FTP_USER || "dude";
const password = process.env.FTP_PASSWORD;
const remoteDir = (process.env.FTP_REMOTE || "kevin").replace(/^\/+|\/+$/g, "");
const secure = process.env.FTP_SECURE === "1";

if (!password) {
  console.error(
    "FTP_PASSWORD is required.\nExample: FTP_PASSWORD='…' npm run deploy"
  );
  process.exit(1);
}

if (!existsSync(outDir)) {
  console.error("Missing out/. Run `npm run build` first.");
  process.exit(1);
}

async function main() {
  const client = new Client(60_000);
  client.ftp.verbose = process.env.FTP_VERBOSE === "1";

  console.log(`Connecting to ${host} as ${user}…`);
  await client.access({
    host,
    user,
    password,
    secure: secure || false,
  });

  console.log(`Uploading out/ → /${remoteDir}/ (clearing remote dir first)…`);
  await client.ensureDir(remoteDir);
  await client.clearWorkingDir();
  await client.uploadFromDir(outDir);

  client.close();
  console.log(
    `\nDeployed. Open https://www.dudewheresmyweb.site/${remoteDir}/\n`
  );
}

main().catch((error) => {
  console.error("Deploy failed:", error.message || error);
  process.exit(1);
});
