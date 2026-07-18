/** Must match `basePath` in next.config.ts — used for plain <img> / CSS asset URLs. */
export const BASE_PATH = "/kevin";

/** Prefix a root-relative path with the site basePath (no-op for absolute URLs). */
export function withBasePath(path: string): string {
  if (!path.startsWith("/") || path.startsWith("//")) return path;
  if (path === BASE_PATH || path.startsWith(`${BASE_PATH}/`)) return path;
  return `${BASE_PATH}${path}`;
}
