/**
 * Every fact about the business, in one file.
 *
 * The source company profile left telephone, email, website, address and
 * social media as literal blank underscores, so most of this is outstanding.
 * Rather than invent values, unknown facts are `null` and render as a visible
 * pending marker. `pnpm specs:audit` lists them, and the production build
 * refuses to run while a blocking fact is still missing.
 *
 * Nothing in the codebase hardcodes a phone number, address or URL. Fill in
 * here and the whole site, the structured data and the sitemap follow.
 */

export type Confidence = "confirmed" | "assumed" | "pending";

export type Fact<T> = {
  value: T | null;
  status: Confidence;
  /** Where the value came from, or what is needed to confirm it. */
  source?: string;
  /** Blocking facts fail the production build while pending. */
  blocking?: boolean;
};

function confirmed<T>(value: T, source: string): Fact<T> {
  return { value, status: "confirmed", source };
}

function assumed<T>(value: T, source: string): Fact<T> {
  return { value, status: "assumed", source };
}

function pending<T>(source: string, blocking = true): Fact<T> {
  return { value: null, status: "pending", source, blocking };
}

export const SITE_URL = "https://stonecretebricks.co.za";

export const COMPANY = {
  /**
   * Always both words, everywhere. Never bare "Stonecrete": that is a
   * different cement products manufacturer in Meredale, Johannesburg.
   * See docs/brand.md.
   */
  name: confirmed("Stonecrete Bricks", "brand board, July 2026"),
  tagline: confirmed("Strength in every brick", "brand board"),
  descriptor: confirmed(
    "South African manufacturer of concrete bricks, blocks and pavers",
    "company profile",
  ),

  /** Where the plant is and where the trucks reach. */
  region: assumed("Gauteng", "not stated in the profile, confirm with the client"),
  suburb: pending<string>("plant suburb, for the hero line and local SEO"),

  phone: pending<string>("landline or mobile, formatted 011 123 4567"),
  /** Digits only, international format without the plus, for wa.me links. */
  whatsapp: pending<string>("WhatsApp business number, digits only, e.g. 27821234567"),
  email: assumed("info@stonecretebricks.co.za", "domain is registered, confirm the mailbox exists"),

  address: {
    street: pending<string>("plant and yard street address"),
    suburb: pending<string>("suburb"),
    city: pending<string>("city"),
    province: assumed("Gauteng", "confirm with the client"),
    postalCode: pending<string>("postal code"),
    country: confirmed("South Africa", "company profile"),
  },

  hours: assumed(
    [
      { days: "Monday to Friday", opens: "07:00", closes: "17:00" },
      { days: "Saturday", opens: "07:00", closes: "13:00" },
      { days: "Sunday", opens: null, closes: null },
    ],
    "typical yard hours, confirm. Saturday matters: trade buys on Saturday",
  ),

  /** The promise on the thank-you page. Only publish what they will honour. */
  responseHours: assumed(4, "four business hours recommended, needs client sign-off"),

  registration: pending<string>("company registration number", false),
  vat: pending<string>("VAT number, or confirmation of non-VAT status", false),

  social: {
    facebook: pending<string>("Facebook page URL", false),
    instagram: pending<string>("Instagram profile URL", false),
  },
} as const;

/* ------------------------------------------------------------------------ */

/** Read a fact, or null if it is still outstanding. */
export function factValue<T>(fact: Fact<T>): T | null {
  return fact.value;
}

/** A wa.me deep link carrying a context-aware opening message. */
export function whatsappLink(message: string): string | null {
  const number = COMPANY.whatsapp.value;
  if (!number) return null;
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

export function telLink(): string | null {
  const phone = COMPANY.phone.value;
  if (!phone) return null;
  return `tel:${phone.replace(/\s/g, "")}`;
}

/** The single-line address, skipping any part we do not have yet. */
export function addressLine(): string | null {
  const a = COMPANY.address;
  const parts = [a.street.value, a.suburb.value, a.city.value, a.province.value, a.postalCode.value];
  const present = parts.filter((p): p is string => Boolean(p));
  return present.length >= 3 ? present.join(", ") : null;
}

/** Every outstanding fact, for the audit script and the build guard. */
export function outstandingFacts(): Array<{ path: string; source: string; blocking: boolean }> {
  const out: Array<{ path: string; source: string; blocking: boolean }> = [];

  function walk(node: unknown, path: string) {
    if (!node || typeof node !== "object") return;

    if ("status" in node && "value" in node) {
      const fact = node as Fact<unknown>;
      if (fact.status === "pending") {
        out.push({ path, source: fact.source ?? "", blocking: fact.blocking !== false });
      }
      return;
    }

    for (const [key, child] of Object.entries(node)) {
      walk(child, path ? `${path}.${key}` : key);
    }
  }

  walk(COMPANY, "company");
  return out;
}

/* ------------------------------------------------------------------------ */

export const NAV = [
  { href: "/products", label: "Products" },
  { href: "/quality", label: "Quality" },
  { href: "/delivery", label: "Delivery" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;

/**
 * Delivery zones. Structure is right, values are assumed: they depend entirely
 * on where the plant actually is, which we do not know yet. Publishing zones,
 * minimum loads and lead times is the differentiator, so the table stays and
 * the client fills in the rows.
 */
export const DELIVERY_ZONES = assumed(
  [
    { zone: "Zone 1", radius: "Within 25 km of the plant", minimum: "1 load", lead: "2 to 3 working days" },
    { zone: "Zone 2", radius: "25 to 60 km", minimum: "1 load", lead: "3 to 5 working days" },
    { zone: "Zone 3", radius: "60 to 120 km", minimum: "2 loads", lead: "5 to 7 working days" },
    { zone: "Outside these areas", radius: "Anywhere in South Africa", minimum: "By arrangement", lead: "On quotation" },
  ],
  "zones depend on the plant location, which is still outstanding",
);

/** The five steps a batch goes through. Details are outstanding. */
export const PROCESS = [
  {
    step: "Raw materials",
    body: "Graded aggregate and cement, batched to a mix design rather than by eye. The aggregate source and cement supplier are named on request.",
  },
  {
    step: "Batching and mixing",
    body: "Materials are weighed to the mix design and mixed to a consistent moisture content. Consistency here is what makes dimensions consistent later.",
  },
  {
    step: "Pressing",
    body: "Units are vibrated and pressed in steel moulds. Pressure and vibration time are held constant, which is what holds the dimensional tolerance SANS 1215 asks for.",
  },
  {
    step: "Curing",
    body: "Units cure until they reach their nominal strength. Nothing green leaves the yard, because a unit that has not cured will crumble under a trowel and fail a crush test.",
  },
  {
    step: "Palletising and dispatch",
    body: "Cured units are stacked, counted, wrapped and staged for collection or delivery, with a delivery note that states the batch.",
  },
] as const;

/** Who the profile says they supply. Used on the home page and /bulk-supply. */
export const AUDIENCES = [
  { label: "Building contractors", note: "Site deliveries on your programme." },
  { label: "Property developers", note: "Scheduled supply against call-off." },
  { label: "Hardware stores", note: "Trade pricing and agreed restocking." },
  { label: "Municipalities and government", note: "Documented, compliant supply." },
  { label: "Owner-builders", note: "One load or one pallet, same product." },
] as const;
