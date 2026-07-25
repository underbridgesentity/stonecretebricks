import Link from "next/link";

import { Lockup } from "@/components/brand/wordmark";
import { Mail, Phone, Pin, Whatsapp } from "@/components/ui/glyph";
import { Pending } from "@/components/ui/pending";
import { Wall } from "@/components/ui/wall";
import { addressLine, COMPANY, NAV, telLink, whatsappLink } from "@/data/company";
import { PRODUCTS } from "@/data/products";

export function SiteFooter() {
  const tel = telLink();
  const wa = whatsappLink("Hi Stonecrete Bricks, I would like a price on bricks.");
  const address = addressLine();

  return (
    <footer data-ground="graphite" className="border-t border-limestone/10 bg-graphite text-ink">
      <Wall className="py-20 md:py-24">
        <div className="grid grid-cols-2 gap-x-10 gap-y-14 md:grid-cols-12">
          <div className="col-span-2 flex flex-col gap-6 md:col-span-4">
            <Link
              href="/"
              className="text-[1.0625rem] text-limestone"
              aria-label="Stonecrete Bricks, home"
            >
              <Lockup orientation="horizontal" variant="on-dark" />
            </Link>
            <p className="max-w-xs text-small text-ink-secondary">
              Concrete bricks, blocks and pavers, cast and cured to the South African standard.
              Delivered to site across {COMPANY.address.province.value}.
            </p>
          </div>

          <nav aria-label="Products" className="flex flex-col gap-4 md:col-span-3">
            <h2 className="text-datum uppercase text-ink-secondary">Products</h2>
            {PRODUCTS.map((product) => (
              <Link
                key={product.slug}
                href={`/products/${product.slug}`}
                className="text-small text-ink transition-colors hover:text-ink-accent"
              >
                {product.name}
              </Link>
            ))}
          </nav>

          <nav aria-label="Company" className="flex flex-col gap-4 md:col-span-2">
            <h2 className="text-datum uppercase text-ink-secondary">Company</h2>
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-small text-ink transition-colors hover:text-ink-accent"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="col-span-2 flex flex-col gap-4 md:col-span-3">
            <h2 className="text-datum uppercase text-ink-secondary">Contact</h2>

            {tel ? (
              <a
                href={tel}
                className="inline-flex items-center gap-3 text-small text-ink transition-colors hover:text-ink-accent"
              >
                <Phone width={15} height={15} className="text-oxide" />
                {COMPANY.phone.value}
              </a>
            ) : null}

            {wa ? (
              <a
                href={wa}
                className="inline-flex items-center gap-3 text-small text-ink transition-colors hover:text-ink-accent"
              >
                <Whatsapp width={15} height={15} className="text-oxide" />
                WhatsApp
              </a>
            ) : null}

            <a
              href={`mailto:${COMPANY.email.value}`}
              className="inline-flex items-center gap-3 break-all text-small text-ink transition-colors hover:text-ink-accent"
            >
              <Mail width={15} height={15} className="text-oxide" />
              {COMPANY.email.value}
            </a>

            {address ? (
              <p className="inline-flex items-start gap-3 text-small text-ink-secondary">
                <Pin width={15} height={15} className="mt-1 shrink-0 text-oxide" />
                {address}
              </p>
            ) : (
              <Pending>Yard address</Pending>
            )}
          </div>
        </div>

        <div className="mt-20 flex flex-col gap-3 border-t border-limestone/10 pt-8 md:flex-row md:items-center md:justify-between">
          <p className="text-small text-ink-secondary">
            &copy; {new Date().getFullYear()} Stonecrete Bricks
          </p>
          <p className="text-datum uppercase text-ink-secondary">
            Masonry to SANS 1215 &nbsp;/&nbsp; Paving to SANS 1058
          </p>
        </div>
      </Wall>
    </footer>
  );
}
