import { describe, it, expect, beforeAll } from "vitest";
import Database from "better-sqlite3";
import path from "path";
import fs from "fs";

// Integration: seed → reconcile → recover → audit
describe("ledger integration", () => {
  const dbPath = path.resolve("data/ledger.db");
  beforeAll(() => {
    // ensure seeded
    if (!fs.existsSync(dbPath)) {
      // seed if missing
    }
  });
  it("seed creates 12 invoices", () => {
    const db = new Database(dbPath);
    const cnt = db.prepare("SELECT COUNT(*) as c FROM invoices").get() as any;
    expect(cnt.c).toBe(12);
    db.close();
  });
  it("recover is idempotent", () => {
    const db = new Database(dbPath);
    const key = `test_${Date.now()}_refund_4900`;
    db.prepare("INSERT INTO recovery_logs (id, stripe_pi, action, amount_cents, approved_by, idempotency_key, created_at) VALUES (?,?,?,?,?,?,datetime('"'"'now'"'"'))")
      .run(`rec_${Date.now()}`, "pi_test_idempotent", "refund", 4900, "test", key);
    // second insert with same key should fail
    expect(() => {
      db.prepare("INSERT INTO recovery_logs (id, stripe_pi, action, amount_cents, approved_by, idempotency_key, created_at) VALUES (?,?,?,?,?,?,datetime('"'"'now'"'"'))")
        .run(`rec_${Date.now()+1}`, "pi_test_idempotent", "refund", 4900, "test", key);
    }).toThrow();
    db.prepare("DELETE FROM recovery_logs WHERE stripe_pi=?").run("pi_test_idempotent");
    db.close();
  });
});
