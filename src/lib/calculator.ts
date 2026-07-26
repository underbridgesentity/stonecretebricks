import {
  coordinating,
  unitsPerSquareMetre,
  wallThickness,
  type Product,
} from "@/data/products";

/**
 * Quantity maths. Pure functions, shared by the calculator island and the
 * quote form so the two can never disagree.
 *
 * Everything derives from the coordinating size, not from trade rules of
 * thumb. The rules of thumb are what the content farms publish and they
 * contradict each other: you will see 50, 52 and 55 stock bricks per square
 * metre quoted on three different South African supplier sites. Deriving it
 * means the number moves correctly the moment the client confirms a dimension.
 */

export type Opening = { width: number; height: number };

export type WallInput = {
  /** Metres. */
  length: number;
  /** Metres. */
  height: number;
  skin: "single" | "double";
  openings: readonly Opening[];
};

export type PavingInput = {
  /** Metres. */
  length: number;
  /** Metres. */
  width: number;
};

export type Quantity = {
  /** Square metres of face, after deducting openings. */
  netArea: number;
  unitsPerSquareMetre: number;
  /** Before wastage. Shown separately so the buyer can see nothing is padded. */
  baseUnits: number;
  wastageFraction: number;
  unitsWithWastage: number;
  pallets: number;
  /** Pallets times units per pallet, floored at the minimum order. */
  orderUnits: number;
  /** True when the wall needs less than the published minimum order. */
  belowMinimum: boolean;
  /** The minimum order in units, for the explanatory line. */
  minimumUnits: number;
  loads: number;
  /** Cubic metres, masonry only. Null for paving. */
  mortarCubicMetres: number | null;
};

const MORTAR_WASTE = 0.15;

export function calculateWall(product: Product, input: WallInput): Quantity {
  const gross = Math.max(0, input.length) * Math.max(0, input.height);
  const deductions = input.openings.reduce(
    (sum, o) => sum + Math.max(0, o.width) * Math.max(0, o.height),
    0,
  );
  const netArea = Math.max(0, gross - deductions);

  const perM2 = unitsPerSquareMetre(product) * (input.skin === "double" ? 2 : 1);

  return finish(product, netArea, perM2, mortarFor(product, netArea, input.skin));
}

export function calculatePaving(product: Product, input: PavingInput): Quantity {
  const netArea = Math.max(0, input.length) * Math.max(0, input.width);
  return finish(product, netArea, unitsPerSquareMetre(product), null);
}

function finish(
  product: Product,
  netArea: number,
  perM2: number,
  mortar: number | null,
): Quantity {
  const baseUnits = netArea * perM2;
  const unitsWithWastage = baseUnits * (1 + product.wastage);
  const perPallet = product.unitsPerPallet.value;
  const palletsNeeded = perPallet > 0 ? Math.ceil(unitsWithWastage / perPallet) : 0;

  /*
   * Floor the order at the published minimum.
   *
   * A pallet is smaller than the MOQ for three of the four products (stock
   * 500 per pallet against a 1 000 minimum, maxi 250 against 500, hollow 90
   * against 200). Rounding to whole pallets alone therefore returned an order
   * below the minimum printed on the comparison table two clicks away. On a
   * site whose entire argument is "we publish real minimum orders", the
   * calculator contradicting the spec table is the worst possible bug.
   */
  const minimumUnits = minimumInUnits(product);
  const orderUnits = Math.max(palletsNeeded * perPallet, minimumUnits);
  const pallets = perPallet > 0 ? Math.ceil(orderUnits / perPallet) : 0;

  return {
    netArea,
    unitsPerSquareMetre: perM2,
    baseUnits: Math.ceil(baseUnits),
    wastageFraction: product.wastage,
    unitsWithWastage: Math.ceil(unitsWithWastage),
    pallets,
    orderUnits,
    belowMinimum: netArea > 0 && palletsNeeded * perPallet < minimumUnits,
    minimumUnits,
    loads: Math.ceil(pallets / Math.max(1, product.palletsPerLoad.value)),
    mortarCubicMetres: mortar,
  };
}

/** The MOQ expressed in units, whatever unit the product states it in. */
export function minimumInUnits(product: Product): number {
  const { qty, unit } = product.moq.value;
  return unit === "pallet" || unit === "pallets" ? qty * product.unitsPerPallet.value : qty;
}

/**
 * Mortar is the wall volume that is not unit volume.
 *
 * For a stock brick single skin that resolves to about 0.017 cubic metres per
 * square metre, 0.019 with waste, which is what the trade actually uses. It is
 * derived rather than looked up, so it stays right if a dimension changes.
 */
function mortarFor(product: Product, netArea: number, skin: "single" | "double"): number | null {
  if (product.calculatorMode !== "wall") return null;

  const { l, w, h } = product.dimensions.value;
  const unitVolume = (l / 1000) * (w / 1000) * (h / 1000);
  const perM2Single = unitsPerSquareMetre(product);
  const thickness = wallThickness(product) / 1000;

  const solidPerM2 = perM2Single * unitVolume;
  const mortarPerM2 = Math.max(0, thickness - solidPerM2);
  const skinFactor = skin === "double" ? 2 : 1;

  return netArea * mortarPerM2 * skinFactor * (1 + MORTAR_WASTE);
}

/** The working, shown on screen. A sceptical contractor reads this first. */
export function showWorking(product: Product): string {
  const c = coordinating(product);
  const perM2 = unitsPerSquareMetre(product);
  const { l, w, h } = product.dimensions.value;

  if (product.calculatorMode === "paving") {
    return `A ${l} x ${w} mm face laid butted gives 1 / (${(c.a / 1000).toFixed(3)} x ${(
      c.b / 1000
    ).toFixed(3)}) = ${perM2.toFixed(1)} pavers per square metre.`;
  }

  return `A ${l} x ${h} mm face plus a ${product.joint.value} mm joint gives a coordinating size of ${
    c.a
  } x ${c.b} mm, so 1 / (${(c.a / 1000).toFixed(3)} x ${(c.b / 1000).toFixed(
    3,
  )}) = ${perM2.toFixed(1)} units per square metre of single skin.`;
}
