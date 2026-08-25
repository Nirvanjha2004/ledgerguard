## Stripe Modes

- **mock** (default): `src/mcp/stripeMock.ts` — 12 failures $3,240 at risk, no key needed
- **test**: `STRIPE_SECRET_KEY=sk_test_...` → live test API via MCP + src/mcp/stripeLive.ts fallback
- **live**: `sk_live_...` → real refunds (requires approval gate per row)

Switch in TrueForge UI: Import agent.json, set STRIPE_SECRET_KEY env.
