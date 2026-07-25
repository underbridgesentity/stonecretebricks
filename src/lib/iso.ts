/**
 * The isometric projection the whole brand runs on.
 *
 * This is an isometric *drawing*, the draughting convention: two horizontal
 * axes at ISO_ANGLE, the vertical drawn unforeshortened, all three at equal
 * scale. It is not a true isometric projection (which would foreshorten
 * everything by 0.8165).
 *
 * ISO_ANGLE is 32.36, not the textbook 30. That is measured, not chosen: the
 * mark's bounding box in brand/Stonecrete-02.png is 1957 x 2167, a ratio of
 * 0.9031, and solving 5cos(t) / (5sin(t) + 2) for that ratio gives 32.36
 * degrees. A true 30 would render the mark 6% wider than the client's own
 * artwork, which would show the moment the site sits next to their signage.
 *
 * Mirrored by --iso-tan, --iso-x and --iso-y in globals.css. Change together.
 */

export const ISO_ANGLE = 32.36;

const RAD = (ISO_ANGLE * Math.PI) / 180;

/** 0.8446. The horizontal component of one unit along either ground axis. */
export const ISO_COS = Math.cos(RAD);
/** 0.5354. The vertical component of one unit along either ground axis. */
export const ISO_SIN = Math.sin(RAD);
/** 0.6340. Mirrored by --iso-tan. */
export const ISO_TAN = Math.tan(RAD);

/** One world unit in user-space units. */
export const UNIT = 100;

/*
 * The monogram spans a in [0,3], d in [0,2], c in [0,2]. Across those corners
 * y_raw runs from -(2 sin + 2) to 3 sin, so shifting by (2 sin + 2) puts the
 * topmost vertex on y = 0 and gives a viewBox that hugs the mark exactly.
 */
const Y_SHIFT = 2 * ISO_SIN + 2;

export const VIEW_W = 5 * ISO_COS * UNIT; // 422.3
export const VIEW_H = (5 * ISO_SIN + 2) * UNIT; // 467.7

export type Point = readonly [number, number];

/**
 * World to screen.
 *
 * @param a brick length axis, screen direction (+cos, +sin), down-right
 * @param d brick depth axis,  screen direction (+cos, -sin), up-right
 * @param c height axis,       screen direction (0, -1),      up
 */
export function iso(a: number, d: number, c: number, u: number = UNIT): Point {
  return [(a + d) * ISO_COS * u, ((a - d) * ISO_SIN - c + Y_SHIFT) * u];
}

/** Format a list of world corners as an SVG points attribute. */
export function face(corners: ReadonlyArray<readonly [number, number, number]>): string {
  return corners
    .map(([a, d, c]) => {
      const [x, y] = iso(a, d, c);
      return `${round(x)},${round(y)}`;
    })
    .join(" ");
}

function round(n: number): number {
  return Math.round(n * 1000) / 1000;
}

/**
 * One brick, 3 long by 1 deep by 1 high, positioned by its minimum corner.
 * Returns the three faces visible from this viewpoint.
 *
 * `end` is the face at the far end of the length axis. The upper course of
 * the monogram deliberately omits it: that opening is the counter of the S.
 */
export function brick(a0: number, d0: number, c0: number) {
  const a1 = a0 + 3;
  const d1 = d0 + 1;
  const c1 = c0 + 1;

  return {
    /** The lit face. Plane c = c1. */
    top: face([
      [a0, d0, c1],
      [a1, d0, c1],
      [a1, d1, c1],
      [a0, d1, c1],
    ]),
    /** The extruded face, front-left long side. Plane d = d0. */
    side: face([
      [a0, d0, c1],
      [a1, d0, c1],
      [a1, d0, c0],
      [a0, d0, c0],
    ]),
    /** The return at the far end. Plane a = a1. */
    end: face([
      [a1, d0, c1],
      [a1, d1, c1],
      [a1, d1, c0],
      [a1, d0, c0],
    ]),
  };
}
