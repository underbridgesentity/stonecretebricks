import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { QuoteCta } from "@/components/sections/quote-cta";
import { ButtonLink } from "@/components/ui/button";
import { CourseRule } from "@/components/ui/course-rule";
import { Arrow } from "@/components/ui/glyph";
import { Photo } from "@/components/ui/photo";
import { SpecTable, type SpecRow } from "@/components/ui/spec-table";
import { Course, Stretcher, Wall } from "@/components/ui/wall";
import { compact } from "@/components/structured-data";
import { COMPANY, SITE_URL } from "@/data/company";
import {
  formatDimensions,
  PRODUCTS,
  productBySlug,
  squareMetresPerPallet,
  unitsPerSquareMetre,
  wallThickness,
  type Product,
} from "@/data/products";
import { showWorking } from "@/lib/calculator";
import { number } from "@/lib/format";

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = productBySlug(slug);
  if (!product) return {};

  return {
    title: product.seo.title,
    description: product.seo.description,
    alternates: { canonical: `/products/${product.slug}` },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = productBySlug(slug);
  if (!product) notFound();

  const perM2 = unitsPerSquareMetre(product);
  const paving = product.calculatorMode === "paving";
  const others = PRODUCTS.filter((p) => p.slug !== product.slug);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(compact(productSchema(product))) }}
      />

      {/* Hero */}
      <section className="border-b border-line pb-14 pt-12 md:pb-16 md:pt-16">
        <Wall>
          <Course className="items-center gap-y-10">
            <Stretcher span="measure">
              <p className="animate-set mb-7 flex items-center gap-3 text-datum uppercase text-ink-secondary">
                <Link href="/products" className="hover:text-ink">
                  Products
                </Link>
                <span aria-hidden>/</span>
                {product.standard}
              </p>

              {/* Mega, not display. At display the product name rendered the
                  same size as its own section headings two screens below, so
                  the page had no top of hierarchy. The names are short. */}
              <h1
                className="animate-set max-w-[14ch] text-mega uppercase text-ink"
                style={{ animationDelay: "140ms" }}
              >
                {product.name}
              </h1>

              <p
                className="animate-set mt-6 max-w-[45ch] text-lead text-ink-secondary"
                style={{ animationDelay: "260ms" }}
              >
                {product.positioning}
              </p>

              <div
                className="animate-set mt-8 flex flex-wrap gap-3"
                style={{ animationDelay: "340ms" }}
              >
                <ButtonLink href={`/quote?product=${product.slug}`} variant="oxide">
                  Request a quote
                  <Arrow width={16} height={16} />
                </ButtonLink>
                <ButtonLink href={`/quote?product=${product.slug}#calculator`} variant="outline">
                  Calculate quantity
                </ButtonLink>
              </div>
            </Stretcher>

            <Stretcher span="complement">
              <Photo
                src={product.image}
                alt={`A ${product.name.toLowerCase().replace(/s$/, "")}, grey concrete, photographed against a plain backdrop`}
                sizes="(min-width: 1024px) 450px, (min-width: 768px) 34vw, calc(100vw - 48px)"
                ratio="wide"
                priority
                className="border border-line"
              />
            </Stretcher>
          </Course>
        </Wall>
      </section>

      {/*
        The sheet. This was three bands: Specification, then a full band whose
        entire content was four one-word chips under a display heading, then an
        Ordering band carrying three facts and a repeat of the hero's quote
        button. Seven bands on a page about one brick, and the two thin ones
        were padding wearing the costume of structure.
        A real spec sheet puts the physical table, what the unit is for, how it
        covers and how you buy it on one sheet, because a buyer reads them
        together. So it is one band: the table and its applications left, the
        derived figures and the commercial terms right.
      */}
      <section className="border-t border-line py-[var(--section)]">
        <Wall>
          <CourseRule label="Specification" />

          <Course className="mt-12 gap-y-12">
            <Stretcher span="half">
              <SpecTable rows={specRows(product)} caption={`${product.name} to ${product.standard}`} />

              <p className="mt-10 text-datum uppercase text-ink-secondary">Suitable for</p>
              <ul className="mt-4 flex flex-wrap gap-[var(--joint)]">
                {product.suitableFor.map((use) => (
                  <li
                    key={use}
                    className="border border-line-strong px-4 py-3 text-datum-strong uppercase text-ink"
                  >
                    {use}
                  </li>
                ))}
              </ul>
            </Stretcher>

            <Stretcher span="complement" className="md:pl-8">
              <h2 className="text-h3 uppercase text-ink">Coverage, with the working</h2>
              <p className="mt-4 text-body text-ink-secondary">{showWorking(product)}</p>

              <dl className="mt-8 flex flex-col">
                <CoverageRow
                  label={paving ? "Pavers per m²" : "Units per m², single skin"}
                  value={perM2.toFixed(1)}
                />
                {!paving ? (
                  <CoverageRow
                    label="Units per m², double skin"
                    value={(perM2 * 2).toFixed(1)}
                  />
                ) : null}
                <CoverageRow
                  label="m² per pallet"
                  value={squareMetresPerPallet(product).toFixed(1)}
                />
                <CoverageRow
                  label="Pallet mass"
                  value={`${number(product.unitsPerPallet.value * product.massPerUnit.value)} kg`}
                />
              </dl>

              {!paving ? (
                <p className="mt-6 text-small text-ink-secondary">
                  A single skin of {product.name.toLowerCase()} gives a{" "}
                  {wallThickness(product)} mm wall.
                </p>
              ) : null}

              <h2 className="mt-14 text-h3 uppercase text-ink">Ordering</h2>
              <dl className="mt-6 flex flex-col">
                <CoverageRow
                  label="Minimum order"
                  value={`${number(product.moq.value.qty)} ${product.moq.value.unit}`}
                />
                <CoverageRow
                  label="Lead time"
                  value={`${product.leadTimeDays.value} working days`}
                />
                <CoverageRow label="Delivery" value={COMPANY.region.value ?? "On request"} />
              </dl>
            </Stretcher>
          </Course>
        </Wall>
      </section>

      {/* Features */}
      <section data-ground="graphite" className="bg-graphite py-[var(--section)]">
        <Wall>
          <CourseRule label="Why builders choose it" tone="oxide" />

          <h2 className="mt-12 max-w-[24ch] text-display uppercase text-ink">
            Four reasons, spelled out.
          </h2>

          {/* The numerals here were 01 02 03 04 over an unordered grid of
              benefits. There is no first reason. Numbering a set that has no
              sequence is decoration pretending to be information, and it is
              one of the loudest tells of a page laid out by pattern rather
              than by argument. The string line above each stays: it is the
              site's own device and it does not claim an order. */}
          <div className="mt-12 grid grid-cols-1 gap-x-12 gap-y-10 md:grid-cols-2">
            {product.features.map((feature) => (
              <div key={feature.label} className="animate-course-set">
                <span
                  aria-hidden
                  className="block h-px w-full origin-left bg-line-strong animate-course-lay"
                />
                <h3 className="mt-6 text-h2 uppercase text-ink">{feature.label}</h3>
                <p className="mt-3 text-body text-ink-secondary">{feature.expanded}</p>
              </div>
            ))}
          </div>
        </Wall>
      </section>

      {/* Related */}
      <section className="border-t border-line py-[var(--section)]">
        <Wall>
          <CourseRule label="The rest of the range" />

          {/* The only band on the page with no headline, which left its three
              product h3s nesting under "Four reasons, spelled out" two bands
              up. No level is skipped, so an outline checker passes it, but a
              reader navigating by heading hears the other products announced
              as part of this product's features. */}
          <h2 className="mt-12 text-h1 uppercase text-ink">Also in the range.</h2>

          <div className="mt-12 grid grid-cols-1 gap-[var(--joint)] md:grid-cols-3">
            {others.map((other) => (
              <Link
                key={other.slug}
                href={`/products/${other.slug}`}
                className="group flex flex-col gap-3 border border-line p-6 extrude"
              >
                <h3 className="text-h3 uppercase text-ink">{other.name}</h3>
                <p className="text-small text-ink-secondary">{other.positioning}</p>
                <span className="mt-auto inline-flex items-center gap-2 pt-4 text-datum-strong uppercase text-ink-accent">
                  Specifications
                  <Arrow
                    width={16}
                    height={16}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </span>
              </Link>
            ))}
          </div>
        </Wall>
      </section>

      <QuoteCta
        heading={`Need a price on ${product.name.toLowerCase()}?`}
        body="Send us the quantity, the site address and the date you need it. We will come back with a price, a lead time and a delivery cost."
      />
    </>
  );
}

function specRows(product: Product): SpecRow[] {
  const rows: SpecRow[] = [
    { label: "Standard", value: product.standard },
    {
      label: "Nominal size (L x W x H)",
      value: formatDimensions(product),
      assumed: product.dimensions.status !== "confirmed",
    },
  ];

  if (product.nominalStrength) {
    rows.push({
      label: "Nominal compressive strength",
      value: String(product.nominalStrength.value),
      unit: "MPa",
      assumed: product.nominalStrength.status !== "confirmed",
    });
  }

  // Pavers are graded on tensile splitting and abrasion, never compressive MPa.
  if (product.paverClass) {
    rows.push({
      label: "Class (tensile splitting)",
      value: product.paverClass.value,
      assumed: product.paverClass.status !== "confirmed",
    });
  }
  if (product.abrasion) {
    rows.push({
      label: "Abrasion resistance",
      value: product.abrasion.value,
      assumed: product.abrasion.status !== "confirmed",
    });
  }
  if (product.waterAbsorption) {
    rows.push({
      label: "Water absorption",
      value: product.waterAbsorption.value,
      assumed: product.waterAbsorption.status !== "confirmed",
    });
  }

  rows.push(
    {
      label: "Mass per unit",
      value: String(product.massPerUnit.value),
      unit: "kg",
      assumed: product.massPerUnit.status !== "confirmed",
    },
    {
      label: "Units per pallet",
      value: number(product.unitsPerPallet.value),
      assumed: product.unitsPerPallet.status !== "confirmed",
    },
    {
      label: "Pallets per load",
      value: String(product.palletsPerLoad.value),
      assumed: product.palletsPerLoad.status !== "confirmed",
    },
    {
      label: "Mortar joint allowed for",
      value: String(product.joint.value),
      unit: "mm",
      assumed: product.joint.status !== "confirmed",
    },
  );

  return rows;
}

function CoverageRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-line py-3 last:border-b-0">
      <dt className="text-small text-ink-secondary">{label}</dt>
      <dd className="text-h3 text-ink" data-figure>
        {value}
      </dd>
    </div>
  );
}

function productSchema(product: Product) {
  const { l, w, h } = product.dimensions.value;

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.seo.description,
    image: `${SITE_URL}${product.image}`,
    brand: { "@type": "Brand", name: "Stonecrete Bricks" },
    material: "Concrete",
    width: { "@type": "QuantitativeValue", value: w, unitCode: "MMT" },
    height: { "@type": "QuantitativeValue", value: h, unitCode: "MMT" },
    depth: { "@type": "QuantitativeValue", value: l, unitCode: "MMT" },
    weight: { "@type": "QuantitativeValue", value: product.massPerUnit.value, unitCode: "KGM" },
    offers: {
      "@type": "Offer",
      priceCurrency: "ZAR",
      availability: "https://schema.org/InStock",
      url: `${SITE_URL}/products/${product.slug}`,
      eligibleQuantity: {
        "@type": "QuantitativeValue",
        minValue: product.moq.value.qty,
        unitText: product.moq.value.unit,
      },
    },
  };
}
