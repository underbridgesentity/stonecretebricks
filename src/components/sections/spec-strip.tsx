import { BondPattern } from "@/components/brand/bond-pattern";
import { Course, Stretcher, Wall } from "@/components/ui/wall";

/**
 * The positioning, stated plainly.
 *
 * Every competitor in this market hides dimensions, minimum order quantities,
 * delivery areas and lead times behind a phone call. Publishing them is a
 * defensible position on day one with zero track record, and it doubles as a
 * qualification filter that saves the sales team time.
 *
 * Inverted to graphite rather than flooded with oxide: no text colour clears
 * AA on a pure oxide field. Oxide does the shouting as a full-strength bond
 * band instead, which is its job in the system anyway.
 */

const CLAIMS = [
  {
    title: "Real specifications",
    body: "Every dimension, strength class and coverage figure is on the product page, with the standard it was measured against.",
  },
  {
    title: "Real quantities",
    body: "Work out exactly how many units your wall needs, including wastage, pallets and loads, before you speak to anyone.",
  },
  {
    title: "Real terms",
    body: "Minimum orders, delivery areas and lead times are published. You will know whether we can help you before you call.",
  },
];

export function SpecStrip() {
  return (
    <section data-ground="graphite" className="relative overflow-hidden bg-ground py-16 md:py-24">
      <BondPattern
        courses={4}
        density="open"
        tone="oxide"
        drift
        className="absolute inset-x-0 top-0 h-28 opacity-90"
      />

      <Wall className="relative pt-16">
        <Course bond="odd">
          <Stretcher span="wide">
            <h2 className="text-display uppercase text-ink">
              We publish what other suppliers make you phone for.
            </h2>
          </Stretcher>
        </Course>

        <Course bond="odd" className="mt-14 gap-y-10">
          {CLAIMS.map((claim, i) => (
            <Stretcher key={claim.title} span="closer" className="animate-course-set">
              <p className="text-datum uppercase text-ink-accent">
                {String(i + 1).padStart(2, "0")}
              </p>
              <span
                aria-hidden
                className="mt-4 block h-px w-full origin-left bg-oxide animate-course-lay"
              />
              <h3 className="mt-6 text-h2 uppercase text-ink">{claim.title}</h3>
              <p className="mt-3 text-body text-ink-secondary">{claim.body}</p>
            </Stretcher>
          ))}
        </Course>
      </Wall>
    </section>
  );
}
