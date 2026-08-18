import assert from "node:assert/strict";
import { afterEach, test } from "node:test";
import { getPublicIdxConfig } from "@/lib/idx/public-config";
import {
  absoluteUrl,
  getSiteUrl,
  PRODUCTION_SITE_URL,
} from "@/lib/site/siteUrl";

const originalSiteUrl = process.env.NEXT_PUBLIC_SITE_URL;
const originalNodeEnvironment = process.env.NODE_ENV;
const originalVercelUrl = process.env.VERCEL_URL;

afterEach(() => {
  restoreEnvironmentVariable("NEXT_PUBLIC_SITE_URL", originalSiteUrl);
  restoreEnvironmentVariable("NODE_ENV", originalNodeEnvironment);
  restoreEnvironmentVariable("VERCEL_URL", originalVercelUrl);
});

test("production canonical ignores a Vercel preview hostname", () => {
  delete process.env.NEXT_PUBLIC_SITE_URL;
  process.env.NODE_ENV = "production";
  process.env.VERCEL_URL = "roa-web-preview.vercel.app";

  assert.equal(getSiteUrl(), PRODUCTION_SITE_URL);
  assert.equal(absoluteUrl("/about"), `${PRODUCTION_SITE_URL}/about`);
});

test("configured canonical origin is normalized and shared with IDX", () => {
  process.env.NEXT_PUBLIC_SITE_URL = "https://example.com///";

  assert.equal(getSiteUrl(), "https://example.com");
  assert.equal(getPublicIdxConfig().siteUrl, "https://example.com");
});

test("development uses localhost when no origin is configured", () => {
  delete process.env.NEXT_PUBLIC_SITE_URL;
  process.env.NODE_ENV = "development";

  assert.equal(getSiteUrl(), "http://localhost:3000");
});

function restoreEnvironmentVariable(
  name: string,
  originalValue: string | undefined
) {
  if (originalValue === undefined) {
    delete process.env[name];
    return;
  }
  process.env[name] = originalValue;
}
