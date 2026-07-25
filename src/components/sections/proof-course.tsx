import { CourseRule } from "@/components/ui/course-rule";
import { Arrow } from "@/components/ui/glyph";
import { Module } from "@/components/ui/module";
import { Course, Stretcher, Wall } from "@/components/ui/wall";

/**
 * Credibility for a business with no track record.
 *
 * The honest position is that the plant, the aggregates, the QC regime and the
 * capacity are all real and inspectable today, while a portfolio is not. So we
 * say the company is new, in plain words, and trade past-tense claims for
 * present-tense verifiable facts.
 *
 * No invented client logos, no stock photos of other people's buildings, no
 * "20+ years combined experience", no fabricated tonnage counter. Those are
 * what make a site read as generated, and under the Consumer Protection Act
 * they are misleading representations.
 */

const PROOF = [
  {
    title: "Manufactured to SANS 1215",
    body: "The standard for concrete masonry units, covering materials, dimensions, compressive strength, water absorption and density. Our pavers are made to SANS 1058, which is a different standard for good reason.",
    href: "/quality",
    cta: "Standards and testing",
  },
  {
    title: "Independently tested",
    body: "Crush test results from an independent laboratory, published with the lab name and the date. A dated certificate outranks any testimonial for a quantity surveyor or a municipal buyer.",
    href: "/quality",
    cta: "See the test regime",
  },
  {
    title: "Come and inspect the plant",
    body: "Most suppliers will not show you the yard. We will. Book a visit and watch a batch being mixed, pressed, cured and stacked before you place an order.",
    href: "/plant",
    cta: "Book a plant visit",
  },
];

export function ProofCourse() {
  return (
    <section data-ground="graphite" className="bg-ground py-16 md:py-24">
      <Wall>
        <CourseRule datum="04" label="Why trust a new supplier" tone="oxide" />

        <Course bond="odd" className="mt-10 items-end gap-y-8">
          <Stretcher span="header">
            <h2 className="text-display uppercase text-ink">New company. Proven standards.</h2>
          </Stretcher>
          <Stretcher span="footer">
            <p className="text-body text-ink-secondary">
              We do not have a twenty year history to sell you, so we will give you something more
              useful: the standard we manufacture to, the results that prove it, and an open
              invitation to come and watch us make them.
            </p>
          </Stretcher>
        </Course>

        <Course bond="even" className="mt-12 gap-y-[var(--joint)]">
          {PROOF.map((item) => (
            <Stretcher key={item.title} span="closer">
              <Module href={item.href} extrude reveal className="group flex h-full flex-col gap-4 p-6 md:p-8">
                <h3 className="text-h3 uppercase text-ink">{item.title}</h3>
                <p className="text-small text-ink-secondary">{item.body}</p>
                <span className="mt-auto inline-flex items-center gap-2 pt-4 text-datum-strong uppercase text-ink-accent">
                  {item.cta}
                  <Arrow
                    width={16}
                    height={16}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </span>
              </Module>
            </Stretcher>
          ))}
        </Course>
      </Wall>
    </section>
  );
}
