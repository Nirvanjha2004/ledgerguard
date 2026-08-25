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
  // Guardrail: verify ledger is unpaid before refund (deterministic)
  const invoice = db.prepare("SELECT status FROM invoices WHERE stripe_pi=?").get(req.stripe_pi) as any;
  if (!invoice) throw new Error(`Invoice ${req.stripe_pi} not found`);
  if (invoice.status !== "unpaid") throw new Error(`Invoice ${req.stripe_pi} status is ${invoice.status}, not unpaid — abort`);

  // Idempotent insert + update in transaction
  const tx = db.transaction(() => {
    db.prepare("INSERT INTO recovery_logs (id, stripe_pi, action, amount_cents, approved_by, idempotency_key, created_at) VALUES (?,?,?,?,?,?,datetime('"'"'now'"'"'))")
      .run(`rec_${Date.now()}_${Math.random().toString(36).slice(2,6)}`, req.stripe_pi, "refund", req.amount_cents, req.approved_by, req.idempotency_key);
    db.prepare("UPDATE invoices SET status='"'"'refunded'"'"' WHERE stripe_pi=?").run(req.stripe_pi);
  });

  try {
    tx();
    return { ok: true, stripe_pi: req.stripe_pi, amount_cents: req.amount_cents };
  } catch (e: any) {
    if (e.message.includes("UNIQUE")) {
      // Idempotency: already processed, return existing
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
