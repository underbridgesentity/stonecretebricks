import { BondPattern } from "@/components/brand/bond-pattern";
import { ButtonLink } from "@/components/ui/button";
import { Arrow, Phone, Whatsapp } from "@/components/ui/glyph";
import { Pending } from "@/components/ui/pending";
import { Course, Stretcher, Wall } from "@/components/ui/wall";
import { COMPANY, telLink, whatsappLink } from "@/data/company";

/** The closing course. Three lanes, chosen by how ready the buyer is. */
export function QuoteCta({
  heading = "Tell us what you are building.",
  body = "Send us the quantity, the site address and the date you need it. We will come back with a price, a lead time and a delivery cost.",
}: {
  heading?: string;
  body?: string;
}) {
  const tel = telLink();
  const wa = whatsappLink(
    "Hi Stonecrete Bricks, I need a price on bricks.\n\nProduct: \nQuantity: \nSite address: \nDate needed: ",
  );

  return (
    <section data-ground="graphite" className="relative overflow-hidden bg-ground py-16 md:py-24">
      <BondPattern
        courses={5}
        density="tight"
        tone="oxide"
        drift
        className="absolute inset-x-0 bottom-0 h-40 opacity-30"
      />

      <Wall className="relative">
        <Course bond="odd" className="items-end gap-y-8">
          <Stretcher span="header">
            <h2 className="text-display uppercase text-ink">{heading}</h2>
            <p className="mt-6 max-w-xl text-lead text-ink-secondary">{body}</p>
          </Stretcher>

          <Stretcher span="footer" className="flex flex-col gap-3">
            <ButtonLink href="/quote" variant="oxide" className="w-full">
              Get a quote
              <Arrow width={18} height={18} />
            </ButtonLink>

            {wa ? (
              <ButtonLink href={wa} variant="outline" className="w-full">
                <Whatsapp width={18} height={18} />
                WhatsApp us
              </ButtonLink>
            ) : (
              <Pending>WhatsApp number</Pending>
            )}

            {tel ? (
              <ButtonLink href={tel} variant="outline" className="w-full">
                <Phone width={18} height={18} />
                Call {COMPANY.phone.value}
              </ButtonLink>
            ) : (
              <Pending>Phone number</Pending>
            )}

            <p className="mt-2 text-small text-ink-secondary">
              We answer WhatsApp fastest. For a formal quotation use the form, so we get the
              quantities right first time.
            </p>
          </Stretcher>
        </Course>
      </Wall>
    </section>
  );
}
