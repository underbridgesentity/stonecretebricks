import type { Metadata } from "next";

import { PageHead } from "@/components/sections/page-head";
import { QuoteCta } from "@/components/sections/quote-cta";
import { ButtonLink } from "@/components/ui/button";
import { Arrow } from "@/components/ui/glyph";
import { Pending } from "@/components/ui/pending";
import { Course, Section, Split, Stretcher, Wall } from "@/components/ui/wall";
import { COMPANY } from "@/data/company";
import { number } from "@/lib/format";
import { PRODUCTS, squareMetresPerPallet } from "@/data/products";

export const metadata: Metadata = {
  title: "Trade accounts",
  description:
    `Stonecrete Bricks supplies hardware stores, builders merchants and building supply yards across ${COMPANY.region.value} on trade terms, with pallet pricing and agreed restocking.`,
  alternates: { canonical: "/trade" },
};

/**
 * The highest lifetime value buyer on the list, and the one the site served
 * worst: the quote form already offers "Reselling as a hardware store" as a
 * project type, and AUDIENCES has carried a hardware-store line since the
 * first build, but nothing rendered either. A reseller landed on a site aimed
 * entirely at end users and had no evidence we supply the trade at all.
 */

const TERMS = [
  {
    title: "Pallet pricing",
    body: "Trade pricing is set per pallet and per load, not per unit, and it steps with volume. Tell us the monthly quantity you expect to move and we will price against it rather than against a single order.",
  },
  {
    title: "Agreed restocking",
    body: "We plan a delivery day and hold stock against it, so you are not phoning for bricks on a Friday afternoon. Standing orders can be adjusted by phone up to the day before the run.",
  },
  {
    title: "Documented supply",
    body: "Every delivery carries a note stating product, quantity and batch. Tax invoices are issued against your account. Test certificates are available on request for any batch you have taken.",
  },
  {
    title: "Point of sale support",
    body: "Spec cards and coverage charts for your counter, so your staff can answer how many bricks a customer needs without phoning us.",
  },
];

const STEPS = [
  {
    step: "Tell us what you move",
    body: "Business name, where you are, and roughly what volume you expect each month. A rough figure is fine.",
  },
  {
    step: "We price it",
    body: "You get a trade price list for the products you want to stock, with delivery to your yard included in the figure.",
  },
  {
    step: "Open the account",
    body: "Company registration, VAT number and a credit application if you want terms rather than payment on delivery.",
  },
];

export default function TradePage() {
  return (
    <>
      <PageHead
        eyebrow="Trade accounts"
        title="Stock our bricks. Sell them at your margin."
        lead={`We supply hardware stores, builders merchants and building supply yards across ${COMPANY.region.value} on trade terms, with pallet pricing, an agreed delivery day and reliable restocking.`}
        aside={
          <ButtonLink href="/quote?projectType=resale" variant="oxide">
            Open a trade account
            <Arrow width={16} height={16} />
          </ButtonLink>
        }
      />

      <Section divider>
        <Wall>
          <Split label="What you get">
            <h2 className="max-w-[20ch] text-display uppercase text-ink">
              Terms built for a counter, not a building site.
            </h2>
          </Split>

          <dl className="mt-16 grid grid-cols-1 md:grid-cols-12">
            {TERMS.map((term) => (
              <div
                key={term.title}
                className="animate-course-set col-span-full grid grid-cols-1 gap-x-10 gap-y-3 border-t border-line py-10 md:grid-cols-12"
              >
                <dt className="text-h2 uppercase text-ink md:col-span-4">{term.title}</dt>
                <dd className="max-w-[45ch] text-body text-ink-secondary md:col-span-7">
                  {term.body}
                </dd>
              </div>
            ))}
          </dl>
        </Wall>
      </Section>

      {/* What a pallet actually is, so a buyer can price shelf space. */}
      <Section ground="dark">
        <Wall>
          <Course>
            <Stretcher span="measure">
              <p className="text-datum uppercase text-ink-secondary">By the pallet</p>
              <h2 className="mt-6 max-w-[20ch] text-display uppercase text-ink">
                What one pallet covers.
              </h2>
              <p className="mt-7 max-w-[38ch] text-lead text-ink-secondary">
                Useful when you are working out shelf space, yard space and what to quote a walk-in
                customer. Coverage is for a single skin wall.
              </p>
            </Stretcher>

            <Stretcher span="complement">
              <dl className="flex flex-col">
                {PRODUCTS.map((p) => (
                  <div
                    key={p.slug}
                    className="flex items-baseline justify-between gap-4 border-b border-line py-4"
                  >
                    <dt className="text-small text-ink-secondary">{p.name}</dt>
                    <dd className="text-h3 text-ink" data-figure>
                      {number(p.unitsPerPallet.value)}
                      <span className="text-small font-normal text-ink-secondary">
                        {" "}
                        units, {squareMetresPerPallet(p).toFixed(1)} m&sup2;
                      </span>
                    </dd>
                  </div>
                ))}
              </dl>
            </Stretcher>
          </Course>
        </Wall>
      </Section>

      <Section divider>
        <Wall>
          <Split label="Opening an account">
            <h2 className="max-w-[20ch] text-display uppercase text-ink">Three steps.</h2>
          </Split>

          <ol className="mt-16 flex flex-col">
            {STEPS.map((item, i) => (
              <li
                key={item.step}
                className="animate-course-set flex flex-col gap-3 border-t border-line py-10 md:flex-row md:gap-12"
              >
                <span
                  aria-hidden
                  data-figure
                  className="text-datum uppercase text-ink-secondary md:w-16 md:shrink-0"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="text-h2 uppercase text-ink md:w-64 md:shrink-0">{item.step}</h3>
                <p className="max-w-[45ch] text-body text-ink-secondary">{item.body}</p>
              </li>
            ))}
          </ol>

          <div className="mt-12 border-l-2 border-oxide pl-6">
            <p className="max-w-[45ch] text-body text-ink">
              Credit terms, the minimum monthly volume and the trade price list are confirmed per
              account.
            </p>
            <div className="mt-4">
              <Pending>Trade terms and credit policy</Pending>
            </div>
          </div>
        </Wall>
      </Section>

      <QuoteCta
        heading="Talk to us about stocking."
        body="Tell us your business name, where you are and roughly what you move each month. We will come back with a trade price list."
      />
    </>
  );
}
