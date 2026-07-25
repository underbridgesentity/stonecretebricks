import { Monogram } from "./monogram";

/**
 * The wordmark is live text, not outlines. The vector master embeds Montserrat
 * as real type, so setting it here keeps it selectable, searchable and
 * accessible, and costs nothing extra.
 *
 * Calibration, measured off the horizontal master: the BRICKS run advances
 * 0.348x the STONECRETE run, at a cap-height ratio near 0.58. The two tracking
 * values below hold that. Verify by overlaying brand/Stonecrete-03.png at 40%
 * opacity, then leave them alone.
 *
 * Sized in em throughout, so the caller sets font-size once and the lockup
 * scales as a unit.
 */

export function Wordmark({
  descriptor = true,
  className = "",
}: {
  descriptor?: boolean;
  className?: string;
}) {
  return (
    <span className={`inline-flex flex-col leading-none ${className}`}>
      <span className="text-[1em] font-extrabold uppercase tracking-[0.012em]">Stonecrete</span>
      {descriptor ? (
        <span className="text-[0.58em] font-normal uppercase tracking-[0.19em]">Bricks</span>
      ) : null}
    </span>
  );
}

/**
 * Mark plus wordmark. Horizontal for the header and footer, stacked for
 * standalone use. The monogram is optically sized against the cap height.
 */
export function Lockup({
  orientation = "horizontal",
  descriptor = true,
  variant = "colour",
  set = false,
  className = "",
}: {
  orientation?: "horizontal" | "stacked";
  descriptor?: boolean;
  variant?: "colour" | "on-dark";
  set?: boolean;
  className?: string;
}) {
  const stacked = orientation === "stacked";

  return (
    <span
      className={`inline-flex ${
        stacked ? "flex-col items-center gap-[0.5em]" : "flex-row items-center gap-[0.42em]"
      } ${className}`}
    >
      <Monogram
        variant={variant}
        set={set}
        className={stacked ? "h-[2.1em] w-auto" : "h-[1.55em] w-auto"}
      />
      <Wordmark descriptor={descriptor} className={stacked ? "items-center" : ""} />
    </span>
  );
}
