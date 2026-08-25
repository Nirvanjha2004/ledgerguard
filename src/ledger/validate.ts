import { sanitizeStripeMetadata } from "../src/ledger/guardrails";
// Qodo flagged: missing validation on amount_cents NaN and unsanitized metadata
export function validateRefund(payload: any) {
  if (!payload.stripe_pi || typeof payload.amount_cents !== "number" || isNaN(payload.amount_cents)) {
    throw new Error("Invalid amount_cents");
  }
  const clean = sanitizeStripeMetadata(payload);
  if (payload.amount_cents > 100000) throw new Error("Amount exceeds $1000 cap without per-row approval");
  return clean;
}
