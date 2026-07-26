import type { Metadata } from "next";

import { PageHead } from "@/components/sections/page-head";
import { QuoteCta } from "@/components/sections/quote-cta";
import { CourseRule } from "@/components/ui/course-rule";
import { Module } from "@/components/ui/module";
import { Pending } from "@/components/ui/pending";
import { Course, Stretcher, Wall } from "@/components/ui/wall";

export const metadata: Metadata = {
  title: "Standards and testing",
  description:
    "The standards Stonecrete Bricks manufactures to. SANS 1215 for concrete masonry units, SANS 1058 for paving blocks, and what SABS approved actually means.",
  alternates: { canonical: "/quality" },
};

const STANDARDS = [
  {
    code: "SANS 1215",
    covers: "Concrete masonry units",
    body: "Stock bricks, maxi bricks and hollow blocks. Sets requirements for materials, dimensions and dimensional tolerance, compressive strength, water absorption and density, and how units are sampled for testing.",
  },
  {
    code: "SANS 1058",
    covers: "Concrete paving blocks",
    body: "Pavers, and it is a different standard for a good reason. Since the 2012 edition it grades on tensile splitting strength and abrasion resistance rather than compressive strength, because those are the properties that matter under a wheel.",
  },
  {
    code: "SANS 2001-CM1",
    covers: "Masonry construction",
    body: "How the units are built into a wall on site. We manufacture to the unit standards, and this is the one your bricklayer works to.",
  },
];

export default function QualityPage() {
  return (
    <>
      <PageHead
        eyebrow="Quality"
        title="Standards and testing."
        lead="Anyone can say their bricks are strong. Here is the standard each product is manufactured to, how it is tested, and what the results were."
      />

      {/* The standards */}
      <section className="border-t border-line py-[var(--section)]">
        <Wall>
          <CourseRule label="The standards that apply" />

          <div className="mt-12 flex flex-col">
            {STANDARDS.map((standard) => (
              <div
                key={standard.code}
                className="animate-course-set flex flex-col gap-4 border-t border-line py-8 md:flex-row md:gap-12"
              >
                <div className="md:w-64 md:shrink-0">
                  <h2 className="text-h1 uppercase text-ink">{standard.code}</h2>
                  <p className="mt-2 text-datum uppercase text-ink-secondary">{standard.covers}</p>
                </div>
                <p className="max-w-[49ch] text-body text-ink-secondary">{standard.body}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 border-l-2 border-oxide pl-6">
            <p className="max-w-[49ch] text-body text-ink">
              SANS 10400-K, the deemed-to-satisfy rules under the National Building Regulations,
              sets the floor at an average 3.0 MPa for hollow units and 4.0 MPa for solid units in
              single-storey work. For the lower storey of a double storey it rises to 7.0 MPa hollow
              and 10 MPa solid. Our hollow blocks are specified at 3.5 MPa and our solid units at
              7.0 MPa, both above the single-storey floor.
            </p>
          </div>
        </Wall>
      </section>

      {/*
        The SABS correction. The highest-credibility copy on the site, and the
        second and last oxide field. See docs/design-system.md 2b: two fields,
        both carrying a sentence a competitor would not write. No hairline
        inside, and every text colour is a literal full limestone, because
        --ink-secondary does not survive on this ground.
      */}
      <section className="bg-oxide-deep pb-[var(--section-tight)] pt-[var(--section)] text-limestone">
        <Wall>
          <p className="text-datum uppercase text-limestone">A note on wording</p>

          <h2 className="mt-8 max-w-[18ch] text-mega uppercase text-limestone">
            &ldquo;SABS approved&rdquo; is not a specification.
          </h2>

          <div className="mt-12 grid grid-cols-1 gap-x-10 gap-y-8 md:grid-cols-12">
            <p className="max-w-[45ch] text-lead text-limestone md:col-span-6">
              You will see the phrase used loosely across our industry, including in our own early
              draft documents. It is worth being precise about it, because it is the difference
              between a claim and a fact.
            </p>
            <div className="md:col-span-5 md:col-start-8">
              <p className="max-w-[45ch] text-body text-limestone">
                SABS is the South African Bureau of Standards, the body. SANS is the standard the
                body publishes. A product is not &ldquo;SABS approved&rdquo; in any general sense: it
                either complies with a specific SANS standard or it does not, and complying is
                something a test certificate demonstrates.
              </p>
              <p className="mt-6 max-w-[45ch] text-body text-limestone">
                So we will tell you which SANS standard each product is manufactured to, and we will
                show you the certificate. If a supplier will not name the standard, that is worth
                noticing.
              </p>
            </div>
          </div>
        </Wall>
      </section>

      {/* Test regime */}
      <section className="border-t border-line py-[var(--section)]">
        <Wall>
          <CourseRule label="What we test" />

          <Course className="mt-12 gap-y-10">
            <Stretcher span="measure">
              <h2 className="text-display uppercase text-ink">How often, and what for.</h2>
              <p className="mt-6 max-w-[45ch] text-body text-ink-secondary">
                Sampling frequency and the measured results come from our own production records and
                an independent laboratory. Both are published here once the first full batches are
                through.
              </p>
            </Stretcher>

            <Stretcher span="complement">
              <ul className="flex flex-col">
                {[
                  "Dimensions and dimensional tolerance",
                  "Squareness and face flatness",
                  "Compressive strength, masonry units",
                  "Tensile splitting and abrasion, pavers",
                  "Water absorption",
                  "Drying shrinkage",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-3 border-b border-line py-3 text-body text-ink"
                  >
                    <span aria-hidden className="inline-block size-2 shrink-0 bg-oxide" />
                    {item}
                  </li>
                ))}
              </ul>
            </Stretcher>
          </Course>
        </Wall>
      </section>

      {/* Certificates and membership */}
      <section className="border-t border-line py-[var(--section-tight)]">
        <Wall>
          <CourseRule label="Independent verification" />

          <div className="mt-12 grid grid-cols-1 gap-[var(--joint)] md:grid-cols-2">
            <Module className="flex flex-col gap-4 p-8">
              <h2 className="text-h2 uppercase text-ink">Test certificates</h2>
              <p className="text-body text-ink-secondary">
                Crush test results from an independent laboratory, published as downloadable PDFs
                with the laboratory name and the date of test. A dated third party certificate
                outranks any testimonial for a quantity surveyor or a municipal buyer.
              </p>
              <div className="mt-2">
                <Pending>Laboratory name and first certificates</Pending>
              </div>
            </Module>

            <Module className="flex flex-col gap-4 p-8">
              <h2 className="text-h2 uppercase text-ink">CMA membership</h2>
              <p className="text-body text-ink-secondary">
                Concrete Manufacturers Association producer membership requires a quality assurance
                system, a purpose built facility, occupational health and safety procedures,
                technical competence and financial stability. It does not require a trading history,
                which is why a new manufacturer can hold it from the start.
              </p>
              <div className="mt-2">
                <Pending>Membership status</Pending>
              </div>
            </Module>
          </div>
        </Wall>
      </section>

      <QuoteCta
        heading="Ask us for the certificate."
        body="Before you specify, ask for the test certificate for the product and the batch. We would rather you checked."
      />
    </>
  );
}
