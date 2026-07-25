import Link from "next/link";

import { Arrow } from "@/components/ui/glyph";
import { Photo } from "@/components/ui/photo";
import { Section, Split, Wall } from "@/components/ui/wall";
import { PRODUCTS, type Product } from "@/data/products";

/**
 * The range.
 *
 * Deliberately stripped: a name, a line, and the photograph. The first cut put
 * three spec figures on every card, which turned the section into a datasheet
 * and made the page feel like a parts catalogue. Specifications belong on the
 * product page, where someone has already decided they are interested.
 */
export function ProductWall() {
  return (
    <Section>
      <Wall>
        <Split label="The range">
          <h2 className="text-display uppercase text-ink">
            Four products, each made to a published standard.
          </h2>
        </Split>

        <div className="mt-16 grid grid-cols-1 gap-x-10 gap-y-14 sm:grid-cols-2">
          {PRODUCTS.map((product, i) => (
            <ProductBrick key={product.slug} product={product} index={i} />
          ))}
        </div>
      </Wall>
    </Section>
  );
}

export function ProductBrick({ product, index }: { product: Product; index: number }) {
  return (
    <Link
      href={`/products/${product.slug}`}
      className="group flex flex-col animate-course-set"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <Photo
        src={product.image}
        alt={`${product.name}, a grey concrete unit photographed against a plain backdrop`}
        sizes="(min-width: 640px) 50vw, 100vw"
        ratio="unit"
        className="extrude"
      />

      <div className="mt-6 flex items-baseline justify-between gap-4 border-t border-line pt-5">
        <h3 className="text-h2 uppercase text-ink">{product.name}</h3>
        <span className="text-datum uppercase text-ink-secondary">
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>

      <p className="mt-3 max-w-sm text-body text-ink-secondary">{product.positioning}</p>

      <span className="mt-5 inline-flex items-center gap-3 text-datum-strong uppercase text-ink">
        Specifications
        <span
          aria-hidden
          className="inline-block h-px w-6 bg-oxide transition-all group-hover:w-10"
        />
        <Arrow width={14} height={14} className="text-oxide" />
      </span>
    </Link>
  );
}
