import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";

/**
 * Buttons say what happens. Get a quote, Calculate quantity, Book a plant
 * visit. Never Submit.
 *
 * Zero radius, 48px tall so it clears the 44px touch floor. The oxide variant
 * carries the extrusion, because the primary action is the one that should
 * feel like a solid.
 */

const variants = {
  oxide: "bg-oxide-deep text-limestone border-oxide-deep extrude",
  graphite: "bg-graphite text-limestone border-graphite extrude",
  outline: "bg-transparent text-ink border-line-strong hover:bg-ink hover:text-ground",
  ghost: "bg-transparent text-ink-secondary border-transparent hover:text-ink",
} as const;

type Variant = keyof typeof variants;

const base =
  "inline-flex h-12 items-center justify-center gap-2 border px-6 text-datum-strong uppercase transition-colors disabled:cursor-not-allowed disabled:opacity-50";

export function Button({
  variant = "oxide",
  className = "",
  type = "button",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return <button type={type} className={`${base} ${variants[variant]} ${className}`} {...props} />;
}

export function ButtonLink({
  variant = "oxide",
  href,
  children,
  className = "",
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement> & {
  variant?: Variant;
  href: string;
  children: ReactNode;
}) {
  const external = href.startsWith("http") || href.startsWith("tel:") || href.startsWith("mailto:");
  const classes = `${base} ${variants[variant]} ${className}`;

  if (external) {
    return (
      <a href={href} className={classes} {...props}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={classes} {...props}>
      {children}
    </Link>
  );
}
