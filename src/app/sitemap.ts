import type { MetadataRoute } from "next";

import { SITE_URL } from "@/data/company";
import { PRODUCTS } from "@/data/products";

/**
 * Routes that exist but are deliberately excluded: /quote/thank-you is
 * noindex. /projects, /bulk-supply, /trade-accounts and /faq are not built
 * yet and are not listed, so there is no 404 churn when they land.
 */
const STATIC = ["", "/products", "/quality", "/plant", "/delivery", "/about", "/contact", "/quote"];

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
