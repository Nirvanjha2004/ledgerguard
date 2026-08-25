# Security Audit — LedgerGuard

## What AI CAN do
- Read Stripe (list), read Postgres, write Python to sandbox, draft Slack

## What AI CANNOT do
- Call stripe.refunds.create without human.approval
- UPDATE/DELETE Postgres without approval
- Exfiltrate secrets (no env in prompt)

## Requires Human Approval
- Any amount > $0 refund
- Any DB write
- Slack post to #finance

## Guardrails
- Pydantic allowlist sanitization (strip prompt injection)
- Idempotency UNIQUE per refund
- Deterministic ledger gate: `UPDATE ... WHERE status='"'"'unpaid'"'"'` → abort if 0 changes
- HMAC timingSafeEqual + 5m tolerance + event.id dedupe
