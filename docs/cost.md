# Cost Analysis — LedgerGuard

Per-run (12 failures, gpt-4o-mini):
- Input tokens: ~8k → $0.0012/M = $0.0096
- Output tokens: ~2k → $0.002/M = $0.004
- Tool calls: 15 (Stripe + Postgres + sandbox)
- Total: ~$0.014/run

With subagents x3: ~$0.04/run
vs manual CSV work: 45 min @ $50/hr = $37.50
ROI: ~940x per run

At 100 failures/mo: $1.40/mo agent cost vs $3,240 recovered revenue
