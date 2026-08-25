# Cost Analysis — LedgerGuard

Per-run (12 failures, ox-alpha via OpenRouter):
- Input tokens: ~8k
- Output tokens: ~2k
- Tool calls: 15 (Stripe + Postgres + sandbox)
- Total: well under $0.05/run (varies by OpenRouter pricing for the selected model)

With subagents x3: still under $0.15/run
vs manual CSV work: 45 min @ $50/hr = $37.50
ROI: >250x per run even at conservative token pricing

At 100 failures/mo: a few dollars/mo agent cost vs $3,240 recovered revenue

Model routing note: OpenRouter gives provider failover — if one upstream is degraded, reroute without code change (`agent.json` model block).
