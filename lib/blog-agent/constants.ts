import type { PlaceHero } from "./types";

export const CLUSTER_FILE_PATH = "content/editorial/cluster.json";
export const BLOG_MARKDOWN_PREFIX = "content/blog/";
export const BLOG_IMAGE_PREFIX = "public/images/blog/";
export const MAX_IMAGE_BYTES = 1_200_000;
export const ALLOWED_IMAGE_EXTENSIONS = ["webp", "jpg", "jpeg", "png"] as const;
export const COOLDOWN_DAYS = 6;
export const MIN_WORD_COUNT = 900;
export const MAX_WORD_COUNT = 1600;
export const MIN_H2_COUNT = 4;
export const MAX_H2_COUNT = 7;
export const MIN_FAQ_COUNT = 3;
export const MAX_FAQ_COUNT = 5;
export const MIN_INTERNAL_LINKS = 2;
export const MAX_INTERNAL_LINKS = 4;
export const MAX_MARKDOWN_CHARS = 200_000;
export const DEFAULT_GITHUB_OWNER = "jmvegas021";
export const DEFAULT_GITHUB_REPO = "roa-web";
export const DEFAULT_GITHUB_BRANCH = "main";
export const SITE_ORIGIN = "https://www.kevinshoun.com";

export const PLACE_HEROES: Record<string, PlaceHero> = {
  salado: {
    image: "/images/neighborhoods/salado.webp",
    alt: "Live oaks and limestone along Salado Creek in Salado, Texas",
  },
  belton: {
    image: "/images/neighborhoods/belton.webp",
    alt: "Lake Belton shoreline and established streets in Belton, Texas",
  },
  temple: {
    image: "/images/neighborhoods/temple.webp",
    alt: "Tree-lined residential streets in Temple, Texas",
  },
  georgetown: {
    image: "/images/neighborhoods/georgetown.webp",
    alt: "The historic courthouse square in Georgetown, Texas",
  },
  "harker-heights": {
    image: "/images/neighborhoods/harker-heights.webp",
    alt: "Family neighborhoods in Harker Heights near the Fort Cavazos corridor",
  },
  "central-texas": {
    image: "/images/neighborhoods/central-texas.webp",
    alt: "Open Central Texas pasture and live oaks under late light",
  },
};

export const INTERNAL_LINK_PATTERN =
  /\[[^\]]{2,80}\]\((\/(?:neighborhoods|listings|search|contact|agents|blog)[^)\s]*)\)/g;

export const BANNED_PROOF_PATTERNS = [
  /in today's market/i,
  /whether you're a first-time/i,
  /my clients often/i,
  /i['’]ve sold \d+/i,
  /hot property/i,
  /game-changer/i,
  /let['’]s get started/i,
  /average days on market/i,
  /unlock your dream/i,
];
