import Stripe from "stripe";

// Live Stripe wiring via TrueForge MCP OAuth
// Agent uses MCP: stripe.paymentIntents.list + stripe.refunds.create
// This is the local fallback when MCP not available (for tests)

const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY) : null;

export async function listFailedIntents(limit = 20) {
  if (!stripe) {
    // Mock for demo without real keys — uses src/mcp/stripeMock.ts
    const { STRIPE_MOCK } = await import("./stripeMock.js");
    return STRIPE_MOCK.data;
  }
  // Live: Stripe MCP handles OAuth, this is direct fallback
  const intents = await stripe.paymentIntents.list({ limit });
  return intents.data.filter(pi => pi.status === "requires_payment_method" && pi.last_payment_error);
}

export async function createRefund(paymentIntent: string, amount?: number, idempotencyKey?: string) {
  if (!stripe) throw new Error("STRIPE_SECRET_KEY missing — use MCP or set env");
  // Qodo flagged missing idempotency - fixed with explicit key
  return stripe.refunds.create(
    { payment_intent: paymentIntent, amount },
    { idempotencyKey: idempotencyKey || `${paymentIntent}_refund_${amount}` }
  );
}

export function getStripeMode() {
  return process.env.STRIPE_SECRET_KEY?.startsWith("sk_live") ? "live" : process.env.STRIPE_SECRET_KEY ? "test" : "mock";
}
