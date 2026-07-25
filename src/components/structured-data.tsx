import { addressLine, COMPANY, SITE_URL } from "@/data/company";

/**
 * HomeAndConstructionBusiness rather than a bare LocalBusiness: it is a valid
 * LocalBusiness subtype and a better fit for a manufacturer with a yard.
 *
 * alternateName carries both spellings while the naming settles, and the full
 * "Stonecrete Bricks" is always the primary name, never bare "Stonecrete",
 * which belongs to a different company in Johannesburg.
 *
 * Fields the client has not supplied are omitted rather than guessed. An
 * invented address in structured data is worse than a missing one.
 */
export function OrganisationSchema() {
  const hours = COMPANY.hours.value ?? [];

  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "HomeAndConstructionBusiness",
    "@id": `${SITE_URL}/#organisation`,
    name: "Stonecrete Bricks",
    alternateName: ["Stone Crete Bricks", "Stonecrete Bricks (Pty) Ltd"],
    url: SITE_URL,
    logo: `${SITE_URL}/icon.svg`,
    image: `${SITE_URL}/images/site/yard.jpg`,
    description:
      "South African manufacturer of concrete stock bricks, maxi bricks, hollow blocks and paving bricks, made to SANS 1215 and SANS 1058.",
    priceRange: "$$",
    areaServed: COMPANY.region.value
      ? [{ "@type": "AdministrativeArea", name: COMPANY.region.value }]
      : undefined,
    openingHoursSpecification: hours
      .filter((h) => h.opens && h.closes)
      .map((h) => ({
        "@type": "OpeningHoursSpecification",
        dayOfWeek: h.days,
        opens: h.opens,
        closes: h.closes,
      })),
  };

  if (COMPANY.email.value) schema.email = COMPANY.email.value;
  if (COMPANY.phone.value) schema.telephone = COMPANY.phone.value;
  if (COMPANY.vat.value) schema.vatID = COMPANY.vat.value;

  const address = addressLine();
  if (address) {
    schema.address = {
      "@type": "PostalAddress",
      streetAddress: COMPANY.address.street.value,
      addressLocality: COMPANY.address.city.value,
      addressRegion: COMPANY.address.province.value,
      postalCode: COMPANY.address.postalCode.value,
      addressCountry: "ZA",
    };
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
