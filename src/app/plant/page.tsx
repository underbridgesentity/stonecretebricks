import type { Metadata } from "next";

import { PageHead } from "@/components/sections/page-head";
import { QuoteCta } from "@/components/sections/quote-cta";
import { CourseRule } from "@/components/ui/course-rule";
import { Pending } from "@/components/ui/pending";
import { Course, Stretcher, Wall } from "@/components/ui/wall";
import { addressLine, PROCESS } from "@/data/company";

export const metadata: Metadata = {
  title: "The yard",
  description:
    "How Stonecrete Bricks makes concrete bricks and blocks: batching, pressing, curing and dispatch. Come and inspect the yard before you order.",
  alternates: { canonical: "/plant" },
};

/**
 * The page that replaces a portfolio.
 *
 * A new manufacturer's honest advantage is that the plant, the aggregates, the
 * quality regime and the capacity are all real and inspectable today, while a
 * track record is not. Process transparency is the credibility substitute, and
 * an open invitation to visit is a CTA no competitor offers.
 */
export default function PlantPage() {
  const address = addressLine();

  return (
    <>
      <PageHead
        eyebrow="The yard"
        title="Come and watch us make them."
        lead="Most brick suppliers will not show you the yard. We will. This is where your order gets batched, pressed, cured and stacked, and you are welcome to stand and watch it happen before you place one."
      />

      {/* Process */}
      <section className="border-t border-line py-[var(--section)]">
        <Wall>
          <CourseRule label="How a batch is made" />

          <h2 className="mt-12 max-w-[24ch] text-display uppercase text-ink">
            Five steps, in order.
          </h2>

          <ol className="mt-12 flex flex-col">
            {PROCESS.map((stage, i) => (
              <li
                key={stage.step}
                className="animate-course-set flex flex-col gap-4 border-t border-line py-8 md:flex-row md:gap-12"
              >
                <p
                  aria-hidden
                  data-figure
                  className="text-figure text-ink-secondary md:w-20 md:shrink-0"
                >
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h3 className="text-h2 uppercase text-ink md:w-72 md:shrink-0">{stage.step}</h3>
                <p className="max-w-[49ch] text-body text-ink-secondary">{stage.body}</p>
              </li>
            ))}
          </ol>
        </Wall>
      </section>

      {/* Capacity */}
      <section data-ground="graphite" className="bg-graphite py-[var(--section)]">
        <Wall>
          <CourseRule label="Capacity" tone="oxide" />

          <Course className="mt-12 gap-y-10">
            <Stretcher span="measure">
              <h2 className="text-display uppercase text-ink">What we can actually make.</h2>
              <p className="mt-6 max-w-[45ch] text-body text-ink-secondary">
                Running out of bricks stops a site, so the honest answer to &ldquo;can you supply
                this&rdquo; matters more than an optimistic one. These figures are published so you
                can check them against your programme before you commit.
              </p>
            </Stretcher>

            <Stretcher span="complement">
              <dl className="flex flex-col">
                {[
                  { label: "Units per day", key: "Daily output" },
                  { label: "Stock held on the ground", key: "Stock holding" },
                  { label: "Shift pattern", key: "Shift pattern" },
                  { label: "Curing period", key: "Curing days" },
                ].map((row) => (
                  <div
                    key={row.label}
                    className="flex flex-wrap items-center justify-between gap-3 border-b border-line py-4"
                  >
                    <dt className="text-small text-ink-secondary">{row.label}</dt>
                    <dd>
                      <Pending>{row.key}</Pending>
                    </dd>
                  </div>
                ))}
              </dl>
            </Stretcher>
          </Course>
        </Wall>
      </section>

      {/* HSE */}
      <section className="border-t border-line py-[var(--section)]">
        <Wall>
          <CourseRule label="Health, safety and environment" />

          <Course className="mt-12 gap-y-8">
            <Stretcher span="half">
              <h2 className="text-h1 uppercase text-ink">Safe practice, responsible process.</h2>
              <p className="mt-6 text-body text-ink-secondary">
                Concrete manufacture is dusty, heavy work with moving plant, so safe working
                practice is a condition of operating rather than a policy statement. We run
                controlled procedures on site and manufacture in a way that minimises environmental
                impact, particularly around water use in curing and the handling of waste material.
              </p>
              <p className="mt-6 text-body text-ink-secondary">
                Visitors are issued with the right protective equipment and walk a defined route.
                Delivery vehicles and visitors use separate gates.
              </p>
            </Stretcher>
          </Course>
        </Wall>
      </section>

      {/* Visit */}
      <section className="border-t border-line py-[var(--section)]">
        <Wall>
          <CourseRule label="Book a visit" />

          <Course className="mt-12 gap-y-10">
            <Stretcher span="measure">
              <h2 className="text-display uppercase text-ink">
                Bring your quantity surveyor.
              </h2>
              <p className="mt-6 max-w-[45ch] text-body text-ink-secondary">
                Pick a morning, come to the yard, and watch a batch go through. Ask for the mix
                design, ask to see the curing area, ask what happens to units that fail. Nothing on
                this page means much until you have seen it yourself.
              </p>
              <p className="mt-6 text-body text-ink-secondary">
                {address ? (
                  address
                ) : (
                  <>
                    Yard address: <Pending>Plant and yard address</Pending>
                  </>
                )}
              </p>

              {/* We would rather show you nothing than show you someone else's
                  plant, so there is no photograph on this page until there is
                  a real one. Stated here as a line, not as a band: the absence
                  should not be more prominent than any fact. */}
              <p className="mt-6 max-w-[45ch] text-body text-ink-secondary">
                There are no photographs on this page yet. We would rather show you nothing than
                show you someone else&rsquo;s plant.
              </p>
              <div className="mt-4">
                <Pending>Plant and yard photography</Pending>
              </div>
            </Stretcher>
          </Course>
        </Wall>
      </section>

      <QuoteCta
        heading="Book a plant visit."
        body="Message us with a morning that suits you and we will have someone walk you through a batch from raw material to pallet."
      />
    </>
  );
}
