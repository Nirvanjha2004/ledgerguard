# LedgerGuard — Remaining Tasks Before Submission

**Deadline:** Saturday, August 30, 2026 — 8:00 PM London time
**Submit at:** https://www.wemakedevs.org/hackathons/trueforge (submission form)
**Repo:** https://github.com/Nirvanjha2004/ledgerguard

Everything below is NON-CODE work (code + Qodo trail + docs are done). Tick as you go.

---

## 1. Record the Demo Video (~3 minutes) — REQUIRED for every submission

- [ ] Set up recording: OBS / Xbox Game Bar / QuickTime, 1080p, mic on
- [ ] Start everything locally:
      ```bash
      cp .env.example .env   # fill STRIPE_SECRET_KEY, DATABASE_URL, OPENROUTER_API_KEY
      npm install && npm run seed
      npx @truefoundry/trueforge     # harness on :3001
      npm run dev                    # ledger API on :3000
      ```
- [ ] Import `agent.json` in TrueForge UI, connect Stripe + Postgres MCPs (both green)
- [ ] Follow `docs/video-outline.md` script:
  - **0:00–0:30** Hook — show Stripe dashboard, "$3,240 at risk across 12 failed payments"
  - **0:30–1:00** Solution — one slide of architecture; "the harness holds the license, not the model"
  - **1:00–3:30** LIVE DEMO — chat *"Investigate the payment-failures alert"* →
    film these panels in order: stripe.list tool call → postgres.query → **sandbox panel running reconcile.py** → subagents x3 cards → **red `HOLDING FOR YOUR APPROVAL — $1,840` gate** (slow down here) → click Approve → refund created + ledger updated + Slack posted → **refresh browser mid-session to prove session persistence**
  - **3:30–4:15** Architecture — why harness (MCP OAuth, sandbox-as-tool, approvals), point at Qodo PR trail
  - **4:15–4:40** Metrics — F1 0.42 → 0.85 on 50-case eval (`eval/dataset.csv`), cost/run from `docs/cost.md`
  - **4:40–5:00** Vision — same pattern for DB migrations, ad spend, any irreversible ops
- [ ] Export as MP4, upload to YouTube (unlisted is fine)
- [ ] Add the video URL to README top section + submission form

## 2. Publish the Blog Post — enters you for Keychron keyboard prize

- [ ] Take `docs/blog-draft.md` and expand into a full post (add screenshots: sandbox panel, approval gate, Qodo inline comments)
- [ ] Publish on Dev.to / Hashnode / Medium (pick one, keep canonical link)
- [ ] Title suggestion: *"I gave an AI agent my Stripe keys — because the harness won't let it move money until I say so"*
- [ ] Add published URL to README ("Blog post" line) + submission form

## 3. Social Posts — swag for top 10 posters

- [ ] Post a build-in-public thread/X post with a short clip of the approval-gate moment (the red screen is the money shot)
- [ ] Tag **@WeMakeDevs**, **@TrueFoundry**, **@QodoAI** so they can find it
- [ ] Post before deadline (early posts get more traction)

## 4. Submission Form — do this LAST, before Aug 30 8PM London

- [ ] Public repo URL: `https://github.com/Nirvanjha2004/ledgerguard`
- [ ] Demo video URL (from step 1)
- [ ] Short write-up: what the agent does + how it uses TrueForge (reuse `docs/judges.md` + `docs/qodo-evidence.md`)
- [ ] Blog post link (if entering that prize)

## 5. Optional / Nice-to-have

- [ ] **GitHub Actions CI** — `.github/workflows/ci.yml` is written locally but blocked from pushing by token scope. Fix:
      ```powershell
      gh auth refresh -h github.com -s workflow
      git add .github/workflows/ci.yml
      git commit -m "ci: GitHub Actions test+build"
      git push origin main
      ```
- [ ] Drop `docs/demo.gif` into repo root reference in README (replace placeholder) — 15s clip of approval gate
- [ ] If attending SF in-person Aug 29: register on Luma separately ($50 OpenAI credits — note: our model now runs via OpenRouter, credits still useful for gateway experiments)
- [ ] Run one final end-to-end rehearsal of `START.md` from a clean clone (judges will do exactly this)

## Already Done (no action needed)

- [x] Harness: MCP (Stripe/Postgres/Slack) + sandbox reconcile.py + approval gates + subagents x3 + sessions + skills
- [x] Model switched to **ox-alpha via OpenRouter** (`agent.json`, `.env.example`, all docs)
- [x] Qodo trail: 5 merged PRs, High×2 + Medium findings fixed, evidence table in `docs/qodo-evidence.md`
- [x] Frequent pushes: 50+ commits over the build window
- [x] Docs: START guide, judges verification checklist, security model, failure playbook, cost analysis, changelog
- [x] Tests: guardrails, webhook HMAC, recovery service, harness config, integration
