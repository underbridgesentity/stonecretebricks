import Image from "next/image";

/**
 * The house image pattern: fill plus object-cover inside a box with an
 * explicit aspect ratio, so it can never shift layout.
 *
 * `sizes` is REQUIRED, not optional. A wrong sizes value is the single biggest
 * cause of oversized downloads and it is invisible in review, so the type
 * system asks for it every time.
 *
 * The scrim is the only linear-gradient in the codebase.
 */

const ratios = {
  /** 3:1, the brick's own face. */
  brick: "aspect-[3/1]",
  /** 16:9, for wide bands. */
  course: "aspect-[16/9]",
  /** 4:3, for product renders. */
  unit: "aspect-[4/3]",
  /** 3:2. The product frame: auto-cropped so every unit fills the same
      proportion of the frame, so the four read as one shoot. */
  wide: "aspect-[3/2]",
  /** 3:4, for a tall editorial column. */
  portrait: "aspect-[3/4]",
  square: "aspect-square",
  /** Fills whatever the parent sets. Parent must have its own height. */
  fill: "h-full",
} as const;

type Ratio = keyof typeof ratios;

export function Photo({
  src,
  alt,
  sizes,
  ratio = "course",
  priority = false,
  scrim = false,
  className = "",
  imageClassName = "",
}: {
  src: string;
  alt: string;
  sizes: string;
  ratio?: Ratio;
  priority?: boolean;
  scrim?: boolean;
  className?: string;
  imageClassName?: string;
}) {
  return (
    <div className={`relative w-full overflow-hidden bg-ground-2 ${ratios[ratio]} ${className}`}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        className={`object-cover ${imageClassName}`}
      />
      {scrim ? (
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-graphite via-graphite/30 to-transparent"
        />
      ) : null}
    </div>
  );
}
