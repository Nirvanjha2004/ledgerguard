import { z } from "zod";

export const ApprovalSchema = z.object({
  stripe_pi: z.string(),
  amount_cents: z.number(),
  idempotency_key: z.string(),
  reason: z.string(),
});

export function sanitizeStripeMetadata(pi: any) {
  // Allowlist only email, amount, reason - strip prompt injection
  const allowed = ["id","amount","last_payment_error"];
  const out: any = {};
  for (const k of allowed) if (k in pi) out[k] = pi[k];
  return out;
}

export function buildIdempotencyKey(pi: string, amount: number) {
  return `${pi}_refund_${amount}`;
}
