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

          <div className="mt-4 w-full overflow-x-auto md:mt-12">
            <table className="w-full min-w-[40rem] border-separate border-spacing-0 text-left">
              <caption className="sr-only">Delivery zones, minimum loads and lead times</caption>
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

          <p className="mt-6 max-w-[52ch] text-small text-ink-secondary">
            Zones are measured from the plant, so
            the exact suburb list is confirmed once the yard address is published. Delivery is
            charged per load and quoted with the product, never added afterwards.
          </p>
        </Wall>
      </section>

      {/* Loads */}
      <section data-ground="graphite" className="bg-graphite py-[var(--section)]">
        <Wall>
          <CourseRule label="What fits on a load" tone="oxide" />

          <Course className="mt-12 gap-y-10">
            <Stretcher span="measure">
              <h2 className="text-display uppercase text-ink">One load, in units.</h2>
              <p className="mt-6 max-w-[45ch] text-body text-ink-secondary">
                Loads are limited by mass, not by volume, so a load of hollow blocks carries far
                fewer units than a load of stock bricks. These are the figures the calculator uses
                when it tells you how many trips your order takes.
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
      <section className="border-t border-line py-[var(--section)]">
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
                We publish this because nobody else does, and because knowing the policy before you
                order is worth more than discovering it afterwards. The exact allowance and claim
                window are confirmed on your quotation.
              </p>
            </Stretcher>
          </Course>
        </Wall>
      </section>

      <QuoteCta
        heading={`Tell us where the site is.`}
        body={`Give us the suburb and the date, and the delivery cost and lead time come back in the same quote as the price. We deliver across ${COMPANY.region.value}.`}
      />
    </>
  );
}
