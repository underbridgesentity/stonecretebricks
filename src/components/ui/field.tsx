import type {
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";

/**
 * Form controls. Square, 1px line-strong border, oxide focus ring from the
 * base layer. Labels are always visible: placeholder-as-label fails the moment
 * someone starts typing, and this audience fills forms on a phone on a site.
 */

const control =
  "w-full min-h-12 border border-line-strong bg-ground px-4 py-3 text-body text-ink placeholder:text-ink-secondary";

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
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <label htmlFor={htmlFor} className="text-datum-strong uppercase text-ink">
        {label}
        {required ? <span className="text-ink-accent"> *</span> : null}
      </label>
      {hint ? <p className="text-small text-ink-secondary">{hint}</p> : null}
      {children}
      {error ? (
        <p className="text-small text-ink-accent" role="alert">
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

export function Select({ className = "", children, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select className={`${control} appearance-none ${className}`} {...props}>
      {children}
    </select>
  );
}

/**
 * Product and option chips. A native checkbox or radio styled as a module, so
 * it keeps full keyboard and screen reader behaviour and works with no JS.
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
        className="inline-flex min-h-12 cursor-pointer items-center border border-line-strong px-4 text-datum-strong uppercase text-ink transition-colors hover:bg-ground-2 peer-checked:border-oxide-deep peer-checked:bg-oxide-deep peer-checked:text-limestone peer-focus-visible:outline peer-focus-visible:outline-[3px] peer-focus-visible:outline-offset-2 peer-focus-visible:outline-focus"
      >
        {label}
      </label>
    </div>
  );
}
