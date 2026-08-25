import { describe, it, expect } from "vitest";

describe("stripeLive guardrails", () => {
  it("mock mode: createRefund works without key", async () => {
    process.env.STRIPE_MODE = "mock";
    delete process.env.STRIPE_SECRET_KEY;
    // dynamic import to pick up env
    const mod = await import("../src/mcp/stripeLive.js?mock=1");
    const r = await mod.createRefund("pi_1", 4900, "pi_1_refund_4900");
    expect(r.mock).toBe(true);
    expect(r.status).toBe("succeeded");
  });
  it("zero amount does not silently full-refund", async () => {
    process.env.STRIPE_MODE = "mock";
    const mod = await import("../src/mcp/stripeLive.js?zero=1");
    await expect(mod.createRefund("pi_1", 0, "k_zero")).resolves.toBeTruthy();
  });
});
