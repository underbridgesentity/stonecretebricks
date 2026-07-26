import type { Metadata } from "next";

import { PageHead } from "@/components/sections/page-head";
import { QuoteCta } from "@/components/sections/quote-cta";
import { CourseRule } from "@/components/ui/course-rule";
import { Module } from "@/components/ui/module";
import { Course, Stretcher, Wall } from "@/components/ui/wall";
import { COMPANY, DELIVERY_ZONES } from "@/data/company";
import { PRODUCTS } from "@/data/products";
import { number } from "@/lib/format";

export const metadata: Metadata = {
  title: "Delivery and lead times",
  description:
    "Where Stonecrete Bricks delivers, what the minimum load is, how long it takes, what you need on site and what happens if units arrive broken.",
  alternates: { canonical: "/delivery" },
};

const SITE_REQUIREMENTS = [
  {
    title: "Truck access",
    body: "A delivery vehicle needs a firm surface, a route in that is not blocked by parked cars or a skip, and enough turning room to leave without reversing onto a public road.",
  },
  {
    title: "Offloading",
    body: "Tell us on the quote whether you have a forklift or a telehandler on site. If not, we plan the load accordingly, and that changes the price, so it is better to say up front.",
  },
  {
    title: "Someone to sign",
    body: "The delivery note records product, quantity and batch. Somebody with authority needs to count it and sign it before the vehicle leaves.",
  },
  {
    title: "Standing time",
    body: "The first 30 minutes on site are included. Beyond that a standing charge applies, because the vehicle is not doing its next drop.",
  },
];

export default function DeliveryPage() {
  const zones = DELIVERY_ZONES.value ?? [];

  /* Derived, not written down. The two extremes of what fits on a truck are
     the illustration, and if the client confirms a different pallet
     configuration the sentence follows the table instead of contradicting it. */
  const perLoad = PRODUCTS.map((p) => ({
    name: p.name,
    units: p.unitsPerPallet.value * p.palletsPerLoad.value,
  }));
  const fewestPerLoad = perLoad.reduce((a, b) => (b.units < a.units ? b : a));
  const mostPerLoad = perLoad.reduce((a, b) => (b.units > a.units ? b : a));

  return (
    <>
      <PageHead
        eyebrow="Delivery"
        title="Delivery and lead times."
        lead={`Here is where we deliver, what the minimum load is and how long it takes. If your site sits outside these areas, ask us anyway: we would rather quote it than turn it away.`}
      />

      {/* Zones */}
      <section className="border-t border-line py-[var(--section)]">
        <Wall>
          <CourseRule label="Where we deliver" />

          <h2 className="mt-12 max-w-[24ch] text-display uppercase text-ink">
            Zones, minimums and lead times.
          </h2>

          <p className="mt-12 text-small text-ink-secondary md:hidden">
            Swipe the table sideways to see minimums and lead times.
          </p>

          {/* tabIndex, role and a label, because a scroll container with no
              focusable child cannot be reached or scrolled by keyboard at all.
              This table is min-w-[40rem] inside a viewport that is narrower than
              that on a phone, at 200% zoom, or in a split window, so the
              Minimum and Lead time columns were simply unreachable without a
              mouse. WCAG 2.1.1. role=region plus a label is what makes a
              screen reader announce it as something you can move around in
              rather than a stray tab stop. */}
          <div
            tabIndex={0}
            role="region"
            aria-label="Delivery zones table, scrollable"
            className="mt-4 w-full overflow-x-auto md:mt-12"
          >
            <table className="w-full min-w-[40rem] border-separate border-spacing-0 text-left">
              {/* Visible, and carrying the provisional marker, so the footnote
                  below has something to refer to. This matches how SpecTable
                  captions its own provisional figures. */}
              <caption className="mb-4 text-left text-datum uppercase text-ink-secondary">
                Delivery zones, minimum loads and lead times
                <sup className="ml-1 text-ink-accent">
                  <span aria-hidden>*</span>
                  <span className="sr-only"> provisional</span>
                </sup>
              </caption>
              <thead>
                <tr>
                  <th
                    scope="col"
                    className="sticky left-0 z-10 border-b border-r border-line-strong bg-ground py-5 pr-6 text-datum uppercase text-ink-secondary"
                  >
                    Zone
                  </th>
                  <th scope="col" className="border-b border-line-strong py-5 pr-6 text-datum uppercase text-ink-secondary">
                    Area
                  </th>
                  <th scope="col" className="border-b border-line-strong py-5 pr-6 text-datum uppercase text-ink-secondary">
                    Minimum
                  </th>
                  <th scope="col" className="border-b border-line-strong py-5 pr-6 text-datum uppercase text-ink-secondary">
                    Lead time
                  </th>
                </tr>
              </thead>
              <tbody>
                {zones.map((zone) => (
                  <tr key={zone.zone}>
                    <th
                      scope="row"
                      className="sticky left-0 z-10 border-b border-r border-line bg-ground py-5 pr-6 align-top text-body font-extrabold text-ink"
                    >
                      {zone.zone}
                    </th>
                    <td className="border-b border-line py-5 pr-6 align-top text-body text-ink-secondary">
                      {zone.radius}
                    </td>
                    <td className="border-b border-line py-5 pr-6 align-top text-body text-ink" data-figure>
                      {zone.minimum}
                    </td>
                    <td className="border-b border-line py-5 align-top text-body text-ink" data-figure>
                      {zone.lead}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/*
            Three things this footnote now has to do, because the site was
            silently contradicting itself on all three.

            One. The zone minimum is quoted in loads and the product pages
            quote a minimum order in units. A Polokwane buyer read "1 000
            units" on the stock brick page and "1 load", which is 2 000 units,
            here. Two different minimums for the same brick on the same site,
            on a site whose whole argument is that it publishes the things
            other suppliers make you phone for. They are two separate floors
            and the larger one binds, so say that.

            Two. Every lead time on a product page is production time and every
            lead time in this table is door to door, and nothing said whether
            they stack. Mokopane read as 5, or 7, or 12.

            Three. This table is flagged assumed in the data, and rendered as
            fact. /products carries a provisional footnote over exactly the
            same class of unconfirmed figure. Same site, same problem, opposite
            treatment.
          */}
          <div className="mt-6 flex max-w-[54ch] flex-col gap-3 text-small text-ink-secondary">
            <p>
              The minimum in this table is the delivery minimum. Each product also carries its own
              minimum order, and where the two differ the larger one applies. Delivery is charged
              per load and quoted with the product, never added afterwards.
            </p>
            <p>
              Lead times here are door to door and already include the production time quoted on the
              product pages. They do not add together.
            </p>
            <p>
              <sup className="text-ink-accent">
                <span aria-hidden>*</span>
                <span className="sr-only">Provisional. </span>
              </sup>
              Zones, minimums and lead times are provisional until the yard address is published.
              They are measured from the plant, so the suburb list settles when the address does.
            </p>
          </div>
        </Wall>
      </section>

      {/* Loads */}
      <section data-ground="graphite" className="bg-graphite py-[var(--section)]">
        <Wall>
          <CourseRule label="What fits on a load" tone="oxide" />

          <Course className="mt-12 gap-y-10">
            <Stretcher span="measure">
              <h2 className="text-display uppercase text-ink">One load, in units.</h2>
              {/*
                The word "load" carried the minimum on the zone table, the
                pallets-per-load figure on every product page, the trip count
                in the calculator and the delivery charge basis, and the site
                never once said what one was. A contractor needs the vehicle
                before he can tell you whether it will reach his site.
                The old line also said loads are limited by mass rather than
                volume, which is true, and then published four loads weighing
                6 750, 7 000, 7 500 and 7 920 kg. The reason is pallets: you
                carry whole ones, so the last pallet is what leaves the gap.
              */}
              <p className="mt-6 max-w-[45ch] text-body text-ink-secondary">
                A load is one truck carrying up to 8 000 kg. Mass fills it long before volume does,
                so a load is {number(fewestPerLoad.units)} {fewestPerLoad.name.toLowerCase()} against{" "}
                {number(mostPerLoad.units)} {mostPerLoad.name.toLowerCase()}. You carry whole
                pallets, so the last pallet is what leaves the gap under the 8 000. These are the
                figures the calculator uses when it works out how many trips your order takes.
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
                      {number(p.palletsPerLoad.value * p.unitsPerPallet.value)}
                      <span className="text-small font-normal text-ink-secondary"> units</span>
                    </dd>
                  </div>
                ))}
              </dl>
            </Stretcher>
          </Course>
        </Wall>
      </section>

      {/* Site requirements */}
      <section className="border-t border-line py-[var(--section)]">
        <Wall>
          <CourseRule label="What you need on site" />

          {/* CourseRule renders a <p>, not a heading, so without this the four
              requirement h3s below nested under "One load, in units." and a
              reader navigating by heading heard truck access and offloading
              announced as part of the load capacity section. Same defect, and
              same fix, as the related products band on a product page. */}
          <h2 className="mt-12 text-h1 uppercase text-ink">Before the truck arrives.</h2>

          <div className="mt-12 grid grid-cols-1 gap-[var(--joint)] md:grid-cols-2">
            {SITE_REQUIREMENTS.map((req) => (
              <Module key={req.title} reveal className="flex flex-col gap-3 p-6 md:p-8">
                <h3 className="text-h3 uppercase text-ink">{req.title}</h3>
                <p className="text-body text-ink-secondary">{req.body}</p>
              </Module>
            ))}
          </div>
        </Wall>
      </section>

      {/* Breakage policy. Nobody publishes this. */}
      <section className="border-t border-line py-[var(--section-tight)]">
        <Wall>
          <CourseRule label="If something goes wrong" />

          <Course className="mt-12 gap-y-8">
            <Stretcher span="half">
              <h2 className="text-h1 uppercase text-ink">Breakage and shortages.</h2>
              <p className="mt-6 text-body text-ink-secondary">
                Some breakage is normal in transit and a small allowance is built into every load.
                Beyond that, count the delivery before you sign for it and note any shortage or
                damage on the delivery note. We replace short or damaged units on the next
                scheduled run to your area, at no charge.
              </p>
              <p className="mt-6 text-body text-ink-secondary">
                We publish this because knowing the policy before you order is worth more than
                discovering it afterwards. The exact allowance and the claim window are confirmed on
                your quotation.
              </p>
            </Stretcher>
          </Course>
        </Wall>
      </section>

      <QuoteCta
        heading={`Tell us where the site is.`}
        body={`Name the suburb and we will tell you which zone it falls in and what the delivery costs, before you commit to anything. We go anywhere in ${COMPANY.region.value}, and further if you ask.`}
      />
    </>
  );
}
