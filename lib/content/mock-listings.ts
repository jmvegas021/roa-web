import type { LuxuryListing } from "@/lib/idx/types";

const hero =
  "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1600&q=80";
const lake =
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=80";
const modern =
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80";
const ranch =
  "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1600&q=80";
const hill =
  "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=1600&q=80";
const estate =
  "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=80";

export const MOCK_LISTINGS: LuxuryListing[] = [
  {
    id: "mock-westlake-1",
    listingId: "mock-westlake-1",
    address: "4200 Westlake Drive",
    city: "Austin",
    state: "TX",
    zip: "78746",
    price: 4250000,
    bedrooms: 5,
    bathrooms: 5.5,
    sqft: 6200,
    status: "Active",
    imageUrl: lake,
    gallery: [lake, modern, estate],
    description:
      "A refined Westlake estate with hill-country views, a chef’s kitchen, and seamless indoor-outdoor living across landscaped terraces.",
    agentName: "Kevin Shoun",
  },
  {
    id: "mock-georgetown-2",
    listingId: "mock-georgetown-2",
    address: "188 Berry Creek Lane",
    city: "Georgetown",
    state: "TX",
    zip: "78628",
    price: 1875000,
    bedrooms: 4,
    bathrooms: 4,
    sqft: 4100,
    status: "Active",
    imageUrl: modern,
    gallery: [modern, hill],
    description:
      "Contemporary Georgetown residence with soaring ceilings, a private courtyard, and proximity to the historic square.",
    agentName: "Kevin Shoun",
  },
  {
    id: "mock-dripping-3",
    listingId: "mock-dripping-3",
    address: "910 Ranch Road 12",
    city: "Dripping Springs",
    state: "TX",
    zip: "78620",
    price: 2650000,
    bedrooms: 4,
    bathrooms: 3.5,
    sqft: 3850,
    status: "Active",
    imageUrl: ranch,
    gallery: [ranch, hill, estate],
    description:
      "Hill Country compound on oak-studded acreage — quiet luxury with a pool pavilion and guest casita.",
    agentName: "Kevin Shoun",
  },
  {
    id: "mock-roundrock-4",
    listingId: "mock-roundrock-4",
    address: "2501 Teravista Club Drive",
    city: "Round Rock",
    state: "TX",
    zip: "78665",
    price: 1125000,
    bedrooms: 4,
    bathrooms: 3.5,
    sqft: 3400,
    status: "Active",
    imageUrl: estate,
    gallery: [estate, modern],
    description:
      "Elevated golf-course living in Round Rock with a light-filled great room and resort-style backyard.",
    agentName: "Kevin Shoun",
  },
  {
    id: "mock-lakeway-5",
    listingId: "mock-lakeway-5",
    address: "105 Lohmans Crossing Road",
    city: "Lakeway",
    state: "TX",
    zip: "78734",
    price: 3190000,
    bedrooms: 5,
    bathrooms: 5,
    sqft: 5100,
    status: "Active",
    imageUrl: hero,
    gallery: [hero, lake, modern],
    description:
      "Lakeway statement home with panoramic water glimpses, a wine cellar, and a private primary wing.",
    agentName: "Kevin Shoun",
  },
  {
    id: "mock-cedarpark-6",
    listingId: "mock-cedarpark-6",
    address: "702 Buttercup Creek Boulevard",
    city: "Cedar Park",
    state: "TX",
    zip: "78613",
    price: 895000,
    bedrooms: 4,
    bathrooms: 3,
    sqft: 2900,
    status: "Active",
    imageUrl: hill,
    gallery: [hill, ranch],
    description:
      "Polished Cedar Park residence designed for effortless entertaining and everyday Central Texas living.",
    agentName: "Kevin Shoun",
  },
];

export const HERO_IMAGE =
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=2400&q=80";
