# This code runs INSIDE TrueForge sandbox. Never touches prod without approval.
import sqlite3

def reconcile(stripe_failed, ledger_unpaid):
    """
    stripe_failed: list of {id, amount, error}
    ledger_unpaid: list of {stripe_pi, amount_cents}
    Returns: {recoverable: [], non_recoverable: [], total_recoverable_cents}
    Deterministic gate: only propose refund if ledger.unpaid AND stripe.failed
    """
    ledger_map = {row["stripe_pi"]: row for row in ledger_unpaid}
    recoverable = []
    non_recoverable = []
    for pi in stripe_failed:
        pid = pi["id"]
        # Hallucination guard: must exist in ledger as unpaid
        if pid not in ledger_map:
            continue
        if ledger_map[pid]["status"] != "unpaid":
            continue
        amount = pi["amount"]
        error = pi.get("last_payment_error", {}).get("decline_code") or pi.get("last_payment_error", {}).get("code", "")
        if error in ["expired_card"]:
            non_recoverable.append({"stripe_pi": pid, "amount_cents": amount, "reason": "expired_card - do not retry"})
        else:
            # allowlist sanitization
            recoverable.append({"stripe_pi": pid, "amount_cents": amount, "reason": error or "card_declined", "idempotency_key": f"{pid}_refund_{amount}"})

    total = sum(r["amount_cents"] for r in recoverable)
    return {"recoverable": recoverable, "non_recoverable": non_recoverable, "total_recoverable_cents": total, "audit": f"Checked {len(stripe_failed)} Stripe vs {len(ledger_unpaid)} ledger"}

# Example local test (sandbox runs this with real MCP data)
if __name__ == "__main__":
    import json
    print(json.dumps(reconcile(
        [{"id":"pi_1Cus001","amount":4900,"last_payment_error":{"code":"card_declined"}}],
        [{"stripe_pi":"pi_1Cus001","amount_cents":4900,"status":"unpaid"}]
    ), indent=2))
