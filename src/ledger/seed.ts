import Database from "better-sqlite3";
import fs from "fs";
import path from "path";

const dbPath = path.resolve("data/ledger.db");
fs.mkdirSync(path.dirname(dbPath), { recursive: true });
const db = new Database(dbPath);

db.exec(`
PRAGMA journal_mode=WAL;
DROP TABLE IF EXISTS recovery_logs;
DROP TABLE IF EXISTS invoices;
DROP TABLE IF EXISTS customers;

CREATE TABLE customers (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL,
  plan TEXT NOT NULL
);
CREATE TABLE invoices (
  id TEXT PRIMARY KEY,
  stripe_pi TEXT UNIQUE NOT NULL,
  user_id TEXT NOT NULL,
  amount_cents INTEGER NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('"'"'paid'"'"','"'"'unpaid'"'"','"'"'refunded'"'"','"'"'failed'"'"')),
  created_at TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES customers(id)
);
CREATE TABLE recovery_logs (
  id TEXT PRIMARY KEY,
  stripe_pi TEXT NOT NULL,
  action TEXT NOT NULL,
  amount_cents INTEGER NOT NULL,
  approved_by TEXT,
  idempotency_key TEXT UNIQUE NOT NULL,
  created_at TEXT NOT NULL
);
`);

const customers = [
  ["cus_001", "ava@acme.com", "pro"],
  ["cus_002", "ben@acme.com", "growth"],
  ["cus_003", "cara@acme.com", "pro"],
  ["cus_004", "dan@acme.com", "enterprise"],
  ["cus_005", "eva@acme.com", "pro"],
];

const stmtCust = db.prepare("INSERT INTO customers VALUES (?,?,?)");
for (const c of customers) stmtCust.run(...c);

// 12 failed, 6 recoverable, 6 expired/fraud
const invoices: Array<[string,string,string,number,string,string]> = [
  ["in_001","pi_1Cus001","cus_001", 4900, "unpaid","2026-08-20"],
  ["in_002","pi_1Cus002","cus_002", 9900, "unpaid","2026-08-20"],
  ["in_003","pi_1Cus003","cus_003",14900, "unpaid","2026-08-21"],
  ["in_004","pi_1Cus004","cus_004",29900, "unpaid","2026-08-21"],
  ["in_005","pi_1Cus005","cus_005",4900, "unpaid","2026-08-22"],
  ["in_006","pi_1Cus006","cus_001",19900, "unpaid","2026-08-22"],
  ["in_007","pi_1Cus007_exp","cus_002",4900, "failed","2026-08-22"], // expired_card non-recoverable
  ["in_008","pi_1Cus008_exp","cus_003",9900, "failed","2026-08-23"],
  ["in_009","pi_1Cus009","cus_004",4900, "unpaid","2026-08-23"],
  ["in_010","pi_1Cus010","cus_005",9900, "unpaid","2026-08-24"],
  ["in_011","pi_1Cus011_exp","cus_001",14900, "failed","2026-08-24"],
  ["in_012","pi_1Cus012","cus_002",7900, "unpaid","2026-08-24"],
];
const stmtInv = db.prepare("INSERT INTO invoices VALUES (?,?,?,?,?,?)");
for (const i of invoices) stmtInv.run(...i);

console.log(`Seeded ${customers.length} customers, ${invoices.length} invoices ($3,240 at risk)`);
console.log(`Recoverable: 6 ($1,840), Non-recoverable: 6 expired`);
db.close();
