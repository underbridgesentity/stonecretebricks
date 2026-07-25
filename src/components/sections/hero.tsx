import { Monogram } from "@/components/brand/monogram";
import { ButtonLink } from "@/components/ui/button";
import { Arrow } from "@/components/ui/glyph";
import { Pending } from "@/components/ui/pending";
import { Course, Stretcher, Wall } from "@/components/ui/wall";
import { COMPANY } from "@/data/company";
import { PRODUCTS, unitsPerSquareMetreRounded } from "@/data/products";

/**
 * Course one and two of the wall.
 *
 * The headline is flush left in a seven column stretcher and runs to the wall
 * edge. Nothing here is centred, and there is deliberately no photograph
 * behind the type: the LCP element is text, which removes the hero-image
 * problem architecturally rather than by tuning.
 *
 * Course two is an even course, so it starts three columns in. That indent is
 * the bond, and it is the first thing on the page that tells you the layout
 * has a system behind it.
 *
 * Stagger cadence is the house 70 / 140 / 260 / 340 ms.
 */
export function Hero() {
  const suburb = COMPANY.suburb.value;
  const stock = PRODUCTS[0];
  const perM2 = stock ? unitsPerSquareMetreRounded(stock) : 52;

  return (
    <section className="border-b border-line pb-14 pt-12 md:pb-20 md:pt-16">
      <Wall>
        <Course bond="odd" className="items-center gap-y-10">
          <Stretcher span="header">
            <p
              className="animate-set mb-7 flex items-center gap-3 text-datum uppercase text-ink-secondary"
              style={{ animationDelay: "70ms" }}
            >
              <span aria-hidden className="inline-block h-px w-10 bg-oxide" />
              Manufactured in {COMPANY.region.value}
            </p>

            <h1
              className="animate-set text-mega uppercase text-ink"
              style={{ animationDelay: "140ms" }}
            >
              Strength in
              <br />
              every brick
            </h1>
          </Stretcher>

          <Stretcher span="footer" className="flex justify-center md:justify-end">
            <Monogram variant="colour" set className="h-32 w-auto md:h-44 lg:h-52" />
          </Stretcher>
        </Course>
      </Wall>

      <Wall className="mt-10 md:mt-12">
        <Course bond="even" className="items-end gap-y-8">
          <Stretcher span="stretcher">
            <p
              className="animate-set max-w-xl text-lead text-ink-secondary"
              style={{ animationDelay: "260ms" }}
            >
              Concrete bricks, blocks and pavers, cast and cured{" "}
              {suburb ? `in ${suburb}` : <Pending>plant suburb</Pending>} and delivered to site
              across {COMPANY.region.value}.
            </p>

            <div
              className="animate-set mt-7 flex flex-wrap items-center gap-3"
              style={{ animationDelay: "340ms" }}
            >
              <ButtonLink href="/quote" variant="oxide">
                Get a quote
                <Arrow width={18} height={18} />
              </ButtonLink>
              <ButtonLink href="/products" variant="outline">
                Explore products
              </ButtonLink>
            </div>

            <p
              className="animate-set mt-5 text-small text-ink-secondary"
              style={{ animationDelay: "400ms" }}
            >
              Quotes returned within {COMPANY.responseHours.value} business hours. WhatsApp us for a
              faster answer.
            </p>
          </Stretcher>

          <Stretcher span="closer">
            <dl className="animate-set flex flex-col" style={{ animationDelay: "400ms" }}>
              <div className="flex items-baseline justify-between gap-4 border-t-2 border-line-strong py-3">
                <dt className="text-datum uppercase text-ink-secondary">Stock per m&sup2;</dt>
                <dd className="text-h2 text-ink" data-figure>
                  {perM2}
                </dd>
              </div>
              <div className="flex items-baseline justify-between gap-4 border-t border-line py-3">
                <dt className="text-datum uppercase text-ink-secondary">Masonry</dt>
                <dd className="text-h2 text-ink" data-figure>
                  SANS 1215
                </dd>
              </div>
              <div className="flex items-baseline justify-between gap-4 border-t border-line py-3">
                <dt className="text-datum uppercase text-ink-secondary">Paving</dt>
                <dd className="text-h2 text-ink" data-figure>
                  SANS 1058
                </dd>
              </div>
            </dl>
          </Stretcher>
        </Course>
      </Wall>
    </section>
  );
}
