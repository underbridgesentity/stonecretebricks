import type { Metadata } from "next";

import { PageHead } from "@/components/sections/page-head";
import { Section, Split, Wall } from "@/components/ui/wall";
import { addressLine, COMPANY } from "@/data/company";

export const metadata: Metadata = {
  title: "Privacy notice",
  description:
    "How Stonecrete Bricks collects, uses and protects your personal information under the Protection of Personal Information Act.",
  alternates: { canonical: "/privacy" },
};

/**
 * Required, not optional.
 *
 * The quote form's consent checkbox says "as set out in the privacy notice",
 * and POPIA section 11 consent is only valid if it is informed. Consenting to
 * a document that does not exist is not consent. Section 18 also requires that
 * a data subject be told, at the point of collection, what is being collected,
 * why, by whom, and what their rights are.
 *
 * Everything below describes what the code actually does. If the enquiry
 * pipeline changes, this page changes with it.
 */

const SECTIONS = [
  {
    heading: "Who is responsible",
    body: [
      `Stonecrete Bricks is the responsible party for the personal information described here. We manufacture concrete bricks, blocks and pavers in ${COMPANY.suburb.value}, ${COMPANY.region.value}.`,
      "If you have a question about your information, or you want to see it, correct it or have it deleted, contact us using the details at the end of this page. We will respond within a reasonable period.",
    ],
  },
  {
    heading: "What we collect, and when",
    body: [
      "We only collect what you give us. Nothing on this website tracks you, and we do not use analytics, advertising or third party cookies.",
      "When you send a quote request we collect your name and mobile number, which are required, and your company name, email address and any notes you choose to add, which are not. We also collect the details of the enquiry itself: the products you are interested in, the quantity, the delivery suburb, the date you need it and the type of project.",
      "When you contact us on WhatsApp, by phone or by email, we hold whatever you send us in that conversation.",
    ],
  },
  {
    heading: "Why we collect it",
    body: [
      "To prepare and send you a quotation, to arrange delivery, and to answer your enquiry. That is the only purpose.",
      "We do not sell your information, we do not share it with anyone for marketing, and we do not add you to a mailing list because you asked for a price.",
    ],
  },
  {
    heading: "Who else sees it",
    body: [
      "Your enquiry is delivered to us by email through Resend, an email service provider, and this website is hosted by Vercel. Both process the information on our behalf and under our instruction.",
      "We will disclose information if the law requires it, and not otherwise.",
    ],
  },
  {
    heading: "How long we keep it",
    body: [
      "We keep quote requests for as long as we need them to serve you and to meet our record keeping obligations, and then we delete them. If you ask us to delete your details sooner and we are not legally required to keep them, we will.",
    ],
  },
  {
    heading: "Your rights",
    body: [
      "Under the Protection of Personal Information Act you may ask what personal information we hold about you, ask us to correct anything that is wrong, ask us to delete it, object to how we are using it, and complain to the Information Regulator.",
      "The Information Regulator can be reached at inforeg@justice.gov.za.",
    ],
  },
  {
    heading: "Security",
    body: [
      "Enquiries are transmitted over an encrypted connection and are accessible only to the people at Stonecrete Bricks who need them to prepare your quotation.",
    ],
  },
];

export default function PrivacyPage() {
  const address = addressLine();

  return (
    <>
      <PageHead
        eyebrow="Privacy"
        title="How we handle your information."
        lead="Plainly, and in as few words as the law allows. We collect what you send us on the quote form, we use it to quote and deliver, and we do not do anything else with it."
      />

      {SECTIONS.map((section) => (
        <Section key={section.heading} divider>
          <Wall>
            <Split label={section.heading}>
              {section.body.map((paragraph) => (
                <p key={paragraph} className="mb-6 max-w-[49ch] text-body text-ink-secondary last:mb-0">
                  {paragraph}
                </p>
              ))}
            </Split>
          </Wall>
        </Section>
      ))}

      <Section divider>
        <Wall>
          <Split label="Contact us">
            <p className="max-w-[49ch] text-body text-ink-secondary">
              Stonecrete Bricks
              <br />
              {address ? (
                <>
                  {address}
                  <br />
                </>
              ) : null}
              {COMPANY.phone.value}
              <br />
              <a href={`mailto:${COMPANY.email.value}`} className="text-ink underline underline-offset-4">
                {COMPANY.email.value}
              </a>
            </p>
          </Split>
        </Wall>
      </Section>
    </>
  );
}
