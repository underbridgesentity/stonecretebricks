import type { ReactNode } from "react";

import { Course, Stretcher, Wall } from "@/components/ui/wall";

/**
 * The opening course of every page other than the home page.
 *
 * Same bond as the hero: datum in the joint, headline flush left in seven
 * columns, supporting copy stepping in on the even course below.
 */
export function PageHead({
  datum,
  eyebrow,
  title,
  lead,
  aside,
}: {
  datum: string;
  eyebrow: string;
  title: string;
  lead: string;
  aside?: ReactNode;
}) {
  return (
    <section className="border-b border-line pb-14 pt-12 md:pb-16 md:pt-16">
      <Wall>
        <Course bond="odd">
          <Stretcher span="header">
            <p
              className="animate-set mb-7 flex items-center gap-3 text-datum uppercase text-ink-secondary"
              style={{ animationDelay: "70ms" }}
            >
              <span aria-hidden className="inline-block h-px w-10 bg-oxide" />
              <span className="font-extrabold text-ink">{datum}</span>
              {eyebrow}
            </p>
            <h1
              className="animate-set text-display uppercase text-ink"
              style={{ animationDelay: "140ms" }}
            >
              {title}
            </h1>
          </Stretcher>
        </Course>
      </Wall>

      <Wall className="mt-8 md:mt-10">
        <Course bond="even" className="items-end gap-y-8">
          <Stretcher span="stretcher">
            <p
              className="animate-set max-w-xl text-lead text-ink-secondary"
              style={{ animationDelay: "260ms" }}
            >
              {lead}
            </p>
          </Stretcher>
          {aside ? (
            <Stretcher span="closer">
              <div className="animate-set" style={{ animationDelay: "340ms" }}>
                {aside}
              </div>
            </Stretcher>
          ) : null}
        </Course>
      </Wall>
    </section>
  );
}
