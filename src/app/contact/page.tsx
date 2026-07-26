import type { Metadata } from "next";

import { PageHead } from "@/components/sections/page-head";
import { CourseRule } from "@/components/ui/course-rule";
import { Mail, Phone, Pin, Whatsapp } from "@/components/ui/glyph";
import { Module } from "@/components/ui/module";
import { Pending } from "@/components/ui/pending";
import { Course, Stretcher, Wall } from "@/components/ui/wall";
import { addressLine, COMPANY, telLink, whatsappLink } from "@/data/company";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Talk to Stonecrete Bricks. WhatsApp, phone, email or come to the yard. Trading hours include Saturday morning.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  const tel = telLink();
  const wa = whatsappLink("Hi Stonecrete Bricks, I have a question about your products.");
  const address = addressLine();
  const hours = COMPANY.hours.value ?? [];

  return (
    <>
      <PageHead
        eyebrow="Contact"
        title="Talk to us."
        lead="We answer WhatsApp fastest. For a formal quotation use the quote form instead, so we get the quantities right first time."
      />

      {/* Channels */}
      <section className="border-t border-line py-[var(--section)]">
        <Wall>
          <CourseRule label="How to reach us" />

          <div className="mt-12 grid grid-cols-1 gap-[var(--joint)] md:grid-cols-2 lg:grid-cols-4">
            <Channel
              icon={<Whatsapp width={22} height={22} />}
              label="WhatsApp"
              value={COMPANY.phone.value}
              href={wa}
              pendingLabel="WhatsApp number"
              note="Fastest answer"
            />
            <Channel
              icon={<Phone width={22} height={22} />}
              label="Phone"
              value={COMPANY.phone.value}
              href={tel}
              pendingLabel="Phone number"
              note="During trading hours"
            />
            <Channel
              icon={<Mail width={22} height={22} />}
              label="Email"
              value={COMPANY.email.value}
              href={`mailto:${COMPANY.email.value}`}
              pendingLabel="Email address"
              note="For documents and orders"
            />
            <Channel
              icon={<Pin width={22} height={22} />}
              label="The yard"
              value={address}
              pendingLabel="Yard address"
              note="Collections welcome"
            />
          </div>
        </Wall>
      </section>

      {/* Hours */}
      <section data-ground="graphite" className="bg-graphite py-[var(--section)]">
        <Wall>
          <CourseRule label="Trading hours" tone="oxide" />

          <Course className="mt-12 gap-y-10">
            <Stretcher span="measure">
              <h2 className="text-display uppercase text-ink">Open on Saturday.</h2>
              <p className="mt-6 max-w-[45ch] text-body text-ink-secondary">
                Trade buys on a Saturday morning, so the yard is open for collections. Deliveries
                run on weekdays.
              </p>
            </Stretcher>

            <Stretcher span="complement">
              <dl className="flex flex-col">
                {hours.map((row) => (
                  <div
                    key={row.days}
                    className="flex items-baseline justify-between gap-4 border-b border-line py-4"
                  >
                    <dt className="text-body text-ink-secondary">{row.days}</dt>
                    <dd className="text-h3 text-ink" data-figure>
                      {row.opens && row.closes ? `${row.opens} to ${row.closes}` : "Closed"}
                    </dd>
                  </div>
                ))}
              </dl>
            </Stretcher>
          </Course>
        </Wall>
      </section>

      {/* Directions */}
      <section className="border-t border-line py-[var(--section)]">
        <Wall>
          <CourseRule label="Finding us" />

          <Course className="mt-12 gap-y-8">
            <Stretcher span="half">
              <h2 className="text-h1 uppercase text-ink">Directions, including for a truck.</h2>
              <p className="mt-6 text-body text-ink-secondary">
                Delivery vehicles and visitors use separate gates. If you are collecting with a
                trailer or a bakkie, come to the visitors&rsquo; gate and someone will direct you to the
                loading area.
              </p>
              <div className="mt-6">
                <Pending>Map, pin and gate directions</Pending>
              </div>
            </Stretcher>
          </Course>
        </Wall>
      </section>
    </>
  );
}

function Channel({
  icon,
  label,
  value,
  href,
  pendingLabel,
  note,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | null;
  href?: string | null;
  pendingLabel: string;
  note: string;
}) {
  const body = (
    <>
      <span className="text-ink-accent">{icon}</span>
      <span className="mt-4 block text-datum uppercase text-ink-secondary">{label}</span>
      {value ? (
        <span className="mt-2 block text-h3 text-ink">{value}</span>
      ) : (
        <span className="mt-2 block">
          <Pending>{pendingLabel}</Pending>
        </span>
      )}
      <span className="mt-auto block pt-4 text-small text-ink-secondary">{note}</span>
    </>
  );

  if (href && value) {
    return (
      <Module extrude reveal className="flex h-full flex-col p-6 md:p-8">
        <a href={href} className="flex h-full flex-col">
          {body}
        </a>
      </Module>
    );
  }

  return (
    <Module reveal className="flex h-full flex-col p-6 md:p-8">
      {body}
    </Module>
  );
}
