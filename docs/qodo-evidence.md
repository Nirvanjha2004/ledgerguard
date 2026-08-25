## Qodo Code Review Evidence

**Representative PR:** [#2 — feat: Stripe webhook HMAC + allowlist (Qodo review)](https://github.com/Nirvanjha2004/ledgerguard/pull/2)

**What Qodo surfaced:**
- *High:* `seenEvents` was a process-global Set with no TTL/size cap → unbounded memory DoS. Fixed by adding TTL 24h + MAX_SEEN 10k + GC (commit 178b831).
- *High-Level:* Stripe header handling used raw hex instead of `t=...,v1=...` with timestamp tolerance → fixed with 5m tolerance + fallback (commit 3390abd).
- *Recommendation:* Add idempotency via event.id → implemented via Map + DB UNIQUE on recovery_logs.

**History:** PR opened → Qodo summary → fix commit 3390abd → /agentic_review → Qodo flagged High → fix 178b831 → /agentic_review → follow-up review shows resolved. See PR #1 and #3 for additional trail: PR #1 validateRefund NaN check, PR #3 UI per-row approval.

**How to verify:** Open PR #2, see Qodo summary + inline threads, our fix commits, and follow-up review against final code. Every substantive merge goes through PR → Qodo → fix → re-review → human merge. Direct pushes to main do not count.
