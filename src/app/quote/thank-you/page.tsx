import type { Metadata } from "next";

import { ButtonLink } from "@/components/ui/button";
import { Arrow, Whatsapp } from "@/components/ui/glyph";
import { Pending } from "@/components/ui/pending";
import { Course, Stretcher, Wall } from "@/components/ui/wall";
import { COMPANY, whatsappLink } from "@/data/company";
import { respondByLabel } from "@/lib/response-time";

export const metadata: Metadata = {
  title: "Quote request received",
  robots: { index: false, follow: false },
};

export default async function ThankYouPage({
  searchParams,
}: {
  searchParams: Promise<{ ref?: string }>;
}) {
  const { ref } = await searchParams;
  const by = respondByLabel(new Date());
  const wa = whatsappLink(
    `Hi Stonecrete Bricks, I have just sent quote request ${ref ?? ""}. Could you take a look?`,
  );

  return (
    <section className="py-[var(--section)]">
      <Wall>
        <Course className="gap-y-10">
          <Stretcher span="measure">
            <p className="animate-set mb-7 text-datum uppercase text-ink-secondary">
              Received
            </p>

            <h1
              className="animate-set text-display uppercase text-ink"
              style={{ animationDelay: "140ms" }}
            >
              We have your request.
            </h1>

            {ref ? (
              <p
                className="animate-set mt-8 border-l-2 border-oxide pl-6"
                style={{ animationDelay: "260ms" }}
              >
                <span className="block text-datum uppercase text-ink-secondary">
                  Your reference
                </span>
                <span className="mt-1 block text-h1 text-ink" data-figure>
                  {ref}
                </span>
              </p>
            ) : null}

            <p
              className="animate-set mt-8 max-w-[62ch] text-lead text-ink-secondary"
              style={{ animationDelay: "340ms" }}
            >
              We will come back to you before <strong className="text-ink">{by}</strong> with a
              price, a lead time and a delivery cost. That is {COMPANY.responseHours.value} business
              hours, counted from now, not a vague window.
            </p>

            <div
              className="animate-set mt-10 flex flex-wrap gap-3"
              style={{ animationDelay: "400ms" }}
            >
              {wa ? (
                <ButtonLink href={wa} variant="oxide">
                  <Whatsapp width={18} height={18} />
                  Need it sooner? Send this on WhatsApp
                </ButtonLink>
              ) : (
                <Pending>WhatsApp number</Pending>
              )}
              <ButtonLink href="/products" variant="outline">
                Back to products
                <Arrow width={16} height={16} />
              </ButtonLink>
            </div>
          </Stretcher>
        </Course>
      </Wall>
    </section>
  );
}
