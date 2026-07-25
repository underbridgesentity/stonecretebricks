import type { Metadata } from "next";
import Link from "next/link";

import { PageHead } from "@/components/sections/page-head";
import { ProductBrick } from "@/components/sections/product-wall";
import { QuoteCta } from "@/components/sections/quote-cta";
import { ButtonLink } from "@/components/ui/button";
import { CourseRule } from "@/components/ui/course-rule";
import { Arrow } from "@/components/ui/glyph";
import { Course, Stretcher, Wall } from "@/components/ui/wall";
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

/** The three routing questions, for buyers who do not know what they need. */
const ROUTES = [
  {
    question: "Building a house or a boundary wall?",
    answer: "Stock bricks for general work, maxi bricks if you want the walls up faster.",
    slug: "maxi-bricks",
  },
  {
    question: "Building something big, or something that needs to breathe?",
    answer: "Hollow blocks. Lighter, cheaper per square metre, better thermally.",
    slug: "hollow-blocks",
  },
  {
    question: "Laying a driveway or a walkway?",
    answer: "Paving bricks, graded on SANS 1058 rather than compressive strength.",
    slug: "paving-bricks",
  },
];

export default function ProductsPage() {
  return (
    <>
      <PageHead
        datum="01"
        eyebrow="Products"
        title="Concrete bricks, blocks and pavers."
        lead="Four standard products, plus custom units on request. Every specification below is derived from the unit size, not estimated, and every figure the client has not yet confirmed against a test certificate is marked."
        aside={
          <ButtonLink href="/quote" variant="oxide" className="w-full">
            Get a quote
            <Arrow width={18} height={18} />
          </ButtonLink>
        }
      />

      {/* Comparison table. The money page for an undecided buyer. */}
      <section className="border-b border-line py-16 md:py-24">
        <Wall>
          <CourseRule datum="02" label="Side by side" />

          <h2 className="mt-10 max-w-3xl text-display uppercase text-ink">
            Everything on one table.
          </h2>

          <div className="mt-10 w-full overflow-x-auto">
            <table className="w-full min-w-[46rem] border-collapse text-left">
              <caption className="sr-only">
                Comparison of Stonecrete Bricks concrete products
              </caption>
              <thead>
                <tr className="border-b-2 border-line-strong">
                  <th scope="col" className="py-4 pr-4 text-datum uppercase text-ink-secondary">
                    Specification
                  </th>
                  {PRODUCTS.map((p) => (
                    <th key={p.slug} scope="col" className="py-4 pr-4 align-bottom">
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
                  cells={PRODUCTS.map((p) => `${number(p.moq.value.qty)} ${p.moq.value.unit}`)}
                />
                <Row
                  label="Lead time"
                  cells={PRODUCTS.map((p) => `${p.leadTimeDays.value} working days`)}
                />
              </tbody>
            </table>
          </div>

          <p className="mt-6 max-w-2xl text-small text-ink-secondary">
            Every figure above is a South African industry standard awaiting confirmation against
            our own units and test certificates. Ask us for the certificate before you specify.
            Coverage and pallet figures are derived from the unit size, so they move the moment a
            dimension is confirmed.
          </p>
        </Wall>
      </section>

      {/* The four, in running bond. */}
      <section className="border-b border-line py-16 md:py-24">
        <Wall>
          <CourseRule datum="03" label="The range" />
        </Wall>

        <Wall className="mt-10">
          <Course bond="odd" className="gap-y-[var(--joint)]">
            {PRODUCTS.slice(0, 2).map((product, i) => (
              <Stretcher key={product.slug} span={i === 0 ? "header" : "footer"}>
                <ProductBrick product={product} index={i} />
              </Stretcher>
            ))}
          </Course>
          <Course bond="odd" className="mt-[var(--joint)] gap-y-[var(--joint)]">
            {PRODUCTS.slice(2, 4).map((product, i) => (
              <Stretcher key={product.slug} span={i === 0 ? "footer" : "header"}>
                <ProductBrick product={product} index={i + 2} />
              </Stretcher>
            ))}
          </Course>
        </Wall>
      </section>

      {/* Which one do I need */}
      <section className="border-b border-line py-16 md:py-24">
        <Wall>
          <CourseRule datum="04" label="Not sure which one" />

          <h2 className="mt-10 max-w-3xl text-display uppercase text-ink">
            Three questions and you will know.
          </h2>

          <div className="mt-10 flex flex-col">
            {ROUTES.map((route, i) => (
              <Link
                key={route.slug}
                href={`/products/${route.slug}`}
                className="group flex flex-col gap-2 border-t border-line py-6 transition-colors hover:bg-ground-2 md:flex-row md:items-baseline md:gap-8"
              >
                <span className="w-10 shrink-0 text-datum uppercase text-ink-secondary">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="flex-1 text-h2 uppercase text-ink">{route.question}</span>
                <span className="flex-1 text-body text-ink-secondary">{route.answer}</span>
                <Arrow
                  width={20}
                  height={20}
                  className="shrink-0 text-ink-accent transition-transform group-hover:translate-x-1"
                />
              </Link>
            ))}
          </div>
        </Wall>
      </section>

      {/* Custom */}
      <section className="border-b border-line py-16 md:py-24">
        <Wall>
          <Course bond="even" className="items-end gap-y-8">
            <Stretcher span="stretcher">
              <h2 className="text-h1 uppercase text-ink">Custom concrete products.</h2>
              <p className="mt-5 max-w-xl text-body text-ink-secondary">
                Non-standard sizes, bespoke moulds and purpose-made units for a specific detail.
                Tell us what the drawing calls for and we will tell you whether we can press it,
                what the tooling costs and what the minimum run is.
              </p>
            </Stretcher>
            <Stretcher span="closer">
              <ButtonLink href="/quote?product=custom" variant="outline" className="w-full">
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
    <tr className="border-b border-line">
      <th scope="row" className="py-4 pr-4 align-top text-small font-normal text-ink-secondary">
        {label}
      </th>
      {cells.map((cell, i) => (
        <td key={i} className="py-4 pr-4 align-top text-body font-extrabold text-ink" data-figure>
          {cell}
        </td>
      ))}
    </tr>
  );
}
