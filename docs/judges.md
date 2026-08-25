# Judges: How to Verify Harness

1. `npx @truefoundry/trueforge` → Import agent.json
2. Check MCP: Stripe, Postgres, Slack connected (green)
3. Chat "Investigate failures" → see tool calls: stripe.list, postgres.query, sandbox.run, subagents, approval gate
4. Sandbox panel: shows reconcile.py output
5. Approval card: red HOLDING FOR YOUR APPROVAL with $1,840
6. Refresh browser → session persists (proof of harness sessions)
7. Qodo: Check PR #2, #4, #5 for High fixes and follow-up reviews
