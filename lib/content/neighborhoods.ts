export interface Neighborhood {
  slug: string;
  name: string;
  region: string;
  summary: string;
  imageUrl: string;
}

export const NEIGHBORHOODS: Neighborhood[] = [
  {
    slug: "austin",
    name: "Austin",
    region: "Travis County",
    summary:
      "From Westlake estates to downtown penthouses — Austin remains Central Texas’ cultural and luxury anchor.",
    imageUrl:
      "https://images.unsplash.com/photo-1531218150217-54595bc2b934?auto=format&fit=crop&w=1400&q=80",
  },
  {
    slug: "round-rock",
    name: "Round Rock",
    region: "Williamson County",
    summary:
      "Master-planned communities, golf-course living, and strong schools with a polished suburban rhythm.",
    imageUrl:
      "https://images.unsplash.com/photo-1449844908441-8829872d2607?auto=format&fit=crop&w=1400&q=80",
  },
  {
    slug: "georgetown",
    name: "Georgetown",
    region: "Williamson County",
    summary:
      "Historic square charm meets refined new construction — one of the region’s most sought-after addresses.",
    imageUrl:
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1400&q=80",
  },
  {
    slug: "hill-country",
    name: "Hill Country",
    region: "Dripping Springs · Lakeway · Spicewood",
    summary:
      "Oak canopies, acreage compounds, and quiet luxury west of Austin — privacy without compromise.",
    imageUrl:
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1400&q=80",
  },
  {
    slug: "cedar-park",
    name: "Cedar Park",
    region: "Williamson County",
    summary:
      "Elevated family living with trail systems, dining, and easy access to the greater Austin corridor.",
    imageUrl:
      "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?auto=format&fit=crop&w=1400&q=80",
  },
  {
    slug: "lakeway",
    name: "Lakeway",
    region: "Travis County",
    summary:
      "Lake Travis living — resort amenities, panoramic water views, and a leisurely luxury lifestyle.",
    imageUrl:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1400&q=80",
  },
];

export const TESTIMONIALS = [
  {
    quote:
      "Kevin’s guidance through our Westlake purchase was precise, discreet, and entirely without pressure. We felt represented — not sold to.",
    name: "A. & R. Morrison",
    detail: "Westlake buyers",
  },
  {
    quote:
      "From pricing strategy to closing, the office moved with the calm confidence you want when a home of this caliber is on the line.",
    name: "Elena Vargas",
    detail: "Hill Country seller",
  },
  {
    quote:
      "Relocating to Georgetown could have been chaotic. Kevin’s team made every step feel intentional.",
    name: "David Chen",
    detail: "Georgetown relocation",
  },
];
