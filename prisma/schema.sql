-- LedgerGuard Postgres variant (hosted mode)
-- SQLite seed uses better-sqlite3; this is for Postgres+Redis scale

CREATE TABLE IF NOT EXISTS customers (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL,
  plan TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS invoices (
  id TEXT PRIMARY KEY,
  stripe_pi TEXT UNIQUE NOT NULL,
  user_id TEXT NOT NULL,
  amount_cents INTEGER NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('"'"'paid'"'"','"'"'unpaid'"'"','"'"'refunded'"'"','"'"'failed'"'"')),
  created_at TIMESTAMPTZ NOT NULL
);
CREATE TABLE IF NOT EXISTS recovery_logs (
  id TEXT PRIMARY KEY,
  stripe_pi TEXT NOT NULL,
  action TEXT NOT NULL,
  amount_cents INTEGER NOT NULL,
  approved_by TEXT,
  idempotency_key TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices(status);
CREATE INDEX IF NOT EXISTS idx_recovery_pi ON recovery_logs(stripe_pi);
