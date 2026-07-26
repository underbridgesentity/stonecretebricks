import { Hero } from "@/components/sections/hero";
import { ProductWall } from "@/components/sections/product-wall";
import { ProofCourse } from "@/components/sections/proof-course";
import { QuoteCta } from "@/components/sections/quote-cta";
import { SpecStrip } from "@/components/sections/spec-strip";
import { Photo } from "@/components/ui/photo";
import { Section, Split, Wall } from "@/components/ui/wall";
import { COMPANY } from "@/data/company";

/**
 * Five sections.
 *
 * The first cut ran eight, including a live calculator, a five-tile audience
 * grid and a delivery block. It was a lot of page for a first impression, and
 * the density is what made it feel like a template rather than a brand. The
 * calculator now lives on the quote page, where someone has already decided to
 * buy, and the rest is one clear line of argument: what we make, why us, why
 * trust a new supplier, and how to ask.
 */
export default function Home() {
  return (
    <>
      <Hero />

      {/* One statement, alone on the page. Space is the point. */}
      <Section>
        <Wall>
          <Split label="Stonecrete Bricks">
            {/* A heading, not a paragraph: it is visually and structurally the
                heading of this section, and heading navigation needs it. */}
            <h2 className="max-w-[18ch] text-mega uppercase text-ink">
              Every building starts with the material.
            </h2>
            <p className="mt-10 max-w-[62ch] text-lead text-ink-secondary">
              A wall is only as good as the units in it. Inconsistent dimensions cost a bricklayer
              time and cost the client mortar. Units that have not cured properly fail under a
              trowel and fail under load. Solving that, consistently, is the whole business.
            </p>
          </Split>
        </Wall>
      </Section>

      <Photo
        src="/images/site/masonry.jpg"
        alt="Raking light across a precisely laid concrete block wall, every mortar joint reading as a sharp shadow line"
        sizes="100vw"
        ratio="brick"
      />

      <ProductWall />

      <SpecStrip />

      <ProofCourse />

      <QuoteCta
        body={`Send the quantity, the site address and the date you need it. A price, a lead time and a delivery cost come back together, within ${COMPANY.responseHours.value} business hours.`}
      />
    </>
  );
}
