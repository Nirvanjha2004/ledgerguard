import Stripe from "stripe";

// Fixed per Qodo High: explicit mock detection (sk_test_mock or STRIPE_MODE=mock)
const MODE = process.env.STRIPE_MODE === "mock" || process.env.STRIPE_SECRET_KEY === "sk_test_mock"
  ? "mock"
  : process.env.STRIPE_SECRET_KEY?.startsWith("sk_live")
    ? "live"
    : process.env.STRIPE_SECRET_KEY ? "test" : "mock";

const stripe = (MODE === "test" || MODE === "live") && process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY)
  : null;

export async function listFailedIntents(limit = 20) {
  if (!stripe) {
    const { STRIPE_MOCK } = await import("./stripeMock.js");
    return STRIPE_MOCK.data;
  }
  const intents = await stripe.paymentIntents.list({ limit });
  return intents.data.filter(pi => pi.status === "requires_payment_method" && pi.last_payment_error);
}

export async function createRefund(paymentIntent: string, amount: number | undefined, idempotencyKey: string) {
  if (!idempotencyKey) throw new Error("idempotencyKey is required");
  // Fixed per Qodo Medium: consistent mock behavior — mock refunds work too
  if (!stripe) {
    return {
      id: `re_mock_${idempotencyKey}`,
      payment_intent: paymentIntent,
      amount: amount ?? null,
      status: "succeeded",
      mock: true,
      idempotencyKey,
    };
  }
  // Fixed per Qodo Medium: distinguish undefined from 0 (0-amount must not silently full-refund)
  const params: Stripe.RefundCreateParams = { payment_intent: paymentIntent };
  if (amount !== undefined) {
    if (typeof amount !== "number" || Number.isNaN(amount) || amount < 0) {
      throw new Error(`Invalid refund amount: ${amount}`);
    }
    params.amount = amount;
  }
  return stripe.refunds.create(params, { idempotencyKey });
}

export function getStripeMode() {
  return MODE; // "mock" | "test" | "live" — sk_test_mock now correctly returns mock
}
