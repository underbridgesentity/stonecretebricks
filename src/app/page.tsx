import { Hero } from "@/components/sections/hero";
import { ProductWall } from "@/components/sections/product-wall";
import { ProofCourse } from "@/components/sections/proof-course";
import { QuoteCta } from "@/components/sections/quote-cta";
import { SpecStrip } from "@/components/sections/spec-strip";
import { COMPANY } from "@/data/company";

/**
 * Four sections, products first.
 *
 * What went, and why. A second full-size headline one screen under the hero
 * ("Every building starts with the material.") under an eyebrow that said the
 * company's own name. An eyebrow carrying the brand name is the clearest sign
 * a template slot was filled rather than written; the heading was a platitude
 * where the proposition should be; and both it and its paragraph were
 * duplicated verbatim on /about. It cost a whole section and earned none of it.
 *
 * And the full-bleed 3:1 band of repeating brick texture that followed it. That
 * was the retired bond pattern walking back in through the photo library: same
 * slot, same job, same filler. Gone for the same reason.
 */
export default function Home() {
  return (
    <>
      <Hero />
      <ProductWall />
      <SpecStrip />
      <ProofCourse />
      <QuoteCta
        body={`Send the quantity, the suburb and the date you need it. A price, a lead time and a delivery cost come back together, within ${COMPANY.responseHours.value} business hours.`}
      />
    </>
  );
}
