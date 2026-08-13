import type { AgentProfile } from "@/lib/idx/types";
import { withBasePath } from "@/lib/site/basePath";

export const TEAM: AgentProfile[] = [
  {
    id: "kevin-shoun",
    slug: "kevin-shoun",
    name: "Kevin Shoun",
    title: "Real estate professional · Office of Kevin Shoun",
    email: "kevin.shoun@realtyofamerica.com",
    phone: "(909) 991-4367",
    bio: "Precision is the advantage. With Realty of America, Kevin Shoun brings a proven plan to Central Texas — from Salado and Belton to Temple, Georgetown, and the communities beyond. Since 2020, he has built a practice around high-income professionals who expect discretion, decisive counsel, and zero wasted motion. Twenty-plus years of military leadership forged his instinct for high-stakes decisions and unforgiving timelines. Kevin protects your time, sharpens every opportunity, and stewards real estate as a long-term wealth instrument — with the calm, flawless execution that makes the next move feel inevitable.",
    specialties: [
      "Buyers & sellers",
      "Military relocation",
      "Vacant land",
      "Farm & ranch",
      "Investors",
      "Bell & Williamson Counties",
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
  address: "Salado · Belton · Temple · Georgetown",
};
