# Supabase Postgres (Hosted)

1. Create Supabase project → copy DATABASE_URL=postgresql://...
2. Run `psql $DATABASE_URL -f prisma/schema.sql`
3. Seed: `DATABASE_URL=... npm run seed`
4. TrueForge MCP: `npx -y @modelcontextprotocol/server-postgres $DATABASE_URL`
5. Hosted TrueForge: `docker compose up` → Postgres+Redis, 3 replicas share session via Redis
