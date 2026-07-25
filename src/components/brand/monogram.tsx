import type { SVGProps } from "react";

import { brick, VIEW_H, VIEW_W } from "@/lib/iso";

/**
 * The Stonecrete monogram: two 3 x 1 x 1 brick volumes in isometric drawing,
 * the upper course set one unit back and one unit up from the lower. The step
 * produced by the projection is what reads as an S.
 *
 * IMPORTANT, and it will look like a bug: the upper course's end face is
 * deliberately not drawn. That opening is the counter of the S. Draw it and
 * the mark collapses into a plain staircase. See docs/brand.md.
 *
 * Geometry is computed from src/lib/iso.ts, never transcribed, so the mark and
 * every 30 degree move on the site come from one constant.
 */

const LOWER = brick(0, 0, 0);
const UPPER = brick(0, 1, 1);

type Faces = "colour" | "mono" | "inverse";

/** Top and end faces catch the light. Long sides are the extrusion. */
const faces: Record<Faces, { lit: string; dark: string; litOpacity?: number; darkOpacity?: number }> = {
  colour: { lit: "var(--oxide)", dark: "var(--graphite)" },
  mono: { lit: "currentColor", dark: "currentColor", darkOpacity: 0.62 },
  inverse: { lit: "var(--limestone)", dark: "var(--cement)" },
};

export function Monogram({
  variant = "colour",
  set = false,
  title,
  ...props
}: SVGProps<SVGSVGElement> & { variant?: Faces; set?: boolean; title?: string }) {
  const skin = faces[variant];
  const lower = set ? "animate-brick-set" : "";
  const upper = set ? "animate-brick-set" : "";

  return (
    <svg
      viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role={title ? "img" : "presentation"}
      aria-hidden={title ? undefined : true}
      {...props}
    >
      {title ? <title>{title}</title> : null}

      {/* Lower course. Sets first, so the mark builds bottom-up. */}
      <g className={lower}>
        <polygon points={LOWER.side} fill={skin.dark} fillOpacity={skin.darkOpacity} />
        <polygon points={LOWER.end} fill={skin.lit} fillOpacity={skin.litOpacity} />
        <polygon points={LOWER.top} fill={skin.lit} fillOpacity={skin.litOpacity} />
      </g>

      {/* Upper course. No end face: that gap is the counter of the S. */}
      <g className={upper} style={set ? { animationDelay: "120ms" } : undefined}>
        <polygon points={UPPER.side} fill={skin.dark} fillOpacity={skin.darkOpacity} />
        <polygon points={UPPER.top} fill={skin.lit} fillOpacity={skin.litOpacity} />
      </g>
    </svg>
  );
}
