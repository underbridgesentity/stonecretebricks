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
    body: "Every dimension, strength class and coverage figure sits on the product page, with the standard it is manufactured to and a mark against anything not yet confirmed by test.",
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

        {/* A div child of dl may contain only dt then dd. The hairline and the
            reveal wrapper broke that chain, so the term-definition mapping was
            never exposed. The rule now lives outside the list. */}
        <dl className="mt-20 grid grid-cols-1 md:grid-cols-12">
          {CLAIMS.map((claim) => (
            <div
              key={claim.title}
              className="animate-course-set col-span-full grid grid-cols-1 gap-x-10 gap-y-4 border-t border-line py-10 md:grid-cols-12"
            >
              <dt className="text-h1 uppercase text-ink md:col-span-4">{claim.title}</dt>
              <dd className="max-w-[45ch] text-lead text-ink-secondary md:col-span-7">
                {claim.body}
              </dd>
            </div>
          ))}
        </dl>
      </Wall>
    </Section>
  );
}
