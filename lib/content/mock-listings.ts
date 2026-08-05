import type { LuxuryListing } from "@/lib/idx/types";
import { withBasePath } from "@/lib/site/basePath";

const lake = withBasePath("/images/neighborhoods/listing-lake.webp");
const estate = withBasePath("/images/neighborhoods/listing-estate.webp");
const suburban = withBasePath("/images/neighborhoods/listing-suburban.webp");
const ranch = withBasePath("/images/neighborhoods/listing-ranch.webp");
const georgetown = withBasePath("/images/neighborhoods/georgetown.webp");
const temple = withBasePath("/images/neighborhoods/temple.webp");

export const MOCK_LISTINGS: LuxuryListing[] = [
  {
    id: "mock-salado-1",
    listingId: "mock-salado-1",
    address: "3248 Hester Way",
    city: "Salado",
    state: "TX",
    zip: "76571",
    price: 875000,
    bedrooms: 4,
    bathrooms: 3.5,
    sqft: 3200,
    status: "Active",
    imageUrl: estate,
    gallery: [estate, lake],
    description:
      "Limestone estate living under mature live oaks — refined Main Street proximity with the privacy professionals expect in Salado.",
    agentName: "Kevin Shoun",
  },
  {
    id: "mock-belton-2",
    listingId: "mock-belton-2",
    address: "6166 Lavaca Drive",
    city: "Belton",
    state: "TX",
    zip: "76513",
    price: 485000,
    bedrooms: 4,
    bathrooms: 3,
    sqft: 2400,
    status: "Active",
    imageUrl: suburban,
    gallery: [suburban, lake],
    description:
      "Lake Belton corridor residence with easy downtown access — built for professionals who want space, schools, and weekend water nearby.",
    agentName: "Kevin Shoun",
  },
  {
    id: "mock-georgetown-3",
    listingId: "mock-georgetown-3",
    address: "188 Berry Creek Lane",
    city: "Georgetown",
    state: "TX",
    zip: "78628",
    price: 725000,
    bedrooms: 4,
    bathrooms: 3.5,
    sqft: 3100,
    status: "Active",
    imageUrl: georgetown,
    gallery: [georgetown, suburban],
    description:
      "Williamson County living near the historic square — a Georgetown address with room to entertain and commute with intention.",
    agentName: "Kevin Shoun",
  },
  {
    id: "mock-temple-4",
    listingId: "mock-temple-4",
    address: "3111 Morning Glory Drive",
    city: "Temple",
    state: "TX",
    zip: "76502",
    price: 395000,
    bedrooms: 3,
    bathrooms: 2.5,
    sqft: 2100,
    status: "Active",
    imageUrl: temple,
    gallery: [temple, suburban],
    description:
      "Temple medical-corridor convenience with a quiet residential street — ideal for relocating professionals who need calendars to stay intact.",
    agentName: "Kevin Shoun",
  },
  {
    id: "mock-ranch-5",
    listingId: "mock-ranch-5",
    address: "County Road 226",
    city: "Salado",
    state: "TX",
    zip: "76571",
    price: 1250000,
    bedrooms: 3,
    bathrooms: 2.5,
    sqft: 2800,
    status: "Active",
    imageUrl: ranch,
    gallery: [ranch, estate],
    description:
      "Farm-and-ranch acreage with bluebonnet pasture views — vacant land and homestead opportunity for clients building long-term wealth.",
    agentName: "Kevin Shoun",
  },
  {
    id: "mock-harker-6",
    listingId: "mock-harker-6",
    address: "1204 Knights Way",
    city: "Harker Heights",
    state: "TX",
    zip: "76548",
    price: 425000,
    bedrooms: 4,
    bathrooms: 3,
    sqft: 2650,
    status: "Active",
    imageUrl: suburban,
    gallery: [suburban, lake],
    description:
      "Harker Heights home positioned for Fort Cavazos proximity — military relocation without chaos, from offer to keys.",
    agentName: "Kevin Shoun",
  },
];

export const HERO_IMAGE = withBasePath(
  "/images/neighborhoods/listing-lake.webp"
);
