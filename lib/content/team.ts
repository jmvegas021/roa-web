import type { AgentProfile } from "@/lib/idx/types";
import { withBasePath } from "@/lib/site/basePath";

export const TEAM: AgentProfile[] = [
  {
    id: "kevin-shoun",
    slug: "kevin-shoun",
    name: "Kevin Shoun",
    title: "Broker Associate · Office of Kevin Shoun",
    email: "kevin@realtyofamerica.com",
    phone: "(512) 555-0148",
    bio: "Kevin Shoun leads a Central Texas practice rooted in discretion, market fluency, and white-glove representation for luxury buyers and sellers across Austin, Round Rock, Georgetown, and the Hill Country.",
    specialties: [
      "Luxury residential",
      "Hill Country estates",
      "Relocation",
      "Off-market advisory",
    ],
    imageUrl: withBasePath("/images/kevin-shoun.webp"),
    isPrimary: true,
  },
];

export const SITE = {
  brand: "Realty of America",
  office: "Office of Kevin Shoun",
  region: "Central Texas",
  phone: "(512) 555-0148",
  email: "kevin@realtyofamerica.com",
  address: "Austin · Round Rock · Georgetown · Hill Country",
};
