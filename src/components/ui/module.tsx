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

/*
 * There was a `face` prop offering ground2, graphite and oxide alongside the
 * default. Three of the four were never passed by any call site, which is the
 * usual outcome of building variants before there is a second case: the map
 * looks like a system and is really a guess. A module that needs a dark ground
 * can say so in className, and if a second real case appears the prop comes
 * back with two known users instead of one imagined one.
 */
export function Module({
  extrude = false,
  reveal = false,
  href,
  children,
  className = "",
}: {
  extrude?: boolean;
  reveal?: boolean;
  href?: string;
  children: ReactNode;
  className?: string;
}) {
  const classes = `border border-line bg-ground ${extrude ? "extrude" : ""} ${
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
