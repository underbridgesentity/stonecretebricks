"use client";

import { useMemo, useState } from "react";

import { Field, Select, TextInput } from "@/components/ui/field";
import { Arrow } from "@/components/ui/glyph";
import { calculatePaving, calculateWall, showWorking } from "@/lib/calculator";
import { number } from "@/lib/format";
import { PRODUCTS } from "@/data/products";

/**
 * How many do I need.
 *
 * Three things make this convert where every competitor calculator dead-ends
 * at a number: it answers in South African buying units (units, then pallets,
 * then loads, because you cannot buy 7 143 bricks), it shows its working,
 * which is how a sceptical contractor decides you know your product, and it
 * hands the result to the quote form rather than throwing it away.
 *
 * It renders server-side with sensible defaults, so with JavaScript disabled
 * you still get a correct worked example and the coverage figures.
 */

type Opening = { id: number; width: string; height: string };

export function Calculator({
  compact = false,
  defaultProduct,
}: {
  compact?: boolean;
  /** Keeps the calculator in step with a product arriving in the query string. */
  defaultProduct?: string;
}) {
  const initial = PRODUCTS.find((p) => p.slug === defaultProduct)?.slug;
  const [slug, setSlug] = useState(initial ?? PRODUCTS[0]?.slug ?? "");
  const [length, setLength] = useState("10");
  const [height, setHeight] = useState("2.4");
  const [skin, setSkin] = useState<"single" | "double">("single");
  const [openings, setOpenings] = useState<Opening[]>([]);
  const [nextId, setNextId] = useState(1);
  const [carried, setCarried] = useState<string | null>(null);

  const product = PRODUCTS.find((p) => p.slug === slug) ?? PRODUCTS[0];

  const result = useMemo(() => {
    if (!product) return null;
    const a = Number.parseFloat(length) || 0;
    const b = Number.parseFloat(height) || 0;

    if (product.calculatorMode === "paving") {
      return calculatePaving(product, { length: a, width: b });
    }

    return calculateWall(product, {
      length: a,
      height: b,
      skin,
      openings: openings.map((o) => ({
        width: Number.parseFloat(o.width) || 0,
        height: Number.parseFloat(o.height) || 0,
      })),
    });
  }, [product, length, height, skin, openings]);

  if (!product || !result) return null;

  // Narrowed aliases so the callback below keeps the non-null types.
  const unit = product;
  const totals = result;
  const paving = unit.calculatorMode === "paving";
  const empty = totals.netArea <= 0;
  /*
   * Openings can swallow the whole wall, which is a different problem from
   * having entered nothing, and needs a different message.
   *
   * grossArea alone was not enough to tell them apart. It is the raw product
   * of two parsed numbers, so a length of -5 and a height of -2.4 multiply to
   * a positive 12 while the clamped net area is 0. The panel then said "the
   * doors and windows you have added come to the whole wall area" to somebody
   * who had added no openings at all, pointing them at a control they had
   * never touched. There has to actually be an opening for that to be the
   * explanation.
   */
  const grossArea = (Number.parseFloat(length) || 0) * (Number.parseFloat(height) || 0);
  const hasOpening = openings.some(
    (o) => (Number.parseFloat(o.width) || 0) > 0 && (Number.parseFloat(o.height) || 0) > 0,
  );
  const overDeducted = empty && grossArea > 0 && hasOpening;

  /**
   * Hand the result to the form instead of navigating.
   *
   * This used to be a link back to /quote, the page it already sits on, which
   * remounted the component to its defaults and scrolled the user to the top,
   * away from the numbers they had just worked out. The form's inputs are
   * uncontrolled, so writing values and dispatching an input event is safe.
   */
  function carryToForm() {
    if (empty) return;

    const form = document.getElementById("enquiry");
    if (!form) return;

    /*
     * Clear the others first. The quantity applies to one product, so leaving
     * a previously checked chip in place submitted two products against a
     * single figure.
     */
    for (const other of form.querySelectorAll<HTMLInputElement>('input[name="products"]')) {
      if (other.value !== unit.slug && other.checked) other.click();
    }
    const chip = form.querySelector<HTMLInputElement>(
      `input[name="products"][value="${unit.slug}"]`,
    );
    if (chip && !chip.checked) chip.click();

    // Uncontrolled inputs, so assigning value is sufficient and is what React
    // reads back on submit. No synthetic event is needed or fired.
    const qty = form.querySelector<HTMLInputElement>("#quantity");
    if (qty) qty.value = String(totals.orderUnits);

    const unitSelect = form.querySelector<HTMLSelectElement>("#quantityUnit");
    if (unitSelect) unitSelect.value = "units";

    /*
     * The note is the estimator's only sanity check on the quantity, so it has
     * to describe THIS calculation.
     *
     * The guard used to be `if (notes && !notes.value)`, meaning only the first
     * carry ever wrote. Change the wall from 24 m² to 144 m², or switch from
     * stock bricks to hollow blocks, carry again, and the quantity updated
     * while the note stayed at "Calculated for 24.0 m² of single skin wall".
     * The email reaching the yard then read 1 890 hollow blocks against a note
     * describing 24 m², which is about 315. The one field that exists to catch
     * a wrong order was the field disagreeing with it, by six times.
     *
     * So a note this component wrote is now replaced, and a note the buyer
     * typed is never touched. The marker makes the difference checkable rather
     * than guessed at from the text.
     */
    const notes = form.querySelector<HTMLTextAreaElement>("#notes");
    const line = `Calculated for ${number(totals.netArea, 1)} m² of ${
      paving ? "paving" : `${skin} skin wall`
    }.`;
    if (notes && (!notes.value || notes.dataset.fromCalculator === "true")) {
      notes.value = line;
      notes.dataset.fromCalculator = "true";
    }

    setCarried(
      `${number(totals.orderUnits)} ${unit.name.toLowerCase()} carried into the enquiry form.`,
    );
    form.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <div className="grid grid-cols-1 gap-[var(--joint)] lg:grid-cols-2">
      {/* Inputs */}
      <div className="border border-line bg-ground p-6 md:p-8">
        <p className="text-datum uppercase text-ink-secondary">
          {paving ? "Your paving" : "Your wall"}
        </p>

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
            <>
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

              {/* Doors and windows. Without these a house wall is over-ordered
                  by 15 to 20%, and the deduction maths already existed. */}
              <fieldset className="flex flex-col gap-3">
                <legend className="text-label uppercase text-ink">Doors and windows</legend>
                {openings.length === 0 ? (
                  <p className="text-small text-ink-secondary">
                    None yet. Add any openings and we will deduct them.
                  </p>
                ) : null}

                {openings.map((o, i) => (
                  <div key={o.id} className="flex items-end gap-3">
                    <div className="min-w-0 flex-1">
                      <label
                        htmlFor={`calc-open-w-${o.id}`}
                        className="mb-1 block text-small text-ink-secondary"
                      >
                        Width {i + 1} (m)
                      </label>
                      <TextInput
                        id={`calc-open-w-${o.id}`}
                        inputMode="decimal"
                        value={o.width}
                        onChange={(e) =>
                          setOpenings((list) =>
                            list.map((x) => (x.id === o.id ? { ...x, width: e.target.value } : x)),
                          )
                        }
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <label
                        htmlFor={`calc-open-h-${o.id}`}
                        className="mb-1 block text-small text-ink-secondary"
                      >
                        Height {i + 1} (m)
                      </label>
                      <TextInput
                        id={`calc-open-h-${o.id}`}
                        inputMode="decimal"
                        value={o.height}
                        onChange={(e) =>
                          setOpenings((list) =>
                            list.map((x) => (x.id === o.id ? { ...x, height: e.target.value } : x)),
                          )
                        }
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => setOpenings((list) => list.filter((x) => x.id !== o.id))}
                      className="min-h-12 shrink-0 border border-line-strong px-3 text-label uppercase text-ink transition-colors hover:bg-ground-2"
                    >
                      Remove
                      <span className="sr-only"> opening {i + 1}</span>
                    </button>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() => {
                    setOpenings((list) => [...list, { id: nextId, width: "0.9", height: "2.1" }]);
                    setNextId((n) => n + 1);
                  }}
                  className="inline-flex min-h-12 items-center self-start border border-line-strong px-4 text-label uppercase text-ink transition-colors hover:bg-ground-2"
                >
                  Add an opening
                </button>
              </fieldset>
            </>
          ) : null}
        </div>

        {!compact ? (
          <p className="mt-6 border-t border-line pt-4 text-small text-ink-secondary">
            {showWorking(unit)}
          </p>
        ) : null}
      </div>

      {/* Results */}
      <div data-ground="graphite" className="flex flex-col bg-ground p-6 md:p-8">
        {empty ? (
          <div className="flex flex-1 flex-col justify-center py-10">
            <p className="text-h2 uppercase text-ink">
              {overDeducted
                ? "Your openings fill the wall"
                : paving
                  ? "Enter your area"
                  : "Enter your wall"}
            </p>
            <p className="mt-4 max-w-[30ch] text-body text-ink-secondary">
              {overDeducted
                ? "The doors and windows you have added come to the whole wall area, so there is nothing left to build. Check those measurements."
                : `Put a length and a ${paving ? "width" : "height"} in metres on the left and we will work out the units, the wastage, the pallets and the loads.`}
            </p>
          </div>
        ) : (
          <>
            {/* The live region used to sit on the area line alone, so a screen
                reader changing the wall length heard "144.0 m² of wall" and
                never heard the number they came for. It wraps the figures now.
                Polite, not assertive: these update on every keystroke. */}
            <p className="text-datum uppercase text-ink-secondary">
              {number(totals.netArea, 1)} m&sup2; of {paving ? "paving" : "wall"}
            </p>

            <dl className="mt-6 flex flex-col" aria-live="polite">
              <Row
                label={`${unit.name} needed`}
                value={number(totals.baseUnits)}
                note="before wastage"
              />
              <Row
                label={`Plus ${Math.round(totals.wastageFraction * 100)}% wastage`}
                value={number(totals.unitsWithWastage)}
                note="cutting and breakage"
              />
              <Row
                label="Pallets"
                value={number(totals.pallets)}
                note={`${number(unit.unitsPerPallet.value)} per pallet`}
              />
              <Row
                label="What you order"
                value={number(totals.orderUnits)}
                note={`${number(totals.loads)} ${totals.loads === 1 ? "load" : "loads"}`}
                emphasis
              />
              {totals.mortarCubicMetres !== null ? (
                <Row
                  label="Mortar"
                  value={`${number(totals.mortarCubicMetres, 2)} m³`}
                  note="estimate, includes 15% waste"
                />
              ) : null}
            </dl>

            {totals.belowMinimum ? (
              <p className="mt-6 border-l-2 border-oxide pl-4 text-small text-ink">
                Your wall needs less than our minimum order, so this is quoted at the minimum of{" "}
                {number(totals.minimumUnits)} {unit.name.toLowerCase()}.
              </p>
            ) : null}

            <p className="mt-6 text-small text-ink-secondary">
              {/* This asserted "exclude VAT" while company.ts has VAT status
                  pending and /about correctly renders it as a Pending marker.
                  Whether the price carries VAT changes every figure a buyer
                  writes into a bill of quantities, so it is not something to
                  guess at on the one screen where they are doing sums. */}
              You buy by the pallet, so the order rounds up to a whole pallet. We show the figure
              before wastage as well, so you can see nothing is being padded. Delivery is charged
              per load and quoted with the price, and the quotation states whether VAT applies.
            </p>

            <button
              type="button"
              onClick={carryToForm}
              className="extrude mt-6 inline-flex h-12 items-center justify-center gap-2 bg-oxide-deep px-6 text-datum-strong uppercase text-limestone"
            >
              Use this quantity
              <Arrow width={16} height={16} />
            </button>

            <p aria-live="polite" className="mt-3 min-h-5 text-small text-ink-secondary">
              {carried}
            </p>
          </>
        )}
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
      <dd className={`shrink-0 text-ink ${emphasis ? "text-figure" : "text-h2"}`} data-figure>
        {value}
      </dd>
    </div>
  );
}

