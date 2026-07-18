/**
 * Asset prefix for plain <img> URLs.
 * Empty on Vercel (root). Set NEXT_PUBLIC_BASE_PATH=/kevin for static FTP builds.
 */
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/** Prefix a root-relative path with the site basePath (no-op for absolute URLs). */
export function withBasePath(path: string): string {
  if (!path.startsWith("/") || path.startsWith("//")) return path;
  if (!BASE_PATH) return path;
  if (path === BASE_PATH || path.startsWith(`${BASE_PATH}/`)) return path;
  return `${BASE_PATH}${path}`;
}
