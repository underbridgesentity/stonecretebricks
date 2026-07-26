import Link from "next/link";

import { Arrow } from "@/components/ui/glyph";
import { Photo } from "@/components/ui/photo";
import { Course, Section, Stretcher, Wall } from "@/components/ui/wall";

/**
 * Credibility for a business with no track record.
 *
 * The honest position is that the plant, the materials, the quality regime and
 * the capacity are all real and inspectable today, while a portfolio is not.
 * So we say the company is new, in plain words, and trade past-tense claims
 * for present-tense verifiable ones.
 *
 * No invented client logos, no stock photographs of other people's buildings,
 * no "20+ years combined experience", no fabricated tonnage counter.
 */

const PROOF = [
  {
    title: "Made to SANS 1215",
    body: "The standard for concrete masonry units. Our pavers are made to SANS 1058, which is a different standard for a good reason.",
    href: "/quality",
  },
  {
    title: "Independent test certificates",
    body: "Crush test results come from an independent laboratory, published with the laboratory name and the date of test. The first certificates land as the first full batches come through.",
    href: "/quality",
  },
  {
    title: "Open to inspection",
    body: "Book a morning, come to the yard, and watch a batch mixed, pressed, cured and stacked before you order.",
    href: "/plant",
  },
];

export function ProofCourse() {
  return (
    <Section divider>
      <Wall>
        <Course className="items-start">
          <Stretcher span="half">
            <p className="text-datum uppercase text-ink-secondary">A new supplier</p>
            <h2 className="mt-6 max-w-[18ch] text-display uppercase text-ink">
              New company. Proven standards.
            </h2>
            <p className="mt-7 max-w-[30ch] text-body text-ink-secondary">
              We do not have a twenty year history to sell you, so we will give you something more
              useful: the standard we manufacture to, the results that prove it, and an open
              invitation to come and watch us make them.
            </p>

            {/* A list of links, not a glossary. It was a <dl> with the anchor
                as a direct child, which is not permitted content and left the
                dt/dd pairs with no term-definition relationship at all. */}
            <ul className="mt-12 flex flex-col">
              {PROOF.map((item) => (
                <li key={item.title}>
                  <Link
                    href={item.href}
                    className="group flex flex-col gap-2 border-t border-line py-6 transition-colors hover:border-oxide"
                  >
                    <h3 className="flex items-center justify-between gap-4 text-h3 uppercase text-ink">
                      {item.title}
                      <Arrow
                        width={16}
                        height={16}
                        className="shrink-0 text-oxide transition-transform group-hover:translate-x-1"
                      />
                    </h3>
                    <span className="max-w-[46ch] text-small text-ink-secondary">{item.body}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </Stretcher>

          <Stretcher span="half">
            <Photo
              src="/images/site/plant.jpg"
              alt="Stacks of cured concrete units on pallets inside a manufacturing plant, lit by a shaft of daylight"
              sizes="(min-width: 768px) 50vw, 100vw"
              ratio="portrait"
            />
          </Stretcher>
        </Course>
      </Wall>
    </Section>
  );
}
