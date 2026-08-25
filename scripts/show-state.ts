import Database from "better-sqlite3";
import path from "path";
const db = new Database(path.resolve("data/ledger.db"));
const rows = db.prepare("SELECT status, COUNT(*) as cnt, SUM(amount_cents) as total FROM invoices GROUP BY status").all();
console.log("Ledger state:", rows);
const logs = db.prepare("SELECT * FROM recovery_logs ORDER BY created_at DESC LIMIT 5").all();
console.log("Recent recovery_logs:", logs);
db.close();
