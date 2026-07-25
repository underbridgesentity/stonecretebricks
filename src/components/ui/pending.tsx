/**
 * A fact the client has not given us yet.
 *
 * Renders as an unmissable marker rather than a plausible-looking placeholder,
 * because a fake phone number on a live site can reach a real stranger and a
 * fake address sends a thirty tonne truck to the wrong gate.
 *
 * The layout still reads complete, so the design can be reviewed, and every
 * one of these is listed by `pnpm specs:audit`.
 */

export function Pending({ children, className = "" }: { children: string; className?: string }) {
  return (
    <span
      data-pending
      title="Outstanding: the client has not supplied this yet"
      className={`inline-flex items-center gap-1.5 border border-dashed border-oxide px-2 py-0.5 text-datum uppercase text-ink-accent ${className}`}
    >
      <span aria-hidden className="inline-block size-1.5 shrink-0 bg-oxide" />
      {children}
    </span>
  );
}
