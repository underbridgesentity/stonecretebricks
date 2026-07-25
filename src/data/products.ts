import type { Confidence } from "./company";

/**
 * The four products, plus custom. One source for product pages, the
 * comparison table, the calculator, the quote form chips and Product schema.
 *
 * The client supplied no specifications. Every figure below is a South African
 * industry standard, flagged `assumed`, and must be confirmed against their
 * own units and test certificates before launch. Run `pnpm specs:audit`.
 *
 * Standards, and getting this right matters:
 *   SANS 1215 governs concrete masonry units on compressive strength.
 *   SANS 1058 governs paving blocks on tensile splitting and abrasion.
 * Publishing an MPa figure against a paver is the tell of a site written by
 * someone who has never sold one, so PaverSpec has no compressive field.
 */

export type Spec<T> = {
  value: T;
  unit?: string;
  status: Confidence;
  source?: string;
  note?: string;
};

function assumed<T>(value: T, source: string, unit?: string): Spec<T> {
  return { value, status: "assumed", source, unit };
}

export type Standard = "SANS 1215" | "SANS 1058";

export type Product = {
  slug: string;
  name: string;
  shortName: string;
  positioning: string;
  standard: Standard;
  /** Millimetres, length x width x height as laid. */
  dimensions: Spec<{ l: number; w: number; h: number }>;
  /** Mortar joint used for the coordinating size. Pavers butt, so zero. */
  joint: Spec<number>;
  /** Compressive, masonry units only. Pavers carry paverClass instead. */
  nominalStrength: Spec<number> | null;
  paverClass: Spec<string> | null;
  abrasion: Spec<string> | null;
  waterAbsorption: Spec<string> | null;
  massPerUnit: Spec<number>;
  unitsPerPallet: Spec<number>;
  palletsPerLoad: Spec<number>;
  moq: Spec<{ qty: number; unit: string }>;
  leadTimeDays: Spec<number>;
  /** Fraction. 5% masonry, 10% paving for cutting and curves. */
  wastage: number;
  /** Verbatim from the company profile. */
  suitableFor: readonly string[];
  /** Profile bullet plus the sentence that makes it mean something. */
  features: readonly { label: string; expanded: string }[];
  calculatorMode: "wall" | "paving";
  image: string;
  seo: { title: string; description: string };
};

export const PRODUCTS: readonly Product[] = [
  {
    slug: "stock-bricks",
    name: "Stock bricks",
    shortName: "Stock",
    positioning:
      "The general purpose concrete unit. Load bearing walls, boundary walls, infill and general construction.",
    standard: "SANS 1215",
    dimensions: assumed({ l: 222, w: 106, h: 73 }, "South African standard stock brick", "mm"),
    joint: assumed(10, "standard mortar joint", "mm"),
    nominalStrength: assumed(
      7,
      "National Building Regulations floor for solid units in single storey housing",
      "MPa",
    ),
    paverClass: null,
    abrasion: null,
    waterAbsorption: null,
    massPerUnit: assumed(3.5, "typical for a 222 x 106 x 73 concrete stock brick", "kg"),
    unitsPerPallet: assumed(500, "common South African pallet configuration"),
    palletsPerLoad: assumed(4, "derived from an 8 000 kg payload"),
    moq: assumed({ qty: 1000, unit: "units" }, "typical trade minimum"),
    leadTimeDays: assumed(3, "typical for stock held on the ground"),
    wastage: 0.05,
    suitableFor: [
      "Residential housing",
      "Boundary walls",
      "Commercial buildings",
      "General construction projects",
    ],
    features: [
      {
        label: "High compressive strength",
        expanded:
          "Manufactured to a nominal 7.0 MPa and tested to SANS 1215. Suitable for load bearing masonry in single and double storey work.",
      },
      {
        label: "Consistent dimensions",
        expanded:
          "Dimensional tolerance held inside the limits set by SANS 1215, so your courses run true and your mortar consumption stays predictable.",
      },
      {
        label: "Cost-effective",
        expanded:
          "The lowest cost per square metre in the range for general walling, which is why it remains the default unit on most sites.",
      },
      {
        label: "Durable and reliable",
        expanded:
          "Cured to full strength before dispatch. No green units leave the yard, so nothing arrives that crumbles under a bricklayer's trowel.",
      },
    ],
    calculatorMode: "wall",
    image: "/images/products/stock-bricks.jpg",
    seo: {
      title: "Stock bricks",
      description:
        "Concrete stock bricks manufactured to SANS 1215. Dimensions, strength, coverage and pallet quantities published. Delivered to site.",
    },
  },
  {
    slug: "maxi-bricks",
    name: "Maxi bricks",
    shortName: "Maxi",
    positioning: "Fewer units, less mortar, faster walls. The developer's unit.",
    standard: "SANS 1215",
    dimensions: assumed(
      { l: 290, w: 140, h: 90 },
      "South African standard maxi. Confirm which maxi the client makes: a 222 x 90 x 114 unit changes coverage by 5%",
      "mm",
    ),
    joint: assumed(10, "standard mortar joint", "mm"),
    nominalStrength: assumed(
      7,
      "National Building Regulations floor for solid units in single storey housing",
      "MPa",
    ),
    paverClass: null,
    abrasion: null,
    waterAbsorption: null,
    massPerUnit: assumed(6, "typical for a 290 x 140 x 90 concrete maxi", "kg"),
    unitsPerPallet: assumed(250, "common South African pallet configuration"),
    palletsPerLoad: assumed(5, "derived from an 8 000 kg payload"),
    moq: assumed({ qty: 500, unit: "units" }, "typical trade minimum"),
    leadTimeDays: assumed(3, "typical for stock held on the ground"),
    wastage: 0.05,
    suitableFor: [
      "Residential developments",
      "Housing projects",
      "Schools and public buildings",
      "Commercial developments",
    ],
    features: [
      {
        label: "Faster construction",
        expanded:
          "One maxi covers the wall area of roughly three stock bricks, so a team lays the same square metres in materially less time.",
      },
      {
        label: "Reduced mortar consumption",
        expanded:
          "Fewer joints per square metre means less mortar mixed, carried and struck. On a housing development that is a real line item.",
      },
      {
        label: "Excellent structural performance",
        expanded:
          "A 140 mm unit gives a single skin wall that carries load without a second leaf, which is why it dominates subsidised and affordable housing.",
      },
      {
        label: "Economical building solution",
        expanded:
          "Lower installed cost per square metre once labour and mortar are counted, even where the unit price is higher than a stock brick.",
      },
    ],
    calculatorMode: "wall",
    image: "/images/products/maxi-bricks.jpg",
    seo: {
      title: "Maxi bricks",
      description:
        "Concrete maxi bricks manufactured to SANS 1215. Coverage per square metre, pallet quantities and lead times published.",
    },
  },
  {
    slug: "hollow-blocks",
    name: "Hollow blocks",
    shortName: "Hollow",
    positioning:
      "Lighter walls, better thermal performance, lower cost per square metre.",
    standard: "SANS 1215",
    dimensions: assumed(
      { l: 390, w: 190, h: 190 },
      "M190 hollow block. Confirm which widths the client produces: M90, M140, M190 or a subset",
      "mm",
    ),
    joint: assumed(10, "standard mortar joint", "mm"),
    nominalStrength: assumed(
      3.5,
      "National Building Regulations nominal for hollow units in single storey housing",
      "MPa",
    ),
    paverClass: null,
    abrasion: null,
    waterAbsorption: null,
    massPerUnit: assumed(15, "typical for a 390 x 190 x 190 hollow block", "kg"),
    unitsPerPallet: assumed(90, "common South African pallet configuration"),
    palletsPerLoad: assumed(5, "derived from an 8 000 kg payload"),
    moq: assumed({ qty: 200, unit: "units" }, "typical trade minimum"),
    leadTimeDays: assumed(5, "typical, hollow is often made to order"),
    wastage: 0.05,
    suitableFor: [
      "Boundary walls",
      "Industrial structures",
      "Retaining structures",
      "Commercial projects",
    ],
    features: [
      {
        label: "Lightweight",
        expanded:
          "Hollow cores cut the mass per square metre, which speeds up laying and reduces the load carried into the foundation.",
      },
      {
        label: "Reduced construction costs",
        expanded:
          "The face is 390 x 190, so 13 units cover a square metre against 52 stock bricks. Fewer units, fewer joints, less labour.",
      },
      {
        label: "Improved thermal performance",
        expanded:
          "The voids break the conductive path through the wall, so the building holds temperature better than a solid single skin.",
      },
      {
        label: "Easy installation",
        expanded:
          "Cores can be reinforced and filled where the design calls for it, which makes the same unit work for boundary walls and retaining structures.",
      },
    ],
    calculatorMode: "wall",
    image: "/images/products/hollow-blocks.jpg",
    seo: {
      title: "Hollow blocks",
      description:
        "Concrete hollow blocks manufactured to SANS 1215. Coverage, mass, pallet quantities and applications published.",
    },
  },
  {
    slug: "paving-bricks",
    name: "Paving bricks",
    shortName: "Paving",
    positioning:
      "Driveways, walkways and parking that survive a delivery truck.",
    standard: "SANS 1058",
    dimensions: assumed(
      { l: 200, w: 100, h: 50 },
      "standard South African paver. Confirm thickness options: 50 mm for pedestrian, 60 or 80 mm for vehicles",
      "mm",
    ),
    joint: assumed(0, "pavers butt against each other, no mortar joint", "mm"),
    // Deliberately null. SANS 1058 grades pavers on tensile splitting strength
    // and abrasion, not compressive MPa. Do not add a compressive figure here.
    nominalStrength: null,
    paverClass: assumed(
      "Class 30/2.0",
      "SANS 1058:2012, 2.0 MPa average tensile splitting, 1.5 MPa individual minimum",
    ),
    abrasion: assumed("Compliant with SANS 1058", "confirm the measured value from a test certificate"),
    waterAbsorption: assumed("Compliant with SANS 1058", "confirm the measured value from a test certificate"),
    massPerUnit: assumed(2.2, "typical for a 200 x 100 x 50 paver", "kg"),
    unitsPerPallet: assumed(600, "600 per pallet covering 12 square metres is the common configuration"),
    palletsPerLoad: assumed(6, "derived from an 8 000 kg payload"),
    moq: assumed({ qty: 1, unit: "pallet" }, "typical trade minimum"),
    leadTimeDays: assumed(3, "typical for stock held on the ground"),
    wastage: 0.1,
    suitableFor: ["Driveways", "Walkways", "Parking areas", "Landscaping projects"],
    features: [
      {
        label: "Attractive finishes",
        expanded:
          "Laid in stretcher, herringbone or basketweave from the same unit, so the pattern does the design work without a premium product.",
      },
      {
        label: "Durable surface",
        expanded:
          "Graded on tensile splitting strength and abrasion resistance under SANS 1058, which is the property that actually matters underfoot and under a wheel.",
      },
      {
        label: "Weather resistant",
        expanded:
          "Water absorption is held inside the SANS 1058 limit, so the surface does not spall through a Highveld winter.",
      },
      {
        label: "Low maintenance",
        expanded:
          "Individual units lift and relay, so a service trench or a settled patch is a morning's work rather than a resurfacing job.",
      },
    ],
    calculatorMode: "paving",
    image: "/images/products/paving-bricks.jpg",
    seo: {
      title: "Paving bricks",
      description:
        "Concrete paving bricks manufactured to SANS 1058. Coverage per square metre, pallet quantities and thickness options published.",
    },
  },
];

export function productBySlug(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}

/* --------------------------------------------------------------------------
 * Derived coverage. Computed from the coordinating size, never hardcoded, so
 * the spec table and the calculator can never disagree.
 * ------------------------------------------------------------------------ */

/**
 * The coordinating size of the face that shows, plus its joint, in millimetres.
 *
 * These are different planes for the two modes and getting them confused is
 * the classic error: a wall shows length x height, with width as the wall
 * thickness, while paving shows length x width, with height as the thickness.
 * A 200 x 100 x 50 paver covers 50 per square metre, not 100.
 */
export function coordinating(product: Product): { a: number; b: number } {
  const { l, w, h } = product.dimensions.value;
  const j = product.joint.value;
  const second = product.calculatorMode === "paving" ? w : h;
  return { a: l + j, b: second + j };
}

/**
 * Units to cover one square metre of face, single skin.
 *
 * Computed in square millimetres rather than converting to metres first.
 * (400/1000) * (200/1000) evaluates to 0.08000000000000002, which turns an
 * exact 12.5 into 12.499999999999998 and rounds down to 12 on screen.
 */
export function unitsPerSquareMetre(product: Product): number {
  const c = coordinating(product);
  return 1_000_000 / (c.a * c.b);
}

/**
 * The practical ordering figure: you cannot buy 12.5 blocks, so a square
 * metre needs 13. Spec tables show the exact value, cards show this.
 */
export function unitsPerSquareMetreRounded(product: Product): number {
  return Math.ceil(unitsPerSquareMetre(product));
}

/** Square metres one pallet covers, single skin. */
export function squareMetresPerPallet(product: Product): number {
  return product.unitsPerPallet.value / unitsPerSquareMetre(product);
}

/** Wall thickness for a single skin, in millimetres. */
export function wallThickness(product: Product): number {
  return product.dimensions.value.w;
}

/** Formatted "222 x 106 x 73 mm". */
export function formatDimensions(product: Product): string {
  const { l, w, h } = product.dimensions.value;
  return `${l} x ${w} x ${h} mm`;
}

/** Every product figure still flagged assumed, for the audit script. */
export function outstandingSpecs(): Array<{ product: string; field: string; source: string }> {
  const out: Array<{ product: string; field: string; source: string }> = [];

  for (const product of PRODUCTS) {
    for (const [field, spec] of Object.entries(product)) {
      if (!spec || typeof spec !== "object" || !("status" in spec)) continue;
      const s = spec as Spec<unknown>;
      if (s.status !== "confirmed") {
        out.push({ product: product.name, field, source: s.source ?? "" });
      }
    }
  }

  return out;
}
