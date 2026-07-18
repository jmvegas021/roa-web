import type { AgentProfile } from "@/lib/idx/types";
import { withBasePath } from "@/lib/site/basePath";

export const TEAM: AgentProfile[] = [
  {
    id: "kevin-shoun",
    slug: "kevin-shoun",
    name: "Kevin Shoun",
    title: "Broker Associate · Office of Kevin Shoun",
    email: "kevin.shoun@realtyofamerica.com",
    phone: "(909) 991-4367",
    bio: "Kevin Shoun leads a Central Texas practice rooted in discretion, market fluency, and white-glove representation for buyers and sellers across Belton, Temple, and the surrounding markets.",
    specialties: [
      "Residential",
      "Central Texas",
      "Relocation",
      "Buyer & seller representation",
    ],
    imageUrl: withBasePath("/images/kevin-shoun.webp"),
    isPrimary: true,
  },
];

export const SITE = {
  brand: "Realty of America",
  office: "Office of Kevin Shoun",
  region: "Central Texas",
  phone: "(909) 991-4367",
  email: "kevin.shoun@realtyofamerica.com",
  address: "Belton · Temple · Central Texas",
};
