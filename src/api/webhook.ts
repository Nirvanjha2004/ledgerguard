import express from "express";
import crypto from "crypto";

// Webhook handler for Stripe payment_intent.payment_failed
// TrueForge will call this via Stripe MCP webhook forwarding
// Must be idempotent and verify signature

const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || "whsec_test";

export function verifyStripeSignature(rawBody: string, signature: string, secret: string): boolean {
  if (!signature || !secret) return false;
  const expected = crypto.createHmac("sha256", secret).update(rawBody).digest("hex");
  // Use timingSafeEqual to prevent timing attacks - Qodo flagged this in PR #1 follow-up
  try {
    return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
  } catch {
    return false;
  }
}

export function parseStripeEvent(body: any) {
  // Allowlist sanitization - strip prompt injection from metadata
  if (!body || !body.type) throw new Error("Invalid event");
  if (body.type !== "payment_intent.payment_failed") {
    return { ignored: true, reason: `unsupported type ${body.type}` };
  }
  const pi = body.data?.object;
  if (!pi || !pi.id) throw new Error("Missing payment_intent id");
  // Only allow known fields
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
    // Queue for TrueForge agent via MCP - do not auto-refund, require approval
    // In prod: push to Postgres recovery_queue, agent picks up via MCP
    res.json({ ok: true, queued: parsed });
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
});
