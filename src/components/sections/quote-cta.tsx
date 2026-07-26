import { ButtonLink } from "@/components/ui/button";
import { Arrow, Phone, Whatsapp } from "@/components/ui/glyph";
import { Course, Section, Stretcher, Wall } from "@/components/ui/wall";
import { COMPANY, telLink, whatsappLink } from "@/data/company";

/** The closing course. One statement, three ways to act, nothing else. */
export function QuoteCta({
  heading = "Tell us what you are building.",
  body = "Send the quantity, the suburb and the date you need it. A price, a lead time and a delivery cost come back together.",
}: {
  heading?: string;
  body?: string;
}) {
  const tel = telLink();
  const wa = whatsappLink(
    "Hi Stonecrete Bricks, I need a price on bricks.\n\nProduct: \nQuantity: \nSite address: \nDate needed: ",
  );

  return (
    <Section ground="dark">
      <Wall>
        <Course className="items-end">
          <Stretcher span="measure">
            <h2 className="max-w-[18ch] text-display uppercase text-ink">{heading}</h2>
            <p className="mt-7 max-w-[52ch] text-lead text-ink-secondary">{body}</p>
          </Stretcher>

          <Stretcher span="quarter" className="md:col-start-10">
            <div className="flex flex-col gap-6">
              <ButtonLink href="/quote" variant="oxide">
                Request a quote
                <Arrow width={16} height={16} />
              </ButtonLink>

              <div className="flex flex-col gap-4">
                {wa ? (
                  <a
                    href={wa}
                    className="group inline-flex items-center gap-3 text-datum-strong uppercase text-ink transition-colors hover:text-ink-accent"
                  >
                    <Whatsapp width={16} height={16} className="text-oxide" />
                    WhatsApp us
                  </a>
                ) : null}

                {tel ? (
                  <a
                    href={tel}
                    className="group inline-flex items-center gap-3 text-datum-strong uppercase text-ink transition-colors hover:text-ink-accent"
                  >
                    <Phone width={16} height={16} className="text-oxide" />
                    {COMPANY.phone.value}
                  </a>
                ) : null}
              </div>

              <p className="text-small text-ink-secondary">
                WhatsApp is answered fastest. Use the form for a formal quotation, so the quantities
                are right first time.
              </p>
            </div>
          </Stretcher>
        </Course>
      </Wall>
    </Section>
  );
}
