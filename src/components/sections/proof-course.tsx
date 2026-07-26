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
            {/*
              Three marketing devices were stacked here: an eyebrow, a
              two-word-noun-phrase antithesis ("New company. Proven
              standards."), and then a sentence built as "not X, so instead
              something more useful: A, B and C". That last shape, the
              antithesis with a colon and a three limb list hanging off it, is
              the single most recognisable machine-written construction in
              English, and it sat immediately under the best written section on
              the site. It also promised "the results that prove it" when there
              are no results yet, which is the same false past tense /quality
              had.
            */}
            <p className="text-datum uppercase text-ink-secondary">A new supplier</p>
            <h2 className="mt-6 max-w-[18ch] text-display uppercase text-ink">
              Check us before you order.
            </h2>
            <p className="mt-7 max-w-[34ch] text-body text-ink-secondary">
              There is no twenty year history to point at, so we have built the business so that you
              do not need one. Everything below is checkable before you spend a rand.
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
            {/* Swapped with the hero. This frame is 1.778:1 against a 16:9
                box, so it crops nothing at all here, and beside a section
                arguing "check us before you order" an image of exacting cast
                concrete is a statement about the material rather than a claim
                about work this company has done. Nobody reads a monumental
                civic hall as the output of a new Polokwane brickmaker, which
                is exactly why it is safe here and the block house is not. */}
            <Photo
              src="/images/site/hero.jpg"
              alt="Cast concrete architecture in hard raking sun, deep shadow across a coffered panel"
              sizes="(min-width: 768px) 50vw, 100vw"
              ratio="course"
              className="border border-line"
            />
          </Stretcher>
        </Course>
      </Wall>
    </Section>
  );
}
