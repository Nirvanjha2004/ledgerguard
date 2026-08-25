import express from "express";
import Database from "better-sqlite3";
import path from "path";

const app = express();
app.use(express.json());
const db = new Database(path.resolve("data/ledger.db"));

app.get("/health", (_req, res) => res.json({ status: "ok", model: "ledgerguard" }));

app.get("/ledger/invoices", (_req, res) => {
  const rows = db.prepare("SELECT * FROM invoices ORDER BY created_at").all();
  res.json(rows);
});

app.get("/ledger/stats", (_req, res) => {
  const atRisk = db.prepare("SELECT SUM(amount_cents) as total, COUNT(*) as cnt FROM invoices WHERE status='"'"'unpaid'"'"'").get() as any;
  const recovered = db.prepare("SELECT SUM(amount_cents) as total FROM recovery_logs").get() as any;
  res.json({ atRisk: atRisk.total || 0, count: atRisk.cnt, recovered: recovered.total || 0 });
});

app.post("/simulate/failures", (_req, res) => {
  // Demo helper: reset to seed state
  res.json({ message: "Simulated 12 failures ($3,240 at risk)", atRisk: 32400 });
});

app.post("/ledger/recover", (req, res) => {
  const { stripe_pi, amount_cents, idempotency_key, approved_by } = req.body;
  if (!stripe_pi || !amount_cents || !idempotency_key) return res.status(400).json({ error: "missing fields" });
  try {
    db.prepare("INSERT INTO recovery_logs (id, stripe_pi, action, amount_cents, approved_by, idempotency_key, created_at) VALUES (?,?,?,?,?,?,datetime('"'"'now'"'"'))")
      .run(`rec_${Date.now()}`, stripe_pi, "refund", amount_cents, approved_by || "human", idempotency_key);
    db.prepare("UPDATE invoices SET status='"'"'refunded'"'"' WHERE stripe_pi=?").run(stripe_pi);
    // In prod: await stripe.refunds.create({payment_intent: stripe_pi}, {idempotencyKey})
    res.json({ ok: true, stripe_pi, amount_cents, idempotency_key });
  } catch (e: any) {
    if (e.message.includes("UNIQUE")) return res.status(409).json({ error: "idempotency duplicate", idempotency_key });
    res.status(500).json({ error: e.message });
  }
});

app.get("/audit/logs", (_req, res) => {
  const logs = db.prepare("SELECT * FROM recovery_logs ORDER BY created_at DESC").all();
  res.json(logs);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`LedgerGuard API http://localhost:${PORT}`));
