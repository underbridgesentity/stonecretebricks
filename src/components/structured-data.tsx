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
const WEEK = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

/**
 * schema.org wants DayOfWeek values, not a human range. Passing the display
 * string straight through meant "Monday to Friday" was silently discarded and
 * the opening hours never surfaced in search at all.
 */
function expandDays(label: string): string[] {
  const range = label.match(/^(\w+)\s+to\s+(\w+)$/i);
  if (range) {
    const from = WEEK.indexOf(capitalise(range[1] ?? ""));
    const to = WEEK.indexOf(capitalise(range[2] ?? ""));
    if (from >= 0 && to >= from) return WEEK.slice(from, to + 1);
  }
  const single = capitalise(label.trim());
  return WEEK.includes(single) ? [single] : [];
}

function capitalise(word: string): string {
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}

export function OrganisationSchema() {
  const hours = COMPANY.hours.value ?? [];

  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "HomeAndConstructionBusiness",
    "@id": `${SITE_URL}/#organisation`,
    name: "Stonecrete Bricks",
    // No "(Pty) Ltd": the registration is still pending, and guessing a legal
    // entity in machine-readable form is what the comment above forbids.
    alternateName: ["Stone Crete Bricks"],
    url: SITE_URL,
    logo: `${SITE_URL}/icon.svg`,
    image: `${SITE_URL}/images/site/plant.jpg`,
    description:
      "South African manufacturer of concrete stock bricks, maxi bricks, hollow blocks and paving bricks, made to SANS 1215 and SANS 1058.",
    areaServed: COMPANY.region.value
      ? [{ "@type": "AdministrativeArea", name: COMPANY.region.value }]
      : undefined,
    openingHoursSpecification: hours
      .filter((h) => h.opens && h.closes)
      .map((h) => ({
        "@type": "OpeningHoursSpecification",
        dayOfWeek: expandDays(h.days),
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
