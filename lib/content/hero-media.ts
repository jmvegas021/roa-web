import { IDX_CITY_MARKETS } from "@/lib/idx/search-urls";

const CLOUDINARY_CLOUD = "kut8hlrv";
const HERO_MP4_ID = "hero-720p_tyhlpd";
const HERO_WEBM_ID = "hero-720p_himmfb";

function cloudinaryVideo(
  publicId: string,
  ext: "mp4" | "webm",
  transforms: string
): string {
  return `https://res.cloudinary.com/${CLOUDINARY_CLOUD}/video/upload/${transforms}/${publicId}.${ext}`;
}

function cloudinaryVideoPoster(publicId: string): string {
  // so_0 is black on this clip; so_2 is the first usable frame.
  return `https://res.cloudinary.com/${CLOUDINARY_CLOUD}/video/upload/so_2,f_jpg,q_auto:good,w_1920/${publicId}.jpg`;
}

/**
 * Homepage hero media via Cloudinary CDN.
 * Uploads: MP4 = hero-720p_tyhlpd, WebM = hero-720p_himmfb.
 * Transforms keep delivery ~3–7MB at 720p.
 */
export const HERO_MEDIA = {
  webmSrc: cloudinaryVideo(
    HERO_WEBM_ID,
    "webm",
    "f_webm,q_auto:eco,vc_auto,w_1280"
  ),
  mp4Src: cloudinaryVideo(
    HERO_MP4_ID,
    "mp4",
    "f_mp4,q_auto:eco,vc_auto,w_1280"
  ),
  /** @deprecated Prefer mp4Src / webmSrc */
  videoSrc: cloudinaryVideo(
    HERO_MP4_ID,
    "mp4",
    "f_mp4,q_auto:eco,vc_auto,w_1280"
  ),
  posterSrc: cloudinaryVideoPoster(HERO_MP4_ID),
  credit: "Hero video — Office of Kevin Shoun",
  creditUrl: undefined as string | undefined,
} as const;

/** City chips → on-site /search (IDX results embed via city IDs). */
export const HERO_CITY_CHIPS = IDX_CITY_MARKETS.filter((city) =>
  ["Salado", "Belton", "Temple", "Georgetown"].includes(city.label)
).map((city) => ({
  label: city.label,
  city: city.label,
}));
