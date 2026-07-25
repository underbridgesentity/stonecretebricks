# The mark

## What it is

Two brick volumes, each 3 long by 1 deep by 1 high, in isometric drawing. The upper course sits one unit back and one unit up from the lower. The two courses are flush along the length axis: the step that reads as an S is produced by the projection, not by a length offset.

Five polygons. Geometry is computed in `src/lib/iso.ts` and never transcribed, so the mark, the hover extrusion, the module entrance vector and the bond parallax all come from one constant.

## The face that is missing on purpose

The upper course's end face, at `a = 3, d in [1,2], c in [1,2]`, is **not drawn**. That opening is the counter of the S.

Draw it and the mark collapses into a plain staircase. It is a knowingly incomplete solid. This will look like a bug to the next person who reads `monogram.tsx`, which is why it is commented there and recorded here.

## The angle is 32.36 degrees, not 30

Measured, not chosen.

The mark's bounding box in `brand/Stonecrete-02.png` is 1957 x 2167 pixels, a width-to-height ratio of **0.9031**. For a two-brick arrangement of this shape at angle t, that ratio is:

```
W / H = 5 cos(t) / (5 sin(t) + 2)
```

Solving for 0.9031 gives **32.36 degrees**. A true 30 would give 0.9623, rendering the mark about 6% wider than the client's own artwork. That difference shows the moment the site sits beside their signage or a business card.

The vector master was drawn by hand rather than on a lattice, so its individual axis angles vary (roughly 31 to 33 degrees, with extrusion heights differing by about 1.5%). We snap to a single exact 32.36 across the whole system, which reproduces the artwork's silhouette while making every derived move consistent.

`ISO_ANGLE` in `src/lib/iso.ts` and `--iso-tan` / `--iso-y` in `globals.css` must change together.

## Colours

The brand board is authoritative: Fired Oxide `#D35A2A`, Graphite `#1A1A1A`.

Do not sample the `.ai` master. It is a PDF carrying CMYK conversions, which resolve to `#C94F23` and `#212121`. Both are wrong.

Top faces and end returns are Fired Oxide. Long side faces are Graphite. That relationship holds across all three variants.

## Variants

| Variant | Lit faces | Side faces | Use |
|---|---|---|---|
| `colour` | Oxide | Graphite | Default |
| `mono` | `currentColor` | `currentColor` at 0.62 | Single-colour contexts, stamps, print |
| `inverse` | Limestone | Cement | Over photography and dark grounds |

## The wordmark is live text

The master embeds Montserrat as real type, not outlines, so `wordmark.tsx` sets it as HTML. Selectable, searchable, accessible, and it costs nothing extra.

Calibration measured off the horizontal master: the BRICKS run advances 0.348x the STONECRETE run, at a cap-height ratio near 0.58. The two tracking values in the component hold that. Verify by overlaying `brand/Stonecrete-03.png` at 40% opacity, then leave them alone.

## The favicon is a third cut

At 16px the two courses do not resolve. The icon is a single brick, one top face plus its side face, oxide over graphite on a limestone tile. Built by `pnpm brand:icons`.

## Naming

**Stonecrete Bricks**, always both words, everywhere: title tags, structured data, Google Business Profile, every citation.

Never bare "Stonecrete". That is a different company, [stonecrete.co.za](https://stonecrete.co.za), a cement and stone products manufacturer in Meredale, Johannesburg that also retails bricks. Same category, same city. Keeping the full lockup everywhere is what separates the two entities in search over time.
