import type { SVGProps } from "react";

/**
 * Hand-authored glyphs on the same orthogonal grid as the mark. 2px strokes,
 * butt caps, mitre joins, currentColor.
 *
 * There is deliberately no icon library. Lucide's rounded caps fight a brand
 * with no curve in it, and a generic icon set is one of the loudest
 * templated-site tells. These are the only six the site needs.
 */

type GlyphProps = SVGProps<SVGSVGElement>;

function Glyph({ children, ...props }: GlyphProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="24"
      height="24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="butt"
      strokeLinejoin="miter"
      aria-hidden
      {...props}
    >
      {children}
    </svg>
  );
}

/** Flat-tipped, on the horizontal. Used on every forward action. */
export function Arrow(props: GlyphProps) {
  return (
    <Glyph {...props}>
      <path d="M3 12h18M14 5l7 7-7 7" />
    </Glyph>
  );
}

export function ArrowDown(props: GlyphProps) {
  return (
    <Glyph {...props}>
      <path d="M12 3v18M5 14l7 7 7-7" />
    </Glyph>
  );
}

export function Phone(props: GlyphProps) {
  return (
    <Glyph {...props}>
      <path d="M4 3h5l2 5-3 2a12 12 0 0 0 6 6l2-3 5 2v5h-2A18 18 0 0 1 4 5Z" />
    </Glyph>
  );
}

export function Whatsapp(props: GlyphProps) {
  return (
    <Glyph {...props}>
      <path d="M3 21l1.6-4.4A8.5 8.5 0 1 1 7.9 20Z" />
      <path d="M8.6 8.4h1.6l1 2.2-1.1 1a6 6 0 0 0 2.6 2.6l1-1.1 2.2 1v1.6a6.6 6.6 0 0 1-7.3-7.3Z" />
    </Glyph>
  );
}

export function Pin(props: GlyphProps) {
  return (
    <Glyph {...props}>
      <path d="M12 22s7-7.2 7-12a7 7 0 1 0-14 0c0 4.8 7 12 7 12Z" />
      <path d="M9.5 9.5h5v3h-5z" />
    </Glyph>
  );
}

export function Mail(props: GlyphProps) {
  return (
    <Glyph {...props}>
      <path d="M3 5h18v14H3z" />
      <path d="m3 6 9 7 9-7" />
    </Glyph>
  );
}

/** The menu is three courses of a wall, offset. Not a generic hamburger. */
export function Courses(props: GlyphProps) {
  return (
    <Glyph {...props}>
      <path d="M3 6h18M7 12h14M3 18h18" />
    </Glyph>
  );
}

/** The only indicator a select has, since appearance is reset. */
export function Chevron(props: GlyphProps) {
  return (
    <Glyph {...props}>
      <path d="m5 9 7 7 7-7" />
    </Glyph>
  );
}

export function Close(props: GlyphProps) {
  return (
    <Glyph {...props}>
      <path d="m5 5 14 14M19 5 5 19" />
    </Glyph>
  );
}
