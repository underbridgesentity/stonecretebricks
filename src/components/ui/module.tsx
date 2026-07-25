import Link from "next/link";
import type { ReactNode } from "react";

/**
 * A block in the wall. Square, opaque, hairline-bordered.
 *
 * At rest a module is flat. On hover or focus it gains a hard graphite side
 * face at the mark's own projection angle, with no blur, while translating
 * half a step up-left so the volume grows about its centre instead of sliding.
 *
 * That is the tell that this site was designed from the mark. A generic card
 * blurs its shadow or nudges translateY(-2px).
 */

const faces = {
  ground: "bg-ground border-line",
  ground2: "bg-ground-2 border-line",
  graphite: "bg-graphite border-graphite text-limestone",
  oxide: "bg-oxide-deep border-oxide-deep text-limestone",
} as const;

type Face = keyof typeof faces;

export function Module({
  face = "ground",
  extrude = false,
  reveal = false,
  href,
  children,
  className = "",
}: {
  face?: Face;
  extrude?: boolean;
  reveal?: boolean;
  href?: string;
  children: ReactNode;
  className?: string;
}) {
  const classes = `border ${faces[face]} ${extrude ? "extrude" : ""} ${
    reveal ? "animate-course-set" : ""
  } ${className}`;

  if (href) {
    return (
      <Link href={href} className={`block ${classes}`}>
        {children}
      </Link>
    );
  }

  return <div className={classes}>{children}</div>;
}
