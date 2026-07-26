import type { ReactNode } from "react";

/**
 * The datasheet. A real table, hairline rules, tabular figures.
 *
 * Publishing specs is the whole competitive position: every other supplier in
 * this market makes you phone for them. So the table is a first-class
 * component, not a styled list.
 *
 * A row with `status: "pending"` renders "Confirming" rather than a number.
 * Nothing is ever invented to fill a gap.
 */

export type SpecRow = {
  label: string;
  value: string;
  unit?: string;
  /** Shown as a footnote marker when the figure is not yet client-confirmed. */
  assumed?: boolean;
  pending?: boolean;
};

export function SpecTable({
  rows,
  caption,
  className = "",
}: {
  rows: ReadonlyArray<SpecRow>;
  caption?: ReactNode;
  className?: string;
}) {
  const anyAssumed = rows.some((r) => r.assumed || r.pending);

  return (
    <div className={`w-full overflow-x-auto ${className}`}>
      <table className="w-full border-collapse text-left">
        {caption ? (
          <caption className="mb-4 text-left text-datum uppercase text-ink-secondary">{caption}</caption>
        ) : null}
        <tbody>
          {rows.map((row) => (
            <tr key={row.label} className="border-b border-line last:border-b-0">
              <th
                scope="row"
                className="w-1/2 py-3 pr-4 align-top text-small font-normal text-ink-secondary"
              >
                {row.label}
              </th>
              <td className="py-3 align-top text-body font-extrabold text-ink">
                {row.pending ? (
                  <span className="font-normal text-ink-secondary">Confirming</span>
                ) : (
                  <>
                    {row.value}
                    {row.unit ? <span className="font-normal text-ink-secondary"> {row.unit}</span> : null}
                    {row.assumed ? (
                      <sup className="ml-1 text-datum font-normal text-ink-accent">
                        <span aria-hidden>*</span>
                        <span className="sr-only"> provisional</span>
                      </sup>
                    ) : null}
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {anyAssumed ? (
        <p className="mt-4 text-small text-ink-secondary">
          <span className="text-ink-accent">*</span> Industry standard figure, pending
          confirmation against our own test certificates. Ask us for the certificate before you
          specify.
        </p>
      ) : null}
    </div>
  );
}

