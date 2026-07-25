import { ButtonLink } from "@/components/ui/button";
import { Arrow } from "@/components/ui/glyph";
import { Course, Stretcher, Wall } from "@/components/ui/wall";
import { PRODUCTS } from "@/data/products";

export default function NotFound() {
  return (
    <section className="py-[var(--section)]">
      <Wall>
        <Course className="gap-y-10">
          <Stretcher span="measure">
            <p className="mb-7 text-datum uppercase text-ink-secondary">
              404
            </p>
            <h1 className="text-display uppercase text-ink">That page is not here.</h1>
            <p className="mt-6 max-w-xl text-lead text-ink-secondary">
              The link may be old or mistyped. Everything we make is on the products page, and the
              quote form is two clicks away.
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <ButtonLink href="/products" variant="oxide">
                Products
                <Arrow width={16} height={16} />
              </ButtonLink>
              <ButtonLink href="/quote" variant="outline">
                Get a quote
              </ButtonLink>
            </div>
          </Stretcher>

          <Stretcher span="complement">
            <ul className="flex flex-col">
              {PRODUCTS.map((p) => (
                <li key={p.slug}>
                  <a
                    href={`/products/${p.slug}`}
                    className="flex items-center justify-between gap-4 border-b border-line py-4 text-h3 uppercase text-ink transition-colors hover:text-ink-accent"
                  >
                    {p.name}
                    <Arrow width={16} height={16} />
                  </a>
                </li>
              ))}
            </ul>
          </Stretcher>
        </Course>
      </Wall>
    </section>
  );
}
