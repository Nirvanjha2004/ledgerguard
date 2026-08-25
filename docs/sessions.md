# Session Persistence Demo

How to demo that TrueForge sessions survive reconnect:

1. Start `npx @truefoundry/trueforge` → Investigate failures → HOLDING FOR APPROVAL
2. Refresh browser (Cmd+R) → TrueForge UI reconnects → session state still shows same approval gate (SQLite WAL)
3. Restart server: `docker compose restart` → hosted mode Postgres+Redis peers session across replicas

This isvisible in TrueForge UI: session ID persists.

Hosted mode switch:
- `docker compose up` uses Postgres+Redis (see docker-compose.yml)
- Local mode uses SQLite (zero infra)
