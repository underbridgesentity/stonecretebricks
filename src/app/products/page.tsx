import type { Metadata } from "next";
import Link from "next/link";

import { PageHead } from "@/components/sections/page-head";
import { ProductBrick } from "@/components/sections/product-wall";
import { QuoteCta } from "@/components/sections/quote-cta";
import { ButtonLink } from "@/components/ui/button";
import { CourseRule } from "@/components/ui/course-rule";
import { Arrow } from "@/components/ui/glyph";
import { Course, Stretcher, Wall } from "@/components/ui/wall";
import { minimumInUnits } from "@/lib/calculator";
import { number } from "@/lib/format";
import {
  formatDimensions,
  PRODUCTS,
  squareMetresPerPallet,
  unitsPerSquareMetre,
} from "@/data/products";

export const metadata: Metadata = {
  title: "Products",
  description:
    "Concrete stock bricks, maxi bricks, hollow blocks and paving bricks compared side by side. Dimensions, strength, coverage, pallet quantities and minimum orders.",
  alternates: { canonical: "/products" },
};

export default function ProductsPage() {
  return (
    <>
      <PageHead
        eyebrow="Products"
        title="Concrete bricks, blocks and pavers."
        lead="Four standard products, plus custom units on request. Every coverage and pallet figure below is derived from the unit size rather than estimated, and anything still awaiting a test certificate is marked."
        aside={
          <ButtonLink href="/quote" variant="oxide">
            Request a quote
            <Arrow width={16} height={16} />
          </ButtonLink>
        }
      />

            {/* The four, in running bond. */}
      <section className="border-t border-line py-[var(--section)]">
        <Wall>
          <CourseRule label="The range" />

          <h2 className="mt-12 max-w-[22ch] text-display uppercase text-ink">
            Four products, each made to a published standard.
          </h2>
        </Wall>

        <Wall className="mt-14">
          <div className="grid grid-cols-1 gap-x-10 gap-y-14 sm:grid-cols-2">
            {PRODUCTS.map((product, i) => (
              <ProductBrick key={product.slug} product={product} index={i} />
            ))}
          </div>
        </Wall>
      </section>

      {/* Comparison table. The money page for an undecided buyer, and the one
          tonal event on a page that was otherwise four limestone bands deep. */}
      <section data-ground="graphite" className="bg-graphite py-[var(--section)]">
        <Wall>
          <CourseRule label="Side by side" tone="oxide" />

          <h2 className="mt-12 max-w-[24ch] text-display uppercase text-ink">
            Everything on one table.
          </h2>

          <p className="mt-12 text-small text-ink-secondary md:hidden">
            Swipe the table sideways to compare all four.
          </p>

          {/* tabIndex, role and a label, because a scroll container with no
              focusable child cannot be reached or scrolled by keyboard at all.
              This table is min-w-[43rem] inside a viewport that is narrower than
              that on a phone, at 200% zoom, or in a split window, so the
              Minimum and Lead time columns were simply unreachable without a
              mouse. WCAG 2.1.1. role=region plus a label is what makes a
              screen reader announce it as something you can move around in
              rather than a stray tab stop. */}
          <div
            tabIndex={0}
            role="region"
            aria-label="Product comparison table, scrollable"
            className="mt-4 w-full overflow-x-auto md:mt-12"
          >
            <table className="w-full min-w-[43rem] border-separate border-spacing-0 text-left">
              <caption className="sr-only">
                Comparison of Stonecrete Bricks concrete products
              </caption>
              <thead>
                <tr>
                  <th
                    scope="col"
                    className="sticky left-0 z-10 border-b border-r border-line-strong bg-ground py-5 pr-6 align-baseline text-datum uppercase text-ink-secondary"
                  >
                    Specification
                  </th>
                  {PRODUCTS.map((p) => (
                    <th key={p.slug} scope="col" className="border-b border-line-strong py-5 pr-6 align-baseline">
                      <Link href={`/products/${p.slug}`} className="text-h3 uppercase text-ink">
                        {p.name}
                      </Link>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <Row label="Standard" cells={PRODUCTS.map((p) => p.standard)} />
                <Row label="Size (L x W x H)" cells={PRODUCTS.map((p) => formatDimensions(p))} />
                <Row
                  label="Strength"
                  cells={PRODUCTS.map((p) =>
                    p.nominalStrength
                      ? `${p.nominalStrength.value} MPa`
                      : (p.paverClass?.value ?? "Confirming"),
                  )}
                />
                <Row
                  label="Units per m²"
                  cells={PRODUCTS.map((p) => unitsPerSquareMetre(p).toFixed(1))}
                />
                <Row
                  label="Units per pallet"
                  cells={PRODUCTS.map((p) => number(p.unitsPerPallet.value))}
                />
                <Row
                  label="m² per pallet"
                  cells={PRODUCTS.map((p) => squareMetresPerPallet(p).toFixed(1))}
                />
                <Row label="Mass per unit" cells={PRODUCTS.map((p) => `${p.massPerUnit.value} kg`)} />
                <Row
                  label="Minimum order"
                  cells={PRODUCTS.map((p) =>
                    p.moq.value.unit === "units"
                      ? `${number(p.moq.value.qty)} units`
                      : `${number(p.moq.value.qty)} ${p.moq.value.unit} (${number(minimumInUnits(p))} units)`,
                  )}
                />
                <Row
                  label="Lead time"
                  cells={PRODUCTS.map((p) => `${p.leadTimeDays.value} working days`)}
                />
              </tbody>
            </table>
          </div>

          <p className="mt-6 max-w-[52ch] text-small text-ink-secondary">
            Every figure above is a South African industry standard awaiting confirmation against
            our own units and test certificates. Ask us for the certificate before you specify.
            Coverage and pallet figures are derived from the unit size, so they move the moment a
            dimension is confirmed.
          </p>
        </Wall>
      </section>

      {/* Custom */}
      <section className="border-t border-line py-[var(--section)]">
        <Wall>
          <Course className="items-end gap-y-8">
            <Stretcher span="half">
              <h2 className="text-h1 uppercase text-ink">Custom concrete products.</h2>
              <p className="mt-5 max-w-[45ch] text-body text-ink-secondary">
                Non-standard sizes, bespoke moulds and purpose-made units for a specific detail.
                Tell us what the drawing calls for and we will tell you whether we can press it,
                what the tooling costs and what the minimum run is.
              </p>
            </Stretcher>
            <Stretcher span="quarter">
              <ButtonLink href="/quote?product=custom" variant="outline">
                Enquire about custom units
              </ButtonLink>
            </Stretcher>
          </Course>
        </Wall>
      </section>

      <QuoteCta />
    </>
  );
}

function Row({ label, cells }: { label: string; cells: readonly string[] }) {
  return (
    <tr>
      <th
        scope="row"
        className="sticky left-0 z-10 border-b border-r border-line bg-ground py-5 pr-6 align-top text-small font-normal text-ink-secondary"
      >
        {label}
      </th>
      {cells.map((cell, i) => (
        <td
          key={i}
          className="border-b border-line py-5 pr-6 align-top text-body font-extrabold text-ink"
          data-figure
        >
          {cell}
        </td>
      ))}
    </tr>
  );
}
