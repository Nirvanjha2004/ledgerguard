import express from "express";
import crypto from "crypto";
import { stripe } from "../mcp/stripeMock";

const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || "whsec_test";

export function verifyStripeSignature(rawBody: string, signatureHeader: string, secret: string): boolean {
  if (!signatureHeader || !secret) return false;
  try {
    const parts = signatureHeader.split(",");
    const tPart = parts.find(p => p.startsWith("t="));
    const v1Part = parts.find(p => p.startsWith("v1="));
    if (!tPart || !v1Part) {
      const expected = crypto.createHmac("sha256", secret).update(rawBody).digest("hex");
      return crypto.timingSafeEqual(Buffer.from(signatureHeader), Buffer.from(expected));
    }
    const timestamp = parseInt(tPart.slice(2), 10);
    if (Math.abs(Date.now()/1000 - timestamp) > 300) return false;
    const signedPayload = `${timestamp}.${rawBody}`;
    const expected = crypto.createHmac("sha256", secret).update(signedPayload).digest("hex");
    const v1Sig = v1Part.slice(3);
    return crypto.timingSafeEqual(Buffer.from(v1Sig), Buffer.from(expected));
  } catch {
    return false;
  }
}

// Fixed per Qodo High: use TTL + size cap instead of unbounded Set (was DoS risk)
// In prod: use DB UNIQUE on event_id with 24h retention
const seenEvents = new Map<string, number>();
const MAX_SEEN = 10000;
const TTL_MS = 24 * 60 * 60 * 1000;
export function isDuplicateEvent(eventId: string): boolean {
  const now = Date.now();
  // GC expired
  for (const [k, ts] of seenEvents) if (now - ts > TTL_MS) seenEvents.delete(k);
  if (seenEvents.has(eventId)) return true;
  // Size cap: evict oldest if over limit (Qodo flagged unbounded growth)
  if (seenEvents.size >= MAX_SEEN) {
    const oldest = seenEvents.keys().next().value;
    if (oldest) seenEvents.delete(oldest);
  }
  seenEvents.set(eventId, now);
  return false;
}

export function parseStripeEvent(body: any) {
  if (!body || !body.type) throw new Error("Invalid event");
  if (body.id && isDuplicateEvent(body.id)) {
    return { ignored: true, reason: "duplicate event.id" };
  }
  if (body.type !== "payment_intent.payment_failed") {
    return { ignored: true, reason: `unsupported type ${body.type}` };
  }
  const pi = body.data?.object;
  if (!pi || !pi.id) throw new Error("Missing payment_intent id");
  return {
    stripe_pi: pi.id,
    amount: pi.amount,
    error: pi.last_payment_error?.code || "unknown",
    sanitized: {
      id: pi.id,
      amount: pi.amount,
      last_payment_error: pi.last_payment_error,
    },
  };
}

export const webhookRouter = express.Router();
webhookRouter.post("/webhooks/stripe", express.raw({ type: "application/json" }), (req, res) => {
  const sig = req.headers["stripe-signature"] as string;
  const raw = (req as any).body?.toString() || JSON.stringify(req.body);
  
  if (!verifyStripeSignature(raw, sig, STRIPE_WEBHOOK_SECRET)) {
    return res.status(400).json({ error: "Invalid signature" });
  }

  try {
    const parsed = parseStripeEvent(JSON.parse(raw));
    if ((parsed as any).ignored) {
      return res.json({ ok: true, ignored: true });
    }
    res.json({ ok: true, queued: parsed });
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
});
