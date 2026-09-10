import {
  ALLOWED_IMAGE_EXTENSIONS,
  BLOG_IMAGE_PREFIX,
  MAX_IMAGE_BYTES,
} from "./constants";

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const FILE_STEM_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function assertBlogSlug(slug: string): string {
  const value = slug.trim();
  if (!SLUG_PATTERN.test(value)) {
    throw new Error("Slug must be lowercase hyphenated (e.g. buying-in-salado-vs-belton).");
  }
  return value;
}

export function publicBlogImagePath(slug: string, filename: string): string {
  return `/images/blog/${assertBlogSlug(slug)}/${sanitizeImageFilename(filename)}`;
}

export function gitBlogImagePath(slug: string, filename: string): string {
  return `${BLOG_IMAGE_PREFIX}${assertBlogSlug(slug)}/${sanitizeImageFilename(filename)}`;
}

export function gitBlogImageDir(slug: string): string {
  return `${BLOG_IMAGE_PREFIX}${assertBlogSlug(slug)}`;
}

export function matchingImageFilename(
  filename: string,
  detected: (typeof ALLOWED_IMAGE_EXTENSIONS)[number]
): string {
  const ext = filename.split(".").pop() ?? "";
  const kind = ext === "jpeg" ? "jpg" : ext;
  const actual = detected === "jpeg" ? "jpg" : detected;
  if (kind === actual) return filename.replace(/\.jpeg$/, ".jpg");
  return `${filename.replace(/\.[^.]+$/, "")}.${actual}`;
}

export function sanitizeImageFilename(filename: string): string {
  const trimmed = filename.trim().toLowerCase();
  if (trimmed.includes("..") || trimmed.includes("/") || trimmed.includes("\\")) {
    throw new Error(
      "Image filename must be like hero.webp or lake-belton.jpg (webp, jpg, jpeg, or png)."
    );
  }
  const match = trimmed.match(/^([a-z0-9]+(?:-[a-z0-9]+)*)\.(webp|jpg|jpeg|png)$/);
  if (!match || !FILE_STEM_PATTERN.test(match[1])) {
    throw new Error(
      "Image filename must be like hero.webp or lake-belton.jpg (webp, jpg, jpeg, or png)."
    );
  }
  return `${match[1]}.${match[2]}`;
}

export function extensionForMediaType(mediaType: string): string {
  const type = mediaType.trim().toLowerCase();
  if (type === "image/webp") return "webp";
  if (type === "image/jpeg" || type === "image/jpg") return "jpg";
  if (type === "image/png") return "png";
  throw new Error("Images must be webp, jpeg, or png.");
}

export function decodeImageData(data: string): Buffer {
  const stripped = data.replace(/^data:image\/[a-zA-Z0-9.+-]+;base64,/, "").replace(/\s/g, "");
  const buffer = Buffer.from(stripped, "base64");
  if (buffer.length < 24) throw new Error("Image data is empty or invalid base64.");
  if (buffer.length > MAX_IMAGE_BYTES) {
    throw new Error(`Image must be at most ${Math.round(MAX_IMAGE_BYTES / 1000)}KB.`);
  }
  return buffer;
}

export function detectImageExtension(buffer: Buffer): (typeof ALLOWED_IMAGE_EXTENSIONS)[number] {
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) return "jpg";
  if (
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47
  ) {
    return "png";
  }
  if (
    buffer.toString("ascii", 0, 4) === "RIFF" &&
    buffer.toString("ascii", 8, 12) === "WEBP"
  ) {
    return "webp";
  }
  throw new Error("File is not a webp, jpeg, or png image.");
}

export function isSiteImagePath(path: string): boolean {
  return (
    /^\/images\/neighborhoods\/[a-z0-9-]+\.(webp|jpg|jpeg|png)$/.test(path) ||
    /^\/images\/blog\/[a-z0-9-]+\/[a-z0-9-]+\.(webp|jpg|jpeg|png)$/.test(path)
  );
}
