"use server";

import { redirect } from "next/navigation";
import { z } from "zod";

import { COMPANY } from "@/data/company";
import { PRODUCTS } from "@/data/products";
import { reference } from "@/lib/response-time";

/**
 * Quote enquiries.
 *
 * Order of operations matters: record the lead first, notify second. An email
 * provider outage must never lose an enquiry, and for a business with no other
 * pipeline a lost enquiry is the most expensive bug on the site.
 *
 * Without RESEND_API_KEY the enquiry prints to the dev terminal, so the whole
 * flow is testable locally with no credentials.
 */

const SLUGS = PRODUCTS.map((p) => p.slug);

const schema = z.object({
  products: z.array(z.string()).min(1, "Choose at least one product"),
  quantity: z.string().max(60).optional(),
  quantityUnit: z.enum(["units", "square-metres", "pallets"]).optional(),
  fulfilment: z.enum(["deliver", "collect"]).default("deliver"),
  suburb: z.string().min(2, "Tell us the suburb or town so we can price delivery").max(120),
  needed: z.string().max(60).optional(),
  projectType: z.string().max(80).optional(),
  name: z.string().min(2, "Tell us who you are").max(120),
  mobile: z.string().min(9, "We need a number to reach you on").max(30),
  company: z.string().max(120).optional(),
  email: z.string().email("Check the email address").max(160).or(z.literal("")).optional(),
  contactPreference: z.enum(["whatsapp", "call", "email"]).default("whatsapp"),
  notes: z.string().max(2000).optional(),
  consent: z.literal("on", { message: "We need your permission to contact you" }),
});

export type EnquiryState = { errors?: Record<string, string>; values?: Record<string, string> };

export async function submitEnquiry(
  _prev: EnquiryState,
  formData: FormData,
): Promise<EnquiryState> {
  // Honeypot. A real person never fills a field they cannot see.
  if (formData.get("website")) {
    redirect("/quote/thank-you?ref=RFQ-0000-0000");
  }

  // Submission-time floor. Bots post instantly; people do not.
  const startedAt = Number(formData.get("startedAt") ?? 0);
  if (startedAt > 0 && Date.now() - startedAt < 2500) {
    return { errors: { form: "That was very quick. Give it a moment and try again." } };
  }

  const raw = {
    products: formData.getAll("products").map(String).filter((s) => SLUGS.includes(s) || s === "custom"),
    quantity: str(formData, "quantity"),
    quantityUnit: str(formData, "quantityUnit") || undefined,
    fulfilment: str(formData, "fulfilment") || "deliver",
    suburb: str(formData, "suburb"),
    needed: str(formData, "needed"),
    projectType: str(formData, "projectType"),
    name: str(formData, "name"),
    mobile: str(formData, "mobile"),
    company: str(formData, "company"),
    email: str(formData, "email"),
    contactPreference: str(formData, "contactPreference") || "whatsapp",
    notes: str(formData, "notes"),
    consent: str(formData, "consent"),
  };

  const parsed = schema.safeParse(raw);

  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? "form");
      errors[key] ??= issue.message;
    }
    return { errors, values: flatten(raw) };
  }

  const now = new Date();
  const ref = reference(now, Math.floor(now.getTime() / 1000));

  // 1. Record. Replace with durable storage before launch, see docs.
  const record = { ref, receivedAt: now.toISOString(), ...parsed.data };
  console.info("[enquiry]", JSON.stringify(record, null, 2));

  // 2. Notify.
  await notify(record);

  redirect(`/quote/thank-you?ref=${encodeURIComponent(ref)}`);
}

function str(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function flatten(raw: Record<string, unknown>): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [key, value] of Object.entries(raw)) {
    if (Array.isArray(value)) out[key] = value.join(",");
    else if (typeof value === "string") out[key] = value;
  }
  return out;
}

async function notify(record: Record<string, unknown> & { ref: string }) {
  const key = process.env.RESEND_API_KEY;
  const to = process.env.ENQUIRY_TO ?? COMPANY.email.value;

  if (!key || !to) {
    console.warn(
      `[enquiry] ${record.ref} not emailed: set RESEND_API_KEY and ENQUIRY_TO to deliver enquiries.`,
    );
    return;
  }

  try {
    const { Resend } = await import("resend");
    const resend = new Resend(key);

    await resend.emails.send({
      from: process.env.ENQUIRY_FROM ?? "Stonecrete Bricks <quotes@stonecretebricks.co.za>",
      to,
      subject: `${record.ref}: quote request from ${String(record.name)}`,
      text: asText(record),
      replyTo: typeof record.email === "string" && record.email ? record.email : undefined,
    });
  } catch (error) {
    // Swallow, never fail the submit: the enquiry is already recorded above.
    console.error("[enquiry] email failed", record.ref, error);
  }
}

function asText(record: Record<string, unknown>): string {
  return Object.entries(record)
    .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(", ") : String(value)}`)
    .join("\n");
}
