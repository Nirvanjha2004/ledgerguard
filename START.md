# Start LedgerGuard in 60 seconds

```bash
# 1. Clone
git clone https://github.com/Nirvanjha2004/ledgerguard && cd ledgerguard

# 2. Env
cp .env.example .env
# edit .env: STRIPE_SECRET_KEY=sk_test_..., DATABASE_URL=file:./data/ledger.db, OPENROUTER_API_KEY=sk-or-v1-...

# 3. Seed ledger
npm install
npm run seed  # 12 invoices $3,240 at risk

# 4. Start TrueForge harness (local)
npx @truefoundry/trueforge
# Open http://localhost:3001 -> Import agent.json -> Connect Stripe/Postgres/Slack MCP

# 5. Start Ledger API
npm run dev  # http://localhost:3000/health

# 6. Trigger agent
# In TrueForge UI chat: "Investigate the payment-failures alert. $3,240 at risk."
# Watch: stripe.list -> postgres.query -> sandbox reconcile.py -> subagents x3 -> HOLDING FOR APPROVAL $1,840

# 7. Approve in UI -> agent calls stripe.refunds.create + postgres UPDATE + slack.postMessage
# Refresh browser -> session persists (SQLite WAL) — proof of harness sessions

# Hosted: docker compose up (Postgres+Redis, 3 replicas)
```

Demo video: `docs/demo.mp4` (3 mins)

