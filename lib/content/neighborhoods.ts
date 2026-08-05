import { withBasePath } from "@/lib/site/basePath";

export interface Neighborhood {
  slug: string;
  name: string;
  region: string;
  summary: string;
  imageUrl: string;
}

/** Primary local markets for Kevin Shoun — Bell & Williamson Counties. */
export const NEIGHBORHOODS: Neighborhood[] = [
  {
    slug: "salado",
    name: "Salado",
    region: "Bell County",
    summary:
      "Creek-side charm, boutique Main Street, and limestone estates under live oaks — a quieter luxury address between Belton and Georgetown.",
    imageUrl: withBasePath("/images/neighborhoods/salado.webp"),
  },
  {
    slug: "belton",
    name: "Belton",
    region: "Bell County",
    summary:
      "Lake Belton living, established neighborhoods, and a walkable downtown — one of Central Texas’ most sought-after small-city addresses.",
    imageUrl: withBasePath("/images/neighborhoods/belton.webp"),
  },
  {
    slug: "temple",
    name: "Temple",
    region: "Bell County",
    summary:
      "Medical-hub energy, strong employment, and a wide range of housing — from classic mid-century streets to newer master-planned communities.",
    imageUrl: withBasePath("/images/neighborhoods/temple.webp"),
  },
  {
    slug: "georgetown",
    name: "Georgetown",
    region: "Williamson County",
    summary:
      "Historic square living with room to grow — a Williamson County favorite for professionals seeking character, schools, and northern corridor access.",
    imageUrl: withBasePath("/images/neighborhoods/georgetown.webp"),
  },
  {
    slug: "harker-heights",
    name: "Harker Heights",
    region: "Bell County",
    summary:
      "Family-oriented neighborhoods with convenient access to Fort Cavazos, shopping, and the Belton–Temple corridor — a natural fit for military relocation.",
    imageUrl: withBasePath("/images/neighborhoods/harker-heights.webp"),
  },
  {
    slug: "central-texas",
    name: "Greater Central Texas",
    region: "Bell · Williamson · Surrounds",
    summary:
      "Beyond the core cities — ranch acreage, vacant land, Lake Belton recreation, and neighboring towns Kevin’s clients relocate to and from.",
    imageUrl: withBasePath("/images/neighborhoods/central-texas.webp"),
  },
];

export const TESTIMONIALS = [
  {
    quote:
      "Kevin’s guidance through our Belton purchase was precise, discreet, and entirely without pressure. We felt represented — not sold to.",
    name: "A. & R. Morrison",
    detail: "Belton buyers",
  },
  {
    quote:
      "From pricing strategy to closing, the office moved with the calm confidence you want when a home of this caliber is on the line.",
    name: "Elena Vargas",
    detail: "Temple seller",
  },
  {
    quote:
      "Relocating to Salado could have been chaotic. Kevin’s team made every step feel intentional.",
    name: "David Chen",
    detail: "Salado relocation",
  },
];
