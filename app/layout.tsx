import type { Metadata } from "next";
import { Cormorant_Garamond, Outfit } from "next/font/google";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { IdxScript } from "@/components/idx/IdxScript";
import { SITE } from "@/lib/content/team";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${SITE.brand} · ${SITE.office}`,
    template: `%s · ${SITE.brand}`,
  },
  description:
    "Luxury real estate representation across Austin, Round Rock, Georgetown, and the Texas Hill Country. Office of Kevin Shoun — Realty of America.",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: SITE.brand,
    title: `${SITE.brand} · ${SITE.office}`,
    description:
      "Central Texas luxury real estate — discreet representation for exceptional homes.",
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE.brand} · ${SITE.office}`,
    description:
      "Central Texas luxury real estate — discreet representation for exceptional homes.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${cormorant.variable} ${outfit.variable} min-h-screen bg-background font-sans text-foreground antialiased`}
      >
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:bg-gold focus:px-4 focus:py-2 focus:text-stone-950"
        >
          Skip to content
        </a>
        <SiteHeader transparent />
        <main id="main-content">{children}</main>
        <SiteFooter />
        <IdxScript />
      </body>
    </html>
  );
}
