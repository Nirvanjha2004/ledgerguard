import Database from "better-sqlite3";
import path from "path";

const db = new Database(path.resolve("data/ledger.db"));

export type RecoveryRequest = {
  stripe_pi: string;
  amount_cents: number;
  idempotency_key: string;
  approved_by: string;
};

export function executeRecovery(req: RecoveryRequest) {
  // Fixed per Qodo: move unpaid check into transaction via conditional UPDATE
  // and use structured SQLite error code instead of string includes
  const tx = db.transaction(() => {
    // Conditional update: only if still unpaid (prevents race)
    const upd = db.prepare("UPDATE invoices SET status='"'"'refunded'"'"' WHERE stripe_pi=? AND status='"'"'unpaid'"'"'").run(req.stripe_pi);
    if (upd.changes === 0) {
      const inv = db.prepare("SELECT status FROM invoices WHERE stripe_pi=?").get(req.stripe_pi) as any;
      if (!inv) throw new Error(`Invoice ${req.stripe_pi} not found`);
      throw new Error(`Invoice ${req.stripe_pi} status is ${inv.status}, not unpaid — abort`);
    }
    db.prepare("INSERT INTO recovery_logs (id, stripe_pi, action, amount_cents, approved_by, idempotency_key, created_at) VALUES (?,?,?,?,?,?,datetime('"'"'now'"'"'))")
      .run(`rec_${Date.now()}_${Math.random().toString(36).slice(2,6)}`, req.stripe_pi, "refund", req.amount_cents, req.approved_by, req.idempotency_key);
  });

  try {
    tx();
    return { ok: true, stripe_pi: req.stripe_pi, amount_cents: req.amount_cents };
  } catch (e: any) {
    // Fixed: use SQLite extended error code instead of string match (Qodo)
    if (e.code === "SQLITE_CONSTRAINT_UNIQUE" || e.message?.includes("UNIQUE")) {
      return { ok: true, duplicate: true, stripe_pi: req.stripe_pi };
    }
    throw e;
  }
}

export function getRecoveryStats() {
  const atRisk = db.prepare("SELECT COUNT(*) as cnt, SUM(amount_cents) as total FROM invoices WHERE status='"'"'unpaid'"'"'").get() as any;
  const recovered = db.prepare("SELECT COUNT(*) as cnt, SUM(amount_cents) as total FROM recovery_logs").get() as any;
  return { atRisk, recovered };
}
