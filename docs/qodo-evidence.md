## Qodo Code Review Evidence

**Representative PR:** [#2 — feat: Stripe webhook HMAC + allowlist (Qodo review)](https://github.com/Nirvanjha2004/ledgerguard/pull/2)

**What Qodo surfaced:**
- *High:* `seenEvents` was a process-global Set with no TTL/size cap → unbounded memory DoS. Fixed by adding TTL 24h + MAX_SEEN 10k + GC (commit 178b831).
- *High-Level:* Stripe header handling used raw hex instead of `t=...,v1=...` with timestamp tolerance → fixed with 5m tolerance + fallback (commit 3390abd).
- *Recommendation:* Add idempotency via event.id → implemented via Map + DB UNIQUE on recovery_logs.

**Full cycle on this PR:** PR opened → Qodo summary → fix commit 3390abd → `/agentic_review` → Qodo re-reviewed and flagged High → fix 178b831 → `/agentic_review` → **Qodo updated review to final commit 178b831** → merged. Judges can see the completed review, our decisions, and the follow-up review against the final code.

### Additional trail (5 substantive PRs, all reviewed)

| PR | What Qodo surfaced | Our fix | Result |
|---|---|---|---|
| [#1](https://github.com/Nirvanjha2004/ledgerguard/pull/1) | Missing NaN check + amount cap | validateRefund with explicit validation | Merged |
| [#2](https://github.com/Nirvanjha2004/ledgerguard/pull/2) | High: unbounded Set DoS; Stripe header format; idempotency | TTL+cap+GC; t=,v1= parsing + 5m tolerance; event.id dedupe | Re-review updated to final commit → merged |
| [#3](https://github.com/Nirvanjha2004/ledgerguard/pull/3) | Docs-only review, no High | N/A | Merged |
| [#4](https://github.com/Nirvanjha2004/ledgerguard/pull/4) | Move unpaid check into Tx; structured SQLite error codes vs string match | Conditional `UPDATE ... WHERE status='"'"'unpaid'"'"'` + SQLITE_CONSTRAINT_UNIQUE (commit c52ee6b) | Follow-up requested → merged |
| [#5](https://github.com/Nirvanjha2004/ledgerguard/pull/5) | **High:** mock mode unreachable (`sk_test_mock` created real client; refunds threw in mock); **Medium:** `amount ? ...` dropped 0 → silent full-refund | Explicit mock detection (STRIPE_MODE / sk_test_mock); mock refunds return succeeded; `amount !== undefined` + validation (commits 81185e7, 20f8b60) | Fixes pushed → follow-up `/agentic_review` requested → merged |

**How to verify:** Open any PR above — Qodo summary comment, inline findings with severity badges, our fix commits referencing the findings, and follow-up review requests. Every substantive merge went branch → PR → Qodo review → fix → re-review → human merge. Direct pushes to main were docs/metadata only.
