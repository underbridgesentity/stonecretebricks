import type { Metadata } from "next";
import { Montserrat } from "next/font/google";

import { SiteFooter } from "@/components/shell/site-footer";
import { SiteHeader } from "@/components/shell/site-header";
import { SkipLink } from "@/components/shell/skip-link";
import { OrganisationSchema } from "@/components/structured-data";
import { COMPANY, SITE_URL } from "@/data/company";

import "./globals.css";

/**
 * Two static weights, not the variable axis. The brand locks ExtraBold and
 * Regular, and --font-weight-* is wiped in globals.css so nothing else can be
 * used. Naming explicit weights makes next/font fetch static instances, which
 * is lighter here than the 100-900 axis.
 *
 * display: swap plus next/font's computed fallback metrics is the CLS control.
 * `optional` would risk shipping the fold in Arial, and the ExtraBold is the brand.
 */
const sans = Montserrat({
  variable: "--font-sans-face",
  subsets: ["latin"],
  weight: ["400", "800"],
  display: "swap",
  fallback: ["system-ui", "Arial", "sans-serif"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  /* The city leads, not the province: "bricks Polokwane" is what a buyer
     actually types. The province carries the delivery-range signal instead. */
  title: {
    default: `Stonecrete Bricks, concrete bricks and blocks in ${COMPANY.suburb.value}`,
    template: "%s | Stonecrete Bricks",
  },
  description: `Concrete stock bricks, maxi bricks, hollow blocks and pavers, made in ${COMPANY.suburb.value} to SANS 1215 and SANS 1058. Specs and coverage published. Delivered across ${COMPANY.region.value}.`,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_ZA",
    siteName: "Stonecrete Bricks",
    url: SITE_URL,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-ZA">
      <body className={sans.variable}>
        <OrganisationSchema />
        <SkipLink />
        <SiteHeader />
        <main id="main">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
