import type { ReactNode } from "react";

import { Wall } from "@/components/ui/wall";

/**
 * The opening of every page other than the home page.
 *
 * Deliberately quiet: a label, a title, a sentence. The first cut carried a
 * numbered datum, a rule, an eyebrow and an aside, which is four devices
 * competing before the reader has reached any content.
 */
export function PageHead({
  eyebrow,
  title,
  lead,
  aside,
}: {
  eyebrow: string;
  title: string;
  lead: string;
  aside?: ReactNode;
}) {
  return (
    <section className="border-b border-line pb-[var(--section)] pt-20 md:pt-28">
      <Wall>
        <div className="grid grid-cols-1 gap-x-10 gap-y-8 md:grid-cols-12">
          <div className="md:col-span-3">
            <p
              className="animate-set text-datum uppercase text-ink-secondary"
              style={{ animationDelay: "70ms" }}
            >
              {eyebrow}
            </p>
          </div>

          <div className="md:col-span-8">
            <h1
              className="animate-set max-w-[20ch] text-mega uppercase text-ink"
              style={{ animationDelay: "140ms" }}
            >
              {title}
            </h1>
            <p
              className="animate-set mt-8 max-w-xl text-lead text-ink-secondary"
              style={{ animationDelay: "240ms" }}
            >
              {lead}
            </p>
            {aside ? (
              <div className="animate-set mt-10" style={{ animationDelay: "320ms" }}>
                {aside}
              </div>
            ) : null}
          </div>
        </div>
      </Wall>
    </section>
  );
}
