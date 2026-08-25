import { describe, it, expect } from "vitest";
import { executeRecovery, getRecoveryStats } from "../src/ledger/recoveryService";
import Database from "better-sqlite3";
import path from "path";

describe("recoveryService", () => {
  it("guardrail blocks refund if not unpaid", () => {
    expect(() => executeRecovery({ stripe_pi: "pi_1Cus007_exp", amount_cents: 4900, idempotency_key: "test_"+Date.now(), approved_by: "test" })).toThrow(/not unpaid/);
  });
  it("stats returns atRisk and recovered", () => {
    const stats = getRecoveryStats();
    expect(stats.atRisk.cnt).toBeGreaterThan(0);
  });
});
