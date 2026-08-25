# LedgerGuard Blog Post — What We Built, What TrueForge Handled, What Broke

## The Job
 SaaS loses 3-7% revenue to failed payments. We gave an agent your Stripe ledger and let it recover money.

## How We Wired It
- **Model:** gpt-4o-mini via TrueForge (switchable to Claude)
- **Tools:** Stripe MCP (OAuth), Postgres MCP (Supabase), Slack MCP, Sandbox (Python), human.approval
- **What TrueForge handled:** MCP OAuth, sandbox-as-tool (reconcile.py), approval gate, 3 subagents, SQLite session
- **What broke:** First sandbox run leaked Stripe metadata with prompt injection "ignore previous instructions" → fixed via allowlist. Qodo flagged missing idempotency UNIQUE → fixed in PR #1.

## Demo Clip
See docs/demo.gif — approval gate with $1,840.

## What We'"'"'d Do With Another Week
Skills for discount offers, Postgres+Redis hosted, AI gateway cost tracking.
