"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { Arrow } from "@/components/ui/glyph";
import { Field, Select, TextInput } from "@/components/ui/field";
import { calculatePaving, calculateWall, showWorking } from "@/lib/calculator";
import { number } from "@/lib/format";
import { PRODUCTS, unitsPerSquareMetre } from "@/data/products";

/**
 * How many do I need.
 *
 * Three things make this convert where every competitor calculator dead-ends
 * at a number: it answers in South African buying units (units, then pallets,
 * then loads, because you cannot buy 7 143 bricks), it shows its working,
 * which is how a sceptical contractor decides you know your product, and it
 * ends in a quote carrying the quantity across.
 *
 * It renders server-side with sensible defaults, so with JavaScript disabled
 * you still get a correct worked example and the coverage figures.
 */
export function Calculator({ compact = false }: { compact?: boolean }) {
  const [slug, setSlug] = useState(PRODUCTS[0]?.slug ?? "");
  const [length, setLength] = useState("10");
  const [height, setHeight] = useState("2.4");
  const [skin, setSkin] = useState<"single" | "double">("single");

  const product = PRODUCTS.find((p) => p.slug === slug) ?? PRODUCTS[0];

  const result = useMemo(() => {
    if (!product) return null;
    const a = Number.parseFloat(length) || 0;
    const b = Number.parseFloat(height) || 0;

    return product.calculatorMode === "paving"
      ? calculatePaving(product, { length: a, width: b })
      : calculateWall(product, { length: a, height: b, skin, openings: [] });
  }, [product, length, height, skin]);

  if (!product || !result) return null;

  const paving = product.calculatorMode === "paving";
  const quoteHref = `/quote?product=${product.slug}&quantity=${result.orderUnits}&area=${result.netArea.toFixed(1)}`;

  return (
    <div className="grid grid-cols-1 gap-[var(--joint)] lg:grid-cols-2">
      {/* Inputs */}
      <div className="border border-line bg-ground p-6 md:p-8">
        <p className="text-datum uppercase text-ink-secondary">Your wall</p>

        <div className="mt-6 flex flex-col gap-5">
          <Field label="Product" htmlFor="calc-product">
            <Select id="calc-product" value={slug} onChange={(e) => setSlug(e.target.value)}>
              {PRODUCTS.map((p) => (
                <option key={p.slug} value={p.slug}>
                  {p.name}
                </option>
              ))}
            </Select>
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label={paving ? "Length" : "Wall length"} htmlFor="calc-length" hint="Metres">
              <TextInput
                id="calc-length"
                inputMode="decimal"
                value={length}
                onChange={(e) => setLength(e.target.value)}
              />
            </Field>
            <Field label={paving ? "Width" : "Wall height"} htmlFor="calc-height" hint="Metres">
              <TextInput
                id="calc-height"
                inputMode="decimal"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
              />
            </Field>
          </div>

          {!paving ? (
            <Field label="Wall type" htmlFor="calc-skin">
              <Select
                id="calc-skin"
                value={skin}
                onChange={(e) => setSkin(e.target.value === "double" ? "double" : "single")}
              >
                <option value="single">Single skin</option>
                <option value="double">Double skin</option>
              </Select>
            </Field>
          ) : null}
        </div>

        {!compact ? (
          <p className="mt-6 border-t border-line pt-4 text-small text-ink-secondary">
            {showWorking(product)}
          </p>
        ) : null}
      </div>

      {/* Results */}
      <div data-ground="graphite" className="flex flex-col bg-ground p-6 md:p-8">
        <p className="text-datum uppercase text-ink-secondary">
          {number(result.netArea, 1)} m&sup2; of {paving ? "paving" : "wall"}
        </p>

        <dl className="mt-6 flex flex-col">
          <Row
            label={`${product.name} needed`}
            value={number(result.baseUnits)}
            note="before wastage"
          />
          <Row
            label={`Plus ${Math.round(result.wastageFraction * 100)}% wastage`}
            value={number(result.unitsWithWastage)}
            note="cutting and breakage"
          />
          <Row
            label="Pallets"
            value={number(result.pallets)}
            note={`${number(product.unitsPerPallet.value)} per pallet`}
          />
          <Row
            label="What you order"
            value={number(result.orderUnits)}
            note={`${result.loads} ${result.loads === 1 ? "load" : "loads"}`}
            emphasis
          />
          {result.mortarCubicMetres !== null ? (
            <Row
              label="Mortar"
              value={`${number(result.mortarCubicMetres, 2)} m³`}
              note="estimate, 1:6 mix"
            />
          ) : null}
        </dl>

        <p className="mt-6 text-small text-ink-secondary">
          You buy by the pallet, so the order rounds up to a whole pallet. We show the figure before
          wastage as well, so you can see nothing is being padded.
        </p>

        <Link
          href={quoteHref}
          className="mt-6 inline-flex h-12 items-center justify-center gap-2 bg-oxide-deep px-6 text-datum-strong uppercase text-limestone extrude"
        >
          Get a quote for this quantity
          <Arrow width={16} height={16} />
        </Link>
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  note,
  emphasis = false,
}: {
  label: string;
  value: string;
  note?: string;
  emphasis?: boolean;
}) {
  return (
    <div
      className={`flex items-baseline justify-between gap-4 border-b border-line py-3 last:border-b-0 ${
        emphasis ? "border-t border-t-line-strong pt-4" : ""
      }`}
    >
      <dt className="text-small text-ink-secondary">
        {label}
        {note ? <span className="block text-datum uppercase">{note}</span> : null}
      </dt>
      <dd
        className={`shrink-0 text-ink ${emphasis ? "text-figure" : "text-h2"}`}
        data-figure
      >
        {value}
      </dd>
    </div>
  );
}

/** Static coverage reference, shown alongside the calculator. */
export function CoverageTable() {
  return (
    <table className="w-full border-collapse text-left">
      <caption className="mb-4 text-left text-datum uppercase text-ink-secondary">
        Coverage per square metre, single skin
      </caption>
      <thead>
        <tr className="border-b border-line-strong">
          <th scope="col" className="py-3 text-datum uppercase text-ink-secondary">
            Product
          </th>
          <th scope="col" className="py-3 text-right text-datum uppercase text-ink-secondary">
            Units per m&sup2;
          </th>
        </tr>
      </thead>
      <tbody>
        {PRODUCTS.map((p) => (
          <tr key={p.slug} className="border-b border-line last:border-b-0">
            <td className="py-3 text-body text-ink">{p.name}</td>
            <td className="py-3 text-right text-body font-extrabold text-ink" data-figure>
              {unitsPerSquareMetre(p).toFixed(1)}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
