import { Section, Split, Wall } from "@/components/ui/wall";

/**
 * The positioning, in three lines.
 *
 * The first cut ran numbered cards with a bond-pattern band behind them, which
 * was decoration standing in for substance. This is the same argument with the
 * decoration removed: a statement, three plain claims, nothing else on screen.
 */

const CLAIMS = [
  {
    title: "Specifications, published",
    body: "Every dimension, strength class and coverage figure sits on the product page, with the standard it was measured against.",
  },
  {
    title: "Quantities, before you call",
    body: "Work out what your wall needs, including wastage, pallets and loads, without speaking to a salesperson first.",
  },
  {
    title: "Terms, in the open",
    body: "Minimum orders, delivery areas and lead times are stated. You will know whether we can help before you pick up the phone.",
  },
];

export function SpecStrip() {
  return (
    <Section ground="dark">
      <Wall>
        <Split label="Why us">
          <h2 className="max-w-[22ch] text-display uppercase text-ink">
            We publish what other suppliers make you phone for.
          </h2>
        </Split>

        <div className="mt-16 grid grid-cols-1 gap-x-10 gap-y-12 md:grid-cols-3">
          {CLAIMS.map((claim) => (
            <div key={claim.title} className="animate-course-set">
              <span
                aria-hidden
                className="block h-px w-full origin-left bg-oxide animate-course-lay"
              />
              <h3 className="mt-7 text-h2 uppercase text-ink">{claim.title}</h3>
              <p className="mt-4 text-body text-ink-secondary">{claim.body}</p>
            </div>
          ))}
        </div>
      </Wall>
    </Section>
  );
}
