## Quick Demo (Local)

1. `npm install && npm run seed` → creates SQLite ledger
2. `npx @truefoundry/trueforge` → open http://localhost:3001 → Import agent.json
3. Connect MCPs: Stripe (sk_test), Postgres (file:./data/ledger.db), Slack (optional)
4. Chat: "Investigate the payment-failures alert. $3,240 at risk."
5. Watch: stripe.list → postgres.query → sandbox reconcile.py → subagents x3 → HOLDING FOR APPROVAL $1,840
6. Click Approve → agent calls stripe.refunds.create + postgres UPDATE + slack.postMessage
7. Refresh browser → session persists (SQLite WAL) — proof of harness sessions

Hosted: `docker compose up` → Postgres+Redis, TrueForge scales to 3 replicas.
