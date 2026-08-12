import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * Inbound email from Resend.
 *
 * Receiving is enabled on stonecretebricks.co.za, which means Resend now holds
 * the MX for the domain and every message sent to it arrives here as an
 * email.received webhook rather than in a mailbox. Anything this route drops
 * is a message a customer believes they sent to a human, so it is written to
 * fail loudly and never silently.
 *
 * WHY THERE IS NO svix DEPENDENCY.
 *
 * Resend signs webhooks with the Svix scheme, and the documented way to verify
 * is their SDK. This project runs on three runtime dependencies on purpose,
 * and the scheme is a single HMAC: sign "id.timestamp.body" with the secret,
 * base64 the digest, compare in constant time. Reimplementing that is fifteen
 * lines and no maintenance. Reimplementing a crypto library would be a
 * different matter, and this is not that.
 *
 * The signature check is not optional decoration. Without it this URL is a
 * public endpoint that will accept any JSON anybody posts to it, which for an
 * endpoint whose whole job is to record customer messages means anybody can
 * write into the record.
 */

/** Svix tolerates five minutes of clock drift, and so do we. */
const TOLERANCE_SECONDS = 5 * 60;

function verify(secret: string, id: string, timestamp: string, body: string, header: string) {
  const drift = Math.abs(Date.now() / 1000 - Number(timestamp));
  if (!Number.isFinite(drift) || drift > TOLERANCE_SECONDS) return false;

  // whsec_ prefix stripped, the rest is base64.
  const key = Buffer.from(secret.replace(/^whsec_/, ""), "base64");
  const expected = createHmac("sha256", key).update(`${id}.${timestamp}.${body}`).digest("base64");

  /*
   * The header carries space separated "v1,<signature>" pairs, because Svix
   * supports rotating secrets and sends the payload signed under each one. Any
   * single match is a pass.
   */
  return header.split(" ").some((part) => {
    const candidate = part.split(",")[1];
    if (!candidate) return false;
    const a = Buffer.from(candidate);
    const b = Buffer.from(expected);
    return a.length === b.length && timingSafeEqual(a, b);
  });
}

export async function POST(request: Request) {
  const secret = process.env.INBOUND_WEBHOOK_SECRET;

  if (!secret) {
    /*
     * Refuse rather than accept unverified. An endpoint that records customer
     * mail must not fall open when it is misconfigured, and 500 is honest: the
     * message was not handled, so Resend should retry rather than mark it
     * delivered.
     */
    console.error("[inbound] INBOUND_WEBHOOK_SECRET is unset, so this message could not be verified or recorded.");
    return new Response("Receiving is not configured", { status: 500 });
  }

  const id = request.headers.get("svix-id");
  const timestamp = request.headers.get("svix-timestamp");
  const signature = request.headers.get("svix-signature");
  // Read once, as text: the signature covers the exact bytes, so it cannot be
  // re-serialised from a parsed object without risking a mismatch.
  const body = await request.text();

  if (!id || !timestamp || !signature || !verify(secret, id, timestamp, body, signature)) {
    console.warn("[inbound] rejected an unsigned or badly signed request");
    return new Response("Bad signature", { status: 401 });
  }

  let event: { type?: string; data?: Record<string, unknown> };
  try {
    event = JSON.parse(body);
  } catch {
    console.error("[inbound] verified request whose body was not JSON:", body.slice(0, 400));
    return new Response("Bad payload", { status: 400 });
  }

  if (event.type !== "email.received") {
    // Other event types are fine, they are just not ours. 200 so Resend stops.
    return Response.json({ ok: true, ignored: event.type ?? "unknown" });
  }

  const mail = event.data ?? {};
  const received = {
    receivedAt: new Date().toISOString(),
    from: mail.from,
    to: mail.to,
    subject: mail.subject,
    // Bodies can be large and can contain personal information, so the record
    // keeps the routing facts and a short excerpt rather than the whole thing.
    excerpt: typeof mail.text === "string" ? mail.text.slice(0, 500) : undefined,
  };

  /*
   * STILL OUTSTANDING, and it is the same gap the quote form has: this writes
   * to the log, not to storage, and a log line ages out. Until the client
   * provisions somewhere durable, set INBOUND_FORWARD_TO to an address that
   * is NOT on stonecretebricks.co.za. Anything on that domain comes straight
   * back here, because Resend holds the MX now.
   */
  console.info("[inbound]", JSON.stringify(received, null, 2));

  await forward(body, received);

  return Response.json({ ok: true });
}

async function forward(raw: string, received: Record<string, unknown>) {
  const to = process.env.INBOUND_FORWARD_TO;
  const key = process.env.RESEND_API_KEY;
  if (!to || !key) return;

  if (to.toLowerCase().endsWith("@stonecretebricks.co.za")) {
    console.error(
      `[inbound] refusing to forward to ${to}: Resend holds the MX for that domain, so this would loop straight back into this endpoint.`,
    );
    return;
  }

  try {
    const { Resend } = await import("resend");
    await new Resend(key).emails.send({
      from: process.env.ENQUIRY_FROM ?? "Stonecrete Bricks <quotes@stonecretebricks.co.za>",
      to,
      subject: `Received: ${String(received.subject ?? "no subject")}`,
      text: `Forwarded by the website from ${String(received.from)}.\n\n${raw}`,
    });
  } catch (error) {
    // Never throw: the message is already in the log above, and a 500 here
    // would make Resend retry a delivery that already succeeded.
    console.error("[inbound] forward failed", error);
  }
}
