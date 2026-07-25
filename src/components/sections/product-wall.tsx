import { CourseRule } from "@/components/ui/course-rule";
import { Arrow } from "@/components/ui/glyph";
import { Module } from "@/components/ui/module";
import { Photo } from "@/components/ui/photo";
import { Course, Stretcher, Wall } from "@/components/ui/wall";
import {
  formatDimensions,
  PRODUCTS,
  unitsPerSquareMetreRounded,
  type Product,
} from "@/data/products";

/**
 * The four products laid as a running bond rather than a tidy 2x2.
 *
 * Course one is 7 + 5 columns, course two is 5 + 7, so the seam moves from
 * column 7 to column 5 between them and no vertical line ever forms. A 2x2
 * grid of rounded cards is the single most templated shape on the web, and
 * this is the same information with the brand's own geometry doing the work.
 */

const LAYOUT = [
  { span: "header", bond: "odd" },
  { span: "footer", bond: "odd" },
  { span: "footer", bond: "even" },
  { span: "header", bond: "even" },
] as const;

export function ProductWall() {
  const first = PRODUCTS.slice(0, 2);
  const second = PRODUCTS.slice(2, 4);

  return (
    <section className="border-b border-line py-16 md:py-24">
      <Wall>
        <CourseRule datum="01" label="What we make" />

        <Course bond="odd" className="mt-10 items-end gap-y-8">
          <Stretcher span="header">
            <h2 className="max-w-2xl text-display uppercase text-ink">
              Four products. Every one made to a published standard.
            </h2>
          </Stretcher>
          <Stretcher span="footer">
            <p className="text-body text-ink-secondary md:text-right">
              Dimensions, strength class and coverage are on every product page. No
              &ldquo;contact us for details&rdquo;.
            </p>
          </Stretcher>
        </Course>
      </Wall>

      <Wall className="mt-12">
        <Course bond="odd" className="gap-y-[var(--joint)]">
          {first.map((product, i) => (
            <Stretcher key={product.slug} span={LAYOUT[i]?.span ?? "stretcher"}>
              <ProductBrick product={product} index={i} />
            </Stretcher>
          ))}
        </Course>

        <Course bond="odd" className="mt-[var(--joint)] gap-y-[var(--joint)]">
          {second.map((product, i) => (
            <Stretcher key={product.slug} span={LAYOUT[i + 2]?.span ?? "stretcher"}>
              <ProductBrick product={product} index={i + 2} />
            </Stretcher>
          ))}
        </Course>
      </Wall>
    </section>
  );
}

export function ProductBrick({ product, index }: { product: Product; index: number }) {
  const perM2 = unitsPerSquareMetreRounded(product);

  return (
    <Module
      href={`/products/${product.slug}`}
      extrude
      reveal
      className="group flex h-full flex-col"
    >
      <Photo
        src={product.image}
        alt={`${product.name}, a grey concrete unit photographed against a plain backdrop`}
        sizes="(min-width: 768px) 672px, 100vw"
        ratio="brick"
        className="border-b border-line"
      />

      <div className="flex flex-1 flex-col gap-4 p-6 md:p-8">
        <div className="flex items-baseline justify-between gap-4">
          <h3 className="text-h2 uppercase text-ink">{product.name}</h3>
          <span className="text-datum uppercase text-ink-secondary">
            {String(index + 1).padStart(2, "0")}
          </span>
        </div>

        <p className="text-body text-ink-secondary">{product.positioning}</p>

        <dl className="mt-auto flex flex-wrap gap-x-8 gap-y-3 border-t border-line pt-4">
          <div>
            <dt className="text-datum uppercase text-ink-secondary">Size</dt>
            <dd className="mt-1 text-small text-ink" data-figure>
              {formatDimensions(product)}
            </dd>
          </div>
          <div>
            <dt className="text-datum uppercase text-ink-secondary">Per m&sup2;</dt>
            <dd className="mt-1 text-small text-ink" data-figure>
              {perM2} units
            </dd>
          </div>
          <div>
            <dt className="text-datum uppercase text-ink-secondary">Standard</dt>
            <dd className="mt-1 text-small text-ink">{product.standard}</dd>
          </div>
        </dl>

        <span className="inline-flex items-center gap-2 text-datum-strong uppercase text-ink-accent">
          View specifications
          <Arrow
            width={16}
            height={16}
            className="transition-transform group-hover:translate-x-1"
          />
        </span>
      </div>
    </Module>
  );
}
