import type { Metadata } from "next";

import { PageHead } from "@/components/sections/page-head";
import { QuoteCta } from "@/components/sections/quote-cta";
import { CourseRule } from "@/components/ui/course-rule";
import { Pending } from "@/components/ui/pending";
import { Photo } from "@/components/ui/photo";
import { Course, Stretcher, Wall } from "@/components/ui/wall";
import { COMPANY } from "@/data/company";

export const metadata: Metadata = {
  title: "About",
  description:
    "Stonecrete Bricks is a new South African concrete brick manufacturer. What we make, what we believe, and why a new supplier publishes more than an old one.",
  alternates: { canonical: "/about" },
};

/** The profile's mission bullets, rewritten out of corporate-speak. */
const MISSION = [
  {
    original: "Produce high-quality concrete bricks and blocks that meet industry standards",
    ours: "Make every unit to the same specification, and publish that specification.",
  },
  {
    original: "Deliver reliable and efficient service to all customers",
    ours: "Answer quickly, quote accurately, and deliver on the date we gave you.",
  },
  {
    original: "Build long-term partnerships with contractors, hardware stores and developers",
    ours: "Be the supplier people come back to, which means being straight about what we can and cannot do.",
  },
  {
    original:
      "Contribute to the growth of the construction industry through affordable building solutions",
    ours: "Keep good masonry affordable, because most of what gets built in this country is built to a budget.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHead
        eyebrow="About"
        title="Built on precision, not on history."
        lead="Stonecrete Bricks manufactures concrete bricks, blocks and pavers for residential, commercial, industrial and infrastructure work in South Africa. We are new, we say so plainly, and we have built the business around publishing the things our industry usually hides."
      />

      <Photo
        src="/images/site/blockwork.jpg"
        alt="A modern house built in grey concrete masonry block, hard afternoon shadow across the wall"
        sizes="100vw"
        ratio="brick"
      />

      {/* Why we started */}
      <section className="border-t border-line py-[var(--section)]">
        <Wall>
          <CourseRule label="Why we started" />

          <Course className="mt-12 gap-y-10">
            <Stretcher span="measure">
              <h2 className="text-display uppercase text-ink">
                Every building starts with the material.
              </h2>
            </Stretcher>
            <Stretcher span="complement">
              <p className="text-body text-ink-secondary">
                A wall is only as good as the units in it. Inconsistent dimensions cost a bricklayer
                time and cost the client mortar. Units that have not cured properly fail under a
                trowel and fail under load. Those are solvable problems, and solving them
                consistently is the whole business.
              </p>
              <div className="mt-6">
                <Pending>Founder story</Pending>
              </div>
            </Stretcher>
          </Course>
        </Wall>
      </section>

      {/* Vision */}
      <section data-ground="graphite" className="bg-graphite py-[var(--section)]">
        <Wall>
          <CourseRule label="Our vision" tone="oxide" />
          <p className="mt-10 max-w-[22ch] text-display uppercase text-ink">
            To be the supplier a contractor phones first, because the specification is published,
            the load arrives on the day, and the certificate is in the file.
          </p>
        </Wall>
      </section>

      {/* Mission */}
      <section className="border-t border-line py-[var(--section)]">
        <Wall>
          <CourseRule label="What we hold ourselves to" />

          <div className="mt-12 flex flex-col">
            {MISSION.map((item, i) => (
              <div
                key={item.ours}
                className="animate-course-set flex flex-col gap-3 border-t border-line py-8 md:flex-row md:gap-12"
              >
                <p
                  data-figure
                  className="text-datum uppercase text-ink-secondary md:w-16 md:shrink-0"
                >
                  {String(i + 1).padStart(2, "0")}
                </p>
                {/* Sentence case, not uppercase. These are full sentences with
                    subordinate clauses; at 60 characters of uppercase extrabold
                    they were the hardest reading on the site. Uppercase stays
                    for phrases, not for prose. */}
                <p className="max-w-[52ch] text-h1 text-ink">{item.ours}</p>
              </div>
            ))}
          </div>
        </Wall>
      </section>

      {/* The people */}
      <section className="border-t border-line py-[var(--section)]">
        <Wall>
          <CourseRule label="The people" />

          <Course className="mt-12 gap-y-8">
            <Stretcher span="half">
              <h2 className="text-h1 uppercase text-ink">Who you will be dealing with.</h2>
              <p className="mt-6 text-body text-ink-secondary">
                For a company with no trading history this matters more than it would for an
                established one. You should know whose name is on the quote, who runs the plant and
                who answers the phone when a load is late.
              </p>
              <div className="mt-6">
                <Pending>Team names, roles and photographs</Pending>
              </div>
            </Stretcher>

            <Stretcher span="quarter">
              <dl className="flex flex-col">
                <div className="flex items-baseline justify-between gap-4 border-t border-line-strong py-3">
                  <dt className="text-datum uppercase text-ink-secondary">Registration</dt>
                  <dd>
                    <Pending>Reg number</Pending>
                  </dd>
                </div>
                <div className="flex items-baseline justify-between gap-4 border-t border-line py-3">
                  <dt className="text-datum uppercase text-ink-secondary">VAT</dt>
                  <dd>
                    <Pending>VAT number</Pending>
                  </dd>
                </div>
                <div className="flex items-baseline justify-between gap-4 border-t border-line py-3">
                  <dt className="text-datum uppercase text-ink-secondary">Region</dt>
                  <dd className="text-h3 text-ink">{COMPANY.address.province.value}</dd>
                </div>
              </dl>
            </Stretcher>
          </Course>
        </Wall>
      </section>

      <QuoteCta />
    </>
  );
}
