import type { Metadata } from "next";
import { Cormorant_Garamond, Outfit } from "next/font/google";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { IdxScript } from "@/components/idx/IdxScript";
import { JsonLd } from "@/components/seo/JsonLd";
import { SITE } from "@/lib/content/team";
import {
  buildKevinPersonSchema,
  buildOrganizationSchema,
  buildWebSiteSchema,
} from "@/lib/seo/structuredData";
import {
  DEFAULT_DESCRIPTION,
  DEFAULT_KEYWORDS,
  getSiteUrl,
} from "@/lib/site/siteUrl";
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

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${SITE.office} | ${SITE.brand} · Central Texas`,
    template: `%s · ${SITE.brand}`,
  },
  description: DEFAULT_DESCRIPTION,
  keywords: DEFAULT_KEYWORDS,
  applicationName: SITE.brand,
  authors: [{ name: "Kevin Shoun", url: `${siteUrl}/agents/kevin-shoun` }],
  creator: SITE.office,
  publisher: SITE.brand,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: SITE.brand,
    title: `${SITE.office} | ${SITE.brand}`,
    description: DEFAULT_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE.office} | ${SITE.brand}`,
    description: DEFAULT_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  category: "real estate",
  icons: {
    icon: [{ url: "/images/realty-of-america-logo.png", type: "image/png" }],
    apple: [{ url: "/images/realty-of-america-logo.png", type: "image/png" }],
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
        <NuqsAdapter>
          <JsonLd
            data={[
              buildOrganizationSchema(),
              buildWebSiteSchema(),
              buildKevinPersonSchema(),
            ]}
          />
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
        </NuqsAdapter>
      </body>
    </html>
  );
}
