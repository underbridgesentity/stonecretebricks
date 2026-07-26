import { Wall } from "@/components/ui/wall";

/**
 * The proposition, given real area.
 *
 * Two problems this solves. First, oxide was never once a mass anywhere on the
 * site: it appeared only as hairlines, arrows and a button fill, so a visitor's
 * memory of the brand was a black header and a cream page. The design system
 * always called for a section that inverts and lets oxide carry weight. This is
 * that section, and it is the only one. Two would be a pattern.
 *
 * Second, this sentence is the only one on the site a competitor could not have
 * written, and it used to sit a type step down and three screens below a
 * platitude. It is now the largest statement on the home page.
 *
 * --oxide-deep, not --oxide: limestone on it measures 4.71:1, which carries
 * body copy. Pure oxide is 3.48:1 and cannot.
 *
 * NO OPACITY MODIFIERS ON TEXT HERE. 4.71 leaves 0.21 of headroom above AA, so
 * even text-limestone/95 drops to 4.41 and fails. The first draft of this
 * section used /80 and /85 for the eyebrow and body, which is the same mistake
 * the hero made over its photograph. Full limestone or nothing. The only
 * modifier below is on a 1px rule, where the 3:1 non-text floor applies and
 * /70 is the lowest that clears it.
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
    <section className="bg-oxide-deep py-[var(--section)] text-limestone">
      <Wall>
        <p className="text-datum uppercase text-limestone">Why us</p>
        <h2 className="mt-8 max-w-[16ch] text-mega uppercase text-limestone">
          We publish what other suppliers make you phone for.
        </h2>

        <dl className="mt-20 grid grid-cols-1 gap-x-10 gap-y-12 md:grid-cols-3">
          {CLAIMS.map((claim) => (
            <div key={claim.title} className="animate-course-set border-t border-limestone/70 pt-8">
              <dt className="text-h2 uppercase text-limestone">{claim.title}</dt>
              <dd className="mt-4 max-w-[42ch] text-body text-limestone">{claim.body}</dd>
            </div>
          ))}
        </dl>
      </Wall>
    </section>
  );
}
