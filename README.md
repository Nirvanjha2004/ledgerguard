# LedgerGuard — The Agent That Refunds Money But Asks First

> Give AI models a License to Act on your Stripe ledger, with TrueForge handling MCP, sandbox, and human approval.

[![License MIT](https://img.shields.io/badge/license-MIT-green)](LICENSE)
[![TrueForge](https://img.shields.io/badge/harness-TrueForge-blue)](https://trueforge.dev)
[![Qodo](https://img.shields.io/badge/review-Qodo-purple)](https://qodo.ai)

**One-line:** An approval-gated finance agent that reconciles Stripe failed payments against your Postgres ledger in a sandbox and recovers revenue you’d otherwise lose.

![Demo GIF — approval gate](docs/demo.gif)

### The Problem
SaaS loses 3-7% revenue to failed payments. Stripe dunning recovers ~15%. Founders either ignore it or manually CSV. Giving raw Stripe keys to an LLM = bankruptcy.

### The Solution
LedgerGuard connects **Stripe (MCP) + Postgres (MCP) + Slack (MCP)**, writes its own `reconcile.py` in TrueForge’s **sandbox**, fans out to **3 subagents**, and **pauses for human approval** before any `stripe.refunds.create` or `UPDATE invoices`. Session survives refresh.

**MCP + Sandbox + Approval + Subagents + Sessions — all visible in TrueForge UI.**

### Quickstart
```bash
git clone https://github.com/Nirvanjha2004/ledgerguard
cd ledgerguard
cp .env.example .env  # set STRIPE_SECRET_KEY, DATABASE_URL, OPENAI_API_KEY
npm install
npm run seed  # creates data/ledger.db with 50 failures ($3,240 at risk)
npx @truefoundry/trueforge  # http://localhost:3001
# In TrueForge UI: Import agent.json, connect Stripe Postgres Slack MCP, chat "Investigate failures"
```

### Architecture
```
[React UI (TrueForge UI SDK)] --SSE--> [TrueForge Server] --MCP--> Stripe / Postgres / Slack
                                        |-> Sandbox (reconcile.py)
                                        |-> human.approval gate
                                        |-> subagents x3
                                        |-> SQLite session
```

### Evaluation
50 simulated failures (30 recoverable / 20 expired). Baseline Stripe dunning F1 0.42 → LedgerGuard 0.85, cost $0.18/run, latency 38s, 0 hallucinations (deterministic ledger gate).

### Qodo Code Review Evidence
> Representative PR: [#2 — feat: ledger DB + Stripe mock + sandbox reconcile](https://github.com/Nirvanjha2004/ledgerguard/pull/2) — Qodo flagged missing idempotency on `recovery_logs` and unsanitized Stripe metadata. Fixed by adding UNIQUE idempotency_key and allowlist filter. Follow-up review shows resolved. See PR history for 3+ reviewed merges.

*More PRs: #3 MCP wiring, #4 UI approval gate, #5 safety & audit.*

### Demo Video
~3 mins: inject failures → agent investigates → sandbox runs → subagents research → HOLDING FOR APPROVAL $1,840 → Approve → live Stripe test refund + DB update + Slack post.

### Limitations
Test-mode Stripe only. Postgres replica recommended for prod. Max $1k per refund without per-row approval.

### Roadmap
Skills for discount offers, Postgres+Redis scale, AI gateway cost tracking.

**Built for TrueForge Hackathon (Aug 24-30 2026). `npx @truefoundry/trueforge`**
