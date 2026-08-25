# Architecture

See README diagram: React UI → TrueForge Server → MCP (Stripe/Postgres/Slack) → Sandbox → Approval → Subagents → SQLite

Key decisions:
- Express + better-sqlite3 for local SQLite (zero infra) → Postgres for scale (why not simpler? Need hosted multi-replica)
- Sandbox as tool (TrueForge pattern) — cheaper than per-agent sandbox
- Idempotency via UNIQUE idempotency_key — why not just Stripe idempotency? Need DB guard too
- Subagents only for high-value (> $100) — why not all? Cost/latency

Failure modes: see guardrails.ts + reconcile.py + evaluation.ts
