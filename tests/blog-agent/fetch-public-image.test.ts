import assert from "node:assert/strict";
import { test } from "node:test";
import { fetchPublicImage, type PublicImageFetcher } from "@/lib/blog-agent/fetch-public-image";

const JPEG = Buffer.from([0xff, 0xd8, 0xff, 0xe0, ...Buffer.alloc(32, 1)]);

function lookupOf(address: string): PublicImageFetcher["lookup"] {
  return async () => [{ address, family: 4 }];
}

function okJpegFetch(): PublicImageFetcher["fetch"] {
  return async () =>
    new Response(JPEG, {
      status: 200,
      headers: { "content-type": "image/jpeg", "content-length": String(JPEG.length) },
    });
}

test("rejects http, credentials, localhost, and private IPs before fetch", async () => {
  const fetcher: PublicImageFetcher = {
    fetch: async () => {
      throw new Error("fetch should not run");
    },
    lookup: lookupOf("1.1.1.1"),
  };

  await assert.rejects(
    () => fetchPublicImage("http://example.com/hero.jpg", fetcher),
    /https/
  );
  await assert.rejects(
    () => fetchPublicImage("https://user:pass@example.com/hero.jpg", fetcher),
    /credentials/
  );
  await assert.rejects(
    () => fetchPublicImage("https://localhost/hero.jpg", fetcher),
    /not allowed/
  );
  await assert.rejects(
    () => fetchPublicImage("https://127.0.0.1/hero.jpg", fetcher),
    /private/
  );
  await assert.rejects(
    () => fetchPublicImage("https://10.0.0.8/hero.jpg", fetcher),
    /private/
  );
  await assert.rejects(
    () => fetchPublicImage("https://192.168.1.9/hero.jpg", fetcher),
    /private/
  );
});

test("rejects a hostname that resolves to a private address", async () => {
  await assert.rejects(
    () =>
      fetchPublicImage("https://example.com/hero.jpg", {
        fetch: okJpegFetch(),
        lookup: lookupOf("10.0.0.1"),
      }),
    /private/
  );
});

test("downloads a public https jpeg", async () => {
  const buffer = await fetchPublicImage("https://cdn.example.com/hero.jpg", {
    fetch: okJpegFetch(),
    lookup: lookupOf("1.1.1.1"),
  });
  assert.equal(buffer.equals(JPEG), true);
});

test("follows an https redirect and rejects an http redirect", async () => {
  const followHttps: PublicImageFetcher["fetch"] = async (input) => {
    const url = String(input);
    if (url.includes("start.example.com")) {
      return new Response(null, {
        status: 302,
        headers: { location: "https://cdn.example.com/hero.jpg" },
      });
    }
    return new Response(JPEG, { status: 200 });
  };

  const buffer = await fetchPublicImage("https://start.example.com/go", {
    fetch: followHttps,
    lookup: lookupOf("1.1.1.1"),
  });
  assert.equal(buffer.equals(JPEG), true);

  await assert.rejects(
    () =>
      fetchPublicImage("https://start.example.com/go", {
        fetch: async () =>
          new Response(null, {
            status: 302,
            headers: { location: "http://cdn.example.com/hero.jpg" },
          }),
        lookup: lookupOf("1.1.1.1"),
      }),
    /https/
  );
});
