import Image from "next/image";

/**
 * The house image pattern: fill plus object-cover inside a box with an
 * explicit aspect ratio, so it can never shift layout.
 *
 * `sizes` is REQUIRED, not optional. A wrong sizes value is the single biggest
 * cause of oversized downloads and it is invisible in review, so the type
 * system asks for it every time.

 */

const ratios = {
  /** 2:1 on phones so the band is not a 130px sliver, 3:1 from lg.
      Never taller than the source: the 2:1 photograph cannot fill a 3:2 box
      without the browser upscaling it, which it was doing by 1.26x. */
  brick: "aspect-[2/1] lg:aspect-[3/1]",
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
  quality,
  className = "",
  imageClassName = "",
}: {
  src: string;
  alt: string;
  sizes: string;
  ratio?: Ratio;
  priority?: boolean;
  /** Only for noisy textures where the default over-encodes. See next.config. */
  quality?: number;
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
        quality={quality}
        className={`object-cover ${imageClassName}`}
      />
    </div>
  );
}
