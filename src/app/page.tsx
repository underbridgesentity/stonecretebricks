import { AudienceCourse } from "@/components/sections/audience-course";
import { Calculator } from "@/components/sections/calculator";
import { Hero } from "@/components/sections/hero";
import { ProductWall } from "@/components/sections/product-wall";
import { ProofCourse } from "@/components/sections/proof-course";
import { QuoteCta } from "@/components/sections/quote-cta";
import { SpecStrip } from "@/components/sections/spec-strip";
import { ButtonLink } from "@/components/ui/button";
import { CourseRule } from "@/components/ui/course-rule";
import { Arrow } from "@/components/ui/glyph";
import { Photo } from "@/components/ui/photo";
import { Course, Stretcher, Wall } from "@/components/ui/wall";
import { COMPANY } from "@/data/company";

export default function Home() {
  return (
    <>
      <Hero />

      {/* Course three: the photograph, deliberately below the fold so the
          largest contentful paint is text. */}
      <Photo
        src="/images/site/wall.jpg"
        alt="A newly built grey concrete block wall in raking late afternoon light, every course joint reading as a shadow line"
        sizes="100vw"
        ratio="brick"
      />

      <ProductWall />

      <SpecStrip />

      {/* Calculator */}
      <section className="border-b border-line py-16 md:py-24">
        <Wall>
          <CourseRule datum="02" label="Work out your quantities" />

          <Course bond="odd" className="mt-10 items-end gap-y-8">
            <Stretcher span="header">
              <h2 className="text-display uppercase text-ink">
                How many bricks does your wall need?
              </h2>
            </Stretcher>
            <Stretcher span="footer">
              <p className="text-body text-ink-secondary">
                Enter the length and height. We give you the unit count, the wastage allowance, the
                pallet count and the number of loads. Then we turn it into a quote.
              </p>
            </Stretcher>
          </Course>
        </Wall>

        <Wall className="mt-12">
          <Calculator compact />
        </Wall>
      </section>

      <AudienceCourse />

      <ProofCourse />

      {/* Delivery */}
      <section className="border-b border-line py-16 md:py-24">
        <Wall>
          <CourseRule datum="05" label="Getting it to site" />

          <Course bond="odd" className="mt-10 gap-y-10">
            <Stretcher span="header">
              <h2 className="text-display uppercase text-ink">We deliver to site.</h2>
              <p className="mt-6 max-w-xl text-lead text-ink-secondary">
                Site deliveries, scheduled drops and long term supply agreements across{" "}
                {COMPANY.region.value}. Tell us the address and the date, and the cost and the lead
                time come back in the same quote.
              </p>
              <div className="mt-8">
                <ButtonLink href="/delivery" variant="outline">
                  Delivery areas and lead times
                  <Arrow width={18} height={18} />
                </ButtonLink>
              </div>
            </Stretcher>

            <Stretcher span="footer">
              <Photo
                src="/images/site/yard.jpg"
                alt="Stacks of grey cement bricks on pallets in a manufacturing yard"
                sizes="(min-width: 768px) 560px, 100vw"
                ratio="course"
              />
            </Stretcher>
          </Course>
        </Wall>
      </section>

      <QuoteCta />
    </>
  );
}
