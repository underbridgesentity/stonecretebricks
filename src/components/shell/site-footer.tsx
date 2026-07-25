import Link from "next/link";

import { BondPattern } from "@/components/brand/bond-pattern";
import { Lockup } from "@/components/brand/wordmark";
import { Mail, Phone, Pin, Whatsapp } from "@/components/ui/glyph";
import { Pending } from "@/components/ui/pending";
import { Wall } from "@/components/ui/wall";
import { addressLine, COMPANY, NAV, telLink, whatsappLink } from "@/data/company";
import { PRODUCTS } from "@/data/products";

/** The footing course. Inverted, with the bond pattern as a real structure. */
export function SiteFooter() {
  const tel = telLink();
  const wa = whatsappLink("Hi Stonecrete Bricks, I would like a price on bricks.");
  const address = addressLine();

  return (
    <footer data-ground="graphite" className="bg-ground text-ink">
      <BondPattern courses={3} density="open" tone="oxide" className="h-16 w-full" />

      <Wall className="py-16 md:py-20">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-12">
          <div className="flex flex-col gap-6 md:col-span-5">
            <Link href="/" className="text-[1.5rem] text-ink" aria-label="Stonecrete Bricks, home">
              <Lockup orientation="horizontal" />
            </Link>
            <p className="max-w-sm text-body text-ink-secondary">
              Concrete bricks, blocks and pavers, cast and cured to published South African
              standards. Delivered to site.
            </p>
          </div>

          <nav aria-label="Products" className="flex flex-col gap-4 md:col-span-3">
            <h2 className="text-datum uppercase text-ink-secondary">Products</h2>
            {PRODUCTS.map((product) => (
              <Link
                key={product.slug}
                href={`/products/${product.slug}`}
                className="text-body text-ink transition-colors hover:text-ink-accent"
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
                className="text-body text-ink transition-colors hover:text-ink-accent"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex flex-col gap-4 md:col-span-2">
            <h2 className="text-datum uppercase text-ink-secondary">Contact</h2>

            {tel ? (
              <a href={tel} className="inline-flex items-center gap-2 text-body text-ink">
                <Phone width={16} height={16} />
                {COMPANY.phone.value}
              </a>
            ) : (
              <Pending>Phone number</Pending>
            )}

            {wa ? (
              <a href={wa} className="inline-flex items-center gap-2 text-body text-ink">
                <Whatsapp width={16} height={16} />
                WhatsApp
              </a>
            ) : (
              <Pending>WhatsApp number</Pending>
            )}

            <a
              href={`mailto:${COMPANY.email.value}`}
              className="inline-flex items-center gap-2 break-all text-body text-ink"
            >
              <Mail width={16} height={16} />
              {COMPANY.email.value}
            </a>

            {address ? (
              <p className="inline-flex items-start gap-2 text-body text-ink-secondary">
                <Pin width={16} height={16} className="mt-1 shrink-0" />
                {address}
              </p>
            ) : (
              <Pending>Yard address</Pending>
            )}
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-line pt-8 md:flex-row md:items-center md:justify-between">
          <p className="text-small text-ink-secondary">
            &copy; {new Date().getFullYear()} Stonecrete Bricks. Manufactured in{" "}
            {COMPANY.address.province.value}, South Africa.
          </p>
          <p className="text-small text-ink-secondary">
            Masonry to SANS 1215. Paving to SANS 1058.
          </p>
        </div>
      </Wall>
    </footer>
  );
}
