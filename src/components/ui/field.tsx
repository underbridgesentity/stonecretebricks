import {
  cloneElement,
  isValidElement,
  type InputHTMLAttributes,
  type ReactElement,
  type ReactNode,
  type SelectHTMLAttributes,
  type TextareaHTMLAttributes,
} from "react";

import { Chevron } from "./glyph";

/**
 * Form controls. Square, 1px line-strong border, oxide focus ring from the
 * base layer. Labels are always visible: placeholder-as-label fails the moment
 * someone starts typing, and this audience fills forms on a phone on a site.
 */

const control =
  "w-full min-h-12 border border-line-strong bg-ground px-4 py-3 text-body text-ink placeholder:text-ink-secondary";

/**
 * Field owns the accessible wiring, not just the visual arrangement.
 *
 * The hint and the error used to sit beside the control as bare paragraphs,
 * related to it only by proximity. A screen reader user heard the label and
 * nothing else, which matters here because the hints carry real information
 * ("Delivery is the biggest variable in the price, so we ask early").
 *
 * So the ids are generated here and cloned onto the control. Every call site
 * already passes a matching `id`, so nothing else had to change.
 */
export function Field({
  label,
  htmlFor,
  hint,
  error,
  required = false,
  children,
  className = "",
}: {
  label: string;
  htmlFor: string;
  hint?: string;
  error?: string;
  required?: boolean;
  children: ReactNode;
  className?: string;
}) {
  const hintId = hint ? `${htmlFor}-hint` : undefined;
  const errorId = error ? `${htmlFor}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;

  const wired = isValidElement(children)
    ? cloneElement(children as ReactElement<Record<string, unknown>>, {
        "aria-describedby": describedBy,
        "aria-invalid": error ? true : undefined,
      })
    : children;

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <label htmlFor={htmlFor} className="text-label uppercase text-ink">
        {label}
        {required ? (
          <>
            <span aria-hidden="true" className="text-ink-accent">
              {" "}
              *
            </span>
            <span className="sr-only"> (required)</span>
          </>
        ) : null}
      </label>
      {hint ? (
        <p id={hintId} className="text-small text-ink-secondary">
          {hint}
        </p>
      ) : null}
      {wired}
      {error ? (
        <p id={errorId} className="text-small text-ink-accent" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function TextInput({ className = "", ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={`${control} ${className}`} {...props} />;
}

export function TextArea({ className = "", rows = 4, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea rows={rows} className={`${control} ${className}`} {...props} />;
}

/**
 * `appearance: none` strips the native arrow, which left a select visually
 * identical to a text input. Users tapped it expecting a keyboard and got a
 * picker. The chevron is the replacement affordance, drawn rather than
 * imported so it stays on the house grid.
 */
export function Select({ className = "", children, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <span className="relative block">
      <select className={`${control} appearance-none pr-12 ${className}`} {...props}>
        {children}
      </select>
      <Chevron
        width={18}
        height={18}
        className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-ink"
      />
    </span>
  );
}

/**
 * Product and option chips. A native checkbox or radio styled as a module, so
 * it keeps full keyboard and screen reader behaviour and works with no JS.
 *
 * The checked state carries a tick as well as a fill: colour alone fails in
 * direct sun, which is where a lot of this audience will be standing.
 */
export function Chip({
  label,
  name,
  value,
  type = "checkbox",
  defaultChecked = false,
}: {
  label: string;
  name: string;
  value: string;
  type?: "checkbox" | "radio";
  defaultChecked?: boolean;
}) {
  const id = `${name}-${value}`;

  return (
    <div className="contents">
      <input
        id={id}
        type={type}
        name={name}
        value={value}
        defaultChecked={defaultChecked}
        className="peer sr-only"
      />
      <label
        htmlFor={id}
        className="inline-flex min-h-12 cursor-pointer items-center gap-2 border border-line-strong px-4 text-label uppercase text-ink transition-colors hover:bg-ground-2 peer-checked:border-oxide-deep peer-checked:bg-oxide-deep peer-checked:text-limestone peer-focus-visible:outline peer-focus-visible:outline-[3px] peer-focus-visible:outline-offset-2 peer-focus-visible:outline-focus [&>svg]:hidden peer-checked:[&>svg]:block"
      >
        <svg
          viewBox="0 0 24 24"
          width="14"
          height="14"
          fill="none"
          stroke="currentColor"
          strokeWidth={3}
          strokeLinecap="butt"
          strokeLinejoin="miter"
          aria-hidden
          className="shrink-0"
        >
          <path d="m4 12 6 6L20 6" />
        </svg>
        {label}
      </label>
    </div>
  );
}
