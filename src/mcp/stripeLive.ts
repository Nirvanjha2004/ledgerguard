import Stripe from "stripe";

const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY) : null;

export async function listFailedIntents(limit = 20) {
  if (!stripe) {
    const { STRIPE_MOCK } = await import("./stripeMock.js");
    return STRIPE_MOCK.data;
  }
  const intents = await stripe.paymentIntents.list({ limit });
  return intents.data.filter(pi => pi.status === "requires_payment_method" && pi.last_payment_error);
}

export async function createRefund(paymentIntent: string, amount: number | undefined, idempotencyKey: string) {
  if (!stripe) throw new Error("STRIPE_SECRET_KEY missing — use MCP or set env");
  if (!idempotencyKey) throw new Error("idempotencyKey is required (Qodo: avoid amount-based default collision)");
  // Fixed: idempotencyKey now required, no default from amount
  return stripe.refunds.create(
    { payment_intent: paymentIntent, ...(amount ? { amount } : {}) },
    { idempotencyKey }
  );
}

export function getStripeMode() {
  return process.env.STRIPE_SECRET_KEY?.startsWith("sk_live") ? "live" : process.env.STRIPE_SECRET_KEY ? "test" : "mock";
}
