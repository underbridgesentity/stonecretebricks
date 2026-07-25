/**
 * The brand board's modular bar system, built as DOM rather than a background
 * image so it inherits colour tokens and can be driven by scroll.
 *
 * "A modular system. Built to scale." Bars are laid in running bond: each
 * course is offset from the one above and the widths never repeat vertically,
 * so no vertical seam ever forms.
 *
 * Widths come from a fixed sequence indexed by course and position, never
 * Math.random, so the server and the client render identical markup.
 */

const WIDTHS = [3, 5, 2, 4, 6, 3, 5, 2, 6, 4, 3, 5, 4, 2, 6, 3] as const;

const tones = {
  oxide: "bg-oxide",
  graphite: "bg-graphite",
  limestone: "bg-limestone",
  current: "bg-current",
} as const;

type Tone = keyof typeof tones;

/** Bars per course before wrapping. Tight reads as masonry, open as signage. */
const densities = {
  tight: { bars: 7, gap: "gap-[0.5%]", height: "h-[13%]" },
  open: { bars: 5, gap: "gap-[1.2%]", height: "h-[11%]" },
} as const;

type Density = keyof typeof densities;

function widthAt(course: number, index: number): number {
  // Prime stride so a width never sits above itself in the next course.
  const slot = (course * 7 + index * 3) % WIDTHS.length;
  return WIDTHS[slot] ?? 4;
}

export function BondPattern({
  courses = 5,
  density = "tight",
  tone = "oxide",
  drift = false,
  className = "",
}: {
  courses?: number;
  density?: Density;
  tone?: Tone;
  drift?: boolean;
  className?: string;
}) {
  const { bars, gap, height } = densities[density];

  return (
    <div
      aria-hidden
      className={`pointer-events-none flex w-full flex-col justify-between overflow-hidden ${
        drift ? "animate-bond-front" : ""
      } ${className}`}
    >
      {Array.from({ length: courses }, (_, course) => {
        // Alternate courses start half a bar in. That offset is the bond.
        const offset = course % 2 === 1;
        const widths = Array.from({ length: bars }, (_, i) => widthAt(course, i));
        const total = widths.reduce((sum, w) => sum + w, 0);

        return (
          <div key={course} className={`flex w-full ${gap} ${height}`}>
            {offset ? <span className="shrink-0 basis-[6%]" /> : null}
            {widths.map((w, i) => (
              <span
                key={i}
                className={`${tones[tone]} shrink`}
                style={{ flexBasis: `${(w / total) * (offset ? 92 : 98)}%` }}
              />
            ))}
          </div>
        );
      })}
    </div>
  );
}
