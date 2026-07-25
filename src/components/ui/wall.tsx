import type { ReactNode } from "react";

/**
 * Layout primitives.
 *
 * The first cut drove the whole page off a running-bond grid, offsetting every
 * other course by three columns. In practice it did not read as a system, it
 * read as inconsistent margins, and it left voids that made pages feel padded
 * rather than composed. So the grid is now a calm editorial one: a single
 * measure, generous margins, twelve columns, and asymmetry only where the
 * content asks for it.
 *
 * The brand geometry now lives where it is felt rather than diagrammed: the
 * isometric hover extrusion and the course rule that lays in on scroll.
 */

export function Wall({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`mx-auto w-full max-w-[var(--wall)] px-6 md:px-10 ${className}`}>{children}</div>
  );
}

const grounds = {
  light: "",
  dark: "bg-ground text-ink",
} as const;

/**
 * Vertical rhythm. Every section uses this, so the page has one cadence
 * instead of a dozen ad hoc padding values. Space is most of the premium.
 */
export function Section({
  ground = "light",
  divider = false,
  id,
  children,
  className = "",
}: {
  ground?: keyof typeof grounds;
  divider?: boolean;
  id?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      id={id}
      data-ground={ground === "dark" ? "graphite" : undefined}
      className={`py-[var(--section)] ${grounds[ground]} ${
        divider ? "border-t border-line" : ""
      } ${className}`}
    >
      {children}
    </section>
  );
}

/** Twelve columns, no forced offset. Gutters are wide enough to read as space. */
export function Course({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`grid grid-cols-1 gap-x-10 gap-y-10 md:grid-cols-12 ${className}`}>
      {children}
    </div>
  );
}

const spans = {
  quarter: "md:col-span-3",
  third: "md:col-span-4",
  half: "md:col-span-6",
  /** The editorial measure. Roughly 70 characters at this scale. */
  measure: "md:col-span-7",
  /** Pairs with measure to fill the row. */
  complement: "md:col-span-5",
  twothirds: "md:col-span-8",
  most: "md:col-span-9",
  full: "md:col-span-12",
  /** The complement of measure, for a trailing aside. */
  aside: "md:col-span-4 md:col-start-9",
} as const;

type Span = keyof typeof spans;

export function Stretcher({
  span = "half",
  children,
  className = "",
}: {
  span?: Span;
  children: ReactNode;
  className?: string;
}) {
  return <div className={`min-w-0 ${spans[span]} ${className}`}>{children}</div>;
}

/**
 * The house section opening: a small label in a narrow left column, the
 * content in the measure beside it. One pattern, used everywhere, which is
 * what makes a set of pages feel like one publication.
 */
export function Split({
  label,
  children,
  className = "",
}: {
  label: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`grid grid-cols-1 gap-x-10 gap-y-6 md:grid-cols-12 ${className}`}>
      <div className="md:col-span-3">
        <p className="text-datum uppercase text-ink-secondary">{label}</p>
      </div>
      <div className="md:col-span-8">{children}</div>
    </div>
  );
}
