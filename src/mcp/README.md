# TrueForge MCP config — copy to TrueForge UI > MCP Servers
# See agent.json mcpServers section
# Required env: STRIPE_SECRET_KEY, DATABASE_URL

# Test Stripe with mock: set STRIPE_SECRET_KEY=sk_test_mock and use src/mcp/stripeMock.ts
# Real: Stripe MCP via OAuth: npx -y @stripe/mcp --tools=paymentIntents.list,refunds.create

# Postgres via Supabase/Neon:
# DATABASE_URL=postgresql://ledger:ledger@localhost:5432/ledgerguard

# Slack (optional):
# npx -y @modelcontextprotocol/server-slack (needs SLACK_BOT_TOKEN)
