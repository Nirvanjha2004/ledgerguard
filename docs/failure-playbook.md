# Failure Playbook — What Happens When Things Go Wrong

| Failure | Detection | Response |
|---|---|---|
| Stripe API down | retry 3x backoff | Slack "human needed" + pause agent |
| Postgres down | connection error | read replica fallback, else pause |
| Duplicate webhook | event.id dedupe (TTL 24h, cap 10k) | ignored:true |
| Hallucinated refund | conditional UPDATE ... WHERE status='unpaid' | 0 changes → abort |
| Prompt injection in metadata | allowlist sanitizer | stripped before LLM |
| Model timeout | 30s sandbox timeout | fallback model → escalate |
| Approval ignored | 5m timeout | auto-expire, no execution |
| Amount > $1000 | policy skill | per-row approval required |
