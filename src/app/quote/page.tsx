import type { Metadata } from "next";

import { Calculator } from "@/components/sections/calculator";
import { EnquiryForm } from "@/components/sections/enquiry-form";
import { PageHead } from "@/components/sections/page-head";
import { CourseRule } from "@/components/ui/course-rule";
import { Phone, Whatsapp } from "@/components/ui/glyph";
import { Pending } from "@/components/ui/pending";
import { Course, Stretcher, Wall } from "@/components/ui/wall";
import { COMPANY, telLink, whatsappLink } from "@/data/company";

export const metadata: Metadata = {
  title: "Get a quote",
  description:
    "Request a price on concrete bricks, blocks or pavers. Tell us the quantity, the site and the date, and we come back with a price, a lead time and a delivery cost.",
  alternates: { canonical: "/quote" },
};

export default async function QuotePage({
  searchParams,
}: {
  searchParams: Promise<{ product?: string; quantity?: string }>;
}) {
  const { product, quantity } = await searchParams;
  const tel = telLink();
  const wa = whatsappLink(
    "Hi Stonecrete Bricks, I need a price on bricks.\n\nProduct: \nQuantity: \nSite address: \nDate needed: ",
  );

  return (
    <>
      <PageHead
        datum="01"
        eyebrow="Get a quote"
        title="Tell us what you are building."
        lead={`Send the quantity, the site address and the date you need it. We come back with a price, a lead time and a delivery cost, within ${COMPANY.responseHours.value} business hours.`}
        aside={
          <div className="flex flex-col gap-3">
            {wa ? (
              <a
                href={wa}
                className="inline-flex h-12 items-center justify-center gap-2 border border-line-strong px-6 text-datum-strong uppercase text-ink transition-colors hover:bg-ink hover:text-ground"
              >
                <Whatsapp width={18} height={18} />
                WhatsApp instead
              </a>
            ) : (
              <Pending>WhatsApp number</Pending>
            )}
            {tel ? (
              <a
                href={tel}
                className="inline-flex h-12 items-center justify-center gap-2 border border-line-strong px-6 text-datum-strong uppercase text-ink transition-colors hover:bg-ink hover:text-ground"
              >
                <Phone width={18} height={18} />
                Call us
              </a>
            ) : (
              <Pending>Phone number</Pending>
            )}
          </div>
        }
      />

      {/* Calculator, so the quantity in the form is a real one. */}
      <section id="calculator" className="scroll-mt-24 border-b border-line py-16 md:py-24">
        <Wall>
          <CourseRule datum="02" label="Not sure how many" />
          <h2 className="mt-10 max-w-3xl text-display uppercase text-ink">
            Work it out first.
          </h2>
          <p className="mt-6 max-w-xl text-body text-ink-secondary">
            Enter your wall and we give you the unit count, the wastage allowance, the pallets and
            the loads. Then carry that straight into the form below.
          </p>
        </Wall>
        <Wall className="mt-10">
          <Calculator />
        </Wall>
      </section>

      {/* The form */}
      <section className="border-b border-line py-16 md:py-24">
        <Wall>
          <CourseRule datum="03" label="Your enquiry" />
        </Wall>

        <Wall className="mt-10">
          <Course bond="odd" className="gap-y-12">
            <Stretcher span="header">
              <EnquiryForm defaultProduct={product} defaultQuantity={quantity} />
            </Stretcher>

            <Stretcher span="footer" className="md:pl-8">
              <div className="sticky top-28 flex flex-col gap-6 border border-line p-6 md:p-8">
                <h2 className="text-h3 uppercase text-ink">What happens next</h2>
                <ol className="flex flex-col gap-4">
                  {[
                    "You get a reference number straight away, and a time we will have come back to you by.",
                    "We price the product, the delivery to your suburb and the lead time against current stock.",
                    "You get the quotation, on WhatsApp, by phone or by email, whichever you chose.",
                  ].map((step, i) => (
                    <li key={step} className="flex gap-4 text-small text-ink-secondary">
                      <span className="text-datum uppercase text-ink-accent">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      {step}
                    </li>
                  ))}
                </ol>

                <p className="border-t border-line pt-4 text-small text-ink-secondary">
                  We answer WhatsApp fastest. Use the form when you want a formal quotation, so we
                  get the quantities right first time.
                </p>
              </div>
            </Stretcher>
          </Course>
        </Wall>
      </section>
    </>
  );
}
