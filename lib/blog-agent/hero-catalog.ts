import { PLACE_HEROES } from "./constants";

export interface HeroAsset {
  path: string;
  alt: string;
  useWhen: string;
}

export function listHeroAssets(): HeroAsset[] {
  return [
    {
      path: PLACE_HEROES.salado.image,
      alt: PLACE_HEROES.salado.alt,
      useWhen: "Salado, creek, Main Street, village",
    },
    {
      path: PLACE_HEROES.belton.image,
      alt: PLACE_HEROES.belton.alt,
      useWhen: "Belton, Lake Belton, downtown Belton",
    },
    {
      path: PLACE_HEROES.temple.image,
      alt: PLACE_HEROES.temple.alt,
      useWhen: "Temple, medical corridor",
    },
    {
      path: PLACE_HEROES.georgetown.image,
      alt: PLACE_HEROES.georgetown.alt,
      useWhen: "Georgetown, square, Williamson County",
    },
    {
      path: PLACE_HEROES["harker-heights"].image,
      alt: PLACE_HEROES["harker-heights"].alt,
      useWhen: "Harker Heights, Fort Cavazos, PCS, military commute",
    },
    {
      path: PLACE_HEROES["central-texas"].image,
      alt: PLACE_HEROES["central-texas"].alt,
      useWhen: "Land, ranch, acreage, broader Central Texas",
    },
    {
      path: "/images/neighborhoods/listing-lake.webp",
      alt: "Lake water and shoreline typical of Central Texas lake living",
      useWhen: "Lake-focused listing or Belton water recreation",
    },
    {
      path: "/images/neighborhoods/listing-estate.webp",
      alt: "A quiet estate setting under live oaks in Central Texas",
      useWhen: "Estate, luxury listing, creek-side selling",
    },
    {
      path: "/images/neighborhoods/listing-ranch.webp",
      alt: "Open ranch pasture and fence line in Central Texas",
      useWhen: "Ranch, acreage, rural land",
    },
    {
      path: "/images/neighborhoods/listing-suburban.webp",
      alt: "Established residential street in a Central Texas neighborhood",
      useWhen: "Conventional neighborhood, family relocation housing",
    },
  ];
}
