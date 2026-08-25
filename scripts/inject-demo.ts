import Database from "better-sqlite3";
import path from "path";
const db = new Database(path.resolve("data/ledger.db"));
// Simulate new failures for demo: inject 3 new unpaid invoices
const now = new Date().toISOString();
db.prepare("INSERT OR IGNORE INTO invoices (id, stripe_pi, user_id, amount_cents, status, created_at) VALUES (?,?,?,?,?,?)")
  .run("in_demo1", "pi_demo1", "cus_001", 12900, "unpaid", now);
console.log("Injected demo failures: pi_demo1 $129");
console.log("Run: POST /simulate/failures or use Stripe MCP to list");
db.close();
