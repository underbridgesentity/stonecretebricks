import { Course, Section, Stretcher, Wall } from "@/components/ui/wall";

/**
 * The positioning.
 *
 * Every competitor in this market hides dimensions, minimum order quantities,
 * delivery areas and lead times behind a phone call. Publishing them is a
 * defensible position on day one with zero track record, and it doubles as a
 * qualification filter that saves the sales team time.
 *
 * Set as an editorial list rather than three equal columns. A three-up feature
 * row is the most templated shape on the web and the design system bans it by
 * name; the same three claims read as considered when they are given room and
 * a hairline each.
 */

const CLAIMS = [
  {
    title: "Specifications",
    body: "Every dimension, strength class and coverage figure sits on the product page, with the standard it was measured against.",
  },
  {
    title: "Quantities",
    body: "Work out what your wall needs, including wastage, pallets and loads, without speaking to a salesperson first.",
  },
  {
    title: "Terms",
    body: "Minimum orders, delivery areas and lead times are stated. You will know whether we can help before you pick up the phone.",
  },
];

export function SpecStrip() {
  return (
    <Section ground="dark">
      <Wall>
        <Course>
          <Stretcher span="measure">
            <p className="text-datum uppercase text-ink-secondary">Why us</p>
            <h2 className="mt-6 max-w-[20ch] text-display uppercase text-ink">
              We publish what other suppliers make you phone for.
            </h2>
          </Stretcher>
        </Course>

        <dl className="mt-20 flex flex-col">
          {CLAIMS.map((claim) => (
            <div key={claim.title} className="animate-course-set">
              <span
                aria-hidden
                className="block h-px w-full origin-left bg-line animate-course-lay"
              />
              <div className="grid grid-cols-1 gap-x-10 gap-y-4 py-10 md:grid-cols-12">
                <dt className="text-h1 uppercase text-ink md:col-span-4">{claim.title}</dt>
                <dd className="max-w-xl text-lead text-ink-secondary md:col-span-7">
                  {claim.body}
                </dd>
              </div>
            </div>
          ))}
        </dl>
      </Wall>
    </Section>
  );
}
