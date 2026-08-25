# TrueForge Config

Model: ox-alpha via OpenRouter (`openrouter/stealth/ox-alpha`) — switchable to Claude/Gemini/DeepSeek via UI or agent.json
MCPs: Stripe (OAuth), Postgres (Supabase/Neon), Slack (webhook)
Sandbox: local, timeout 30s, runs reconcile.py only
Approvals: stripe.refunds.create + postgres UPDATE/INSERT (message: Licence required)
Subagents: max 3, per high-value customer research
Sessions: SQLite (local) / Postgres+Redis (hosted) — survives reconnect/restart
Skills: finance-refund-policy.md (loaded when amount > $500)

Run: `npx @truefoundry/trueforge` → Import `agent.json` → Connect MCPs
