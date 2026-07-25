import type { ReactNode } from "react";

/**
 * The running bond. See docs/design-system.md section 1.
 *
 * 12 columns of 112px inside a 1344px wall. A stretcher spans 6, a queen
 * closer spans 3. Odd courses run two stretchers with one seam at column 7.
 * Even courses run closer, stretcher, closer, with seams at 4 and 10.
 *
 * Stacked, the seams alternate down the page and nothing lines up vertically.
 * That is the whole look, and it comes from the grid rather than from decoration.
 *
 * Below md the bond collapses to a soldier course: one column, full width.
 * Running bond needs width, and forcing it at 375px would be theatre.
 */

export function Wall({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-[var(--wall)] px-6 md:px-8 ${className}`}>{children}</div>;
}

type Bond = "odd" | "even";

export function Course({
  bond = "odd",
  children,
  className = "",
}: {
  bond?: Bond;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`grid grid-cols-1 gap-[var(--joint)] md:grid-cols-12 ${className}`}>
      {/* The queen closer that starts an even course. Empty on purpose: it is
          what pushes the seam from column 7 to columns 4 and 10. */}
      {bond === "even" ? <span aria-hidden className="hidden md:col-span-3 md:block" /> : null}
      {children}
    </div>
  );
}

const spans = {
  closer: "md:col-span-3",
  stretcher: "md:col-span-6",
  wide: "md:col-span-9",
  full: "md:col-span-12",
  /** Seven columns. The hero headline runs to the wall edge on this one. */
  header: "md:col-span-7",
  /** Five columns, the complement of header. */
  footer: "md:col-span-5",
} as const;

type Span = keyof typeof spans;

export function Stretcher({
  span = "stretcher",
  children,
  className = "",
}: {
  span?: Span;
  children: ReactNode;
  className?: string;
}) {
  return <div className={`min-w-0 ${spans[span]} ${className}`}>{children}</div>;
}
