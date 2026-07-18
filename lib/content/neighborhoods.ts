export interface Neighborhood {
  slug: string;
  name: string;
  region: string;
  summary: string;
  imageUrl: string;
}

/** Primary local markets for Kevin Shoun / Belton–Temple SEO. */
export const NEIGHBORHOODS: Neighborhood[] = [
  {
    slug: "belton",
    name: "Belton",
    region: "Bell County",
    summary:
      "Lake Belton living, established neighborhoods, and a walkable downtown — one of Central Texas’ most sought-after small-city addresses.",
    imageUrl:
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1400&q=80",
  },
  {
    slug: "temple",
    name: "Temple",
    region: "Bell County",
    summary:
      "Medical-hub energy, strong employment, and a wide range of housing — from classic mid-century streets to newer master-planned communities.",
    imageUrl:
      "https://images.unsplash.com/photo-1449844908441-8829872d2607?auto=format&fit=crop&w=1400&q=80",
  },
  {
    slug: "salado",
    name: "Salado",
    region: "Bell County",
    summary:
      "Creek-side charm, boutique Main Street, and acreage homes — a quieter luxury alternative between Belton and Georgetown.",
    imageUrl:
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1400&q=80",
  },
  {
    slug: "harker-heights",
    name: "Harker Heights",
    region: "Bell County",
    summary:
      "Family-oriented neighborhoods with convenient access to Fort Cavazos, shopping, and the Belton–Temple corridor.",
    imageUrl:
      "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?auto=format&fit=crop&w=1400&q=80",
  },
  {
    slug: "nolanville",
    name: "Nolanville",
    region: "Bell County",
    summary:
      "Growing residential pockets between Belton and Killeen — newer construction, value, and easy highway access.",
    imageUrl:
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1400&q=80",
  },
  {
    slug: "central-texas",
    name: "Greater Central Texas",
    region: "Belton · Temple · Surrounds",
    summary:
      "Beyond the core cities — ranch acreage, Lake Belton recreation, and neighboring towns Kevin’s clients relocate to and from.",
    imageUrl:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1400&q=80",
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
