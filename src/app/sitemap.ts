import type { MetadataRoute } from "next";

import { SITE_URL } from "@/data/company";
import { PRODUCTS } from "@/data/products";

/**
 * Routes that exist but are deliberately excluded: /quote/thank-you is
 * noindex. /projects, /bulk-supply and /faq are not built yet and are not
 * listed, so there is no 404 churn when they land. (/trade-accounts was in
 * that list while /trade sat nine lines below it in STATIC: the page had been
 * built and the comment never caught up.)
 */
const STATIC = [
  "",
  "/products",
  "/quality",
  "/plant",
  "/delivery",
  "/trade",
  "/about",
  "/contact",
  "/quote",
  "/privacy",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    ...STATIC.map((path) => ({
      url: `${SITE_URL}${path}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: path === "" ? 1 : 0.8,
    })),
    ...PRODUCTS.map((product) => ({
      url: `${SITE_URL}/products/${product.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.9,
    })),
  ];
}
