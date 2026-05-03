# PaperLens

**The AI document explainer for the rest of the world.** Snap a photo
of any official document — lease, contract, insurance policy, medical
bill, tax letter — and get a plain-language summary in your language,
with the risky clauses flagged and the right questions to ask.

Live: **https://printer-olive.vercel.app**
Plan: [`plan.md`](./plan.md) · Setup: [`SETUP.md`](./SETUP.md) · Deploy: [`DEPLOYMENT.md`](./DEPLOYMENT.md)

---

## Why this exists

Most people sign documents they don't fully read. The ones who *do*
read them often don't understand the language — literally (non-native
English speakers in a US lease) or technically (anyone reading their
own insurance policy). PaperLens fixes both: vision + LLM + 20+ locales
on a single screen, with privacy by default (uploads auto-purge).

This repository is **public** for transparency. Code is licensed under
[MIT](./LICENSE) — fork and build on it freely.

## Stack

- **Next.js 14** (App Router) + Tailwind, hosted on **Vercel**
- **Supabase** Postgres + Auth + Storage (free tier)
- **Google Gemini 2.5 Flash** for analysis (free tier; Hugging Face fallback)
- **Polar.sh** for payments (Merchant of Record; auto-collects VAT in
  80+ countries; accepts Saudi sellers; ~4% + $0.40 per transaction)
- **GitHub Actions** for all crons + CI/CD (unlimited free minutes on
  public repos)
- **Edge TTS**, **Pexels**, **Cloudflare Turnstile**, **Upstash Redis**,
  **Resend**, **Sentry**, **Vercel Analytics** — all free tiers

Designed to run on **$0/month** until paid users justify upgrading
individual pieces.

## Quick start (local dev)

```sh
nvm use            # Node 22 from .nvmrc
npm install
cp .env.local.example .env.local   # then fill in keys (see SETUP.md)
npm run dev        # http://localhost:3000

npm run ci         # mirrors GitHub Actions: typecheck + lint + test + build
```

You don't need most keys to develop locally — the public landing page
and waitlist form work with just `NEXT_PUBLIC_SUPABASE_URL` +
`NEXT_PUBLIC_SUPABASE_ANON_KEY`. To test `/api/analyze` you need
`GEMINI_API_KEY` and `SUPABASE_SERVICE_ROLE_KEY`.

## Architecture in one diagram

```
                  ┌─────────────────────────────────────────┐
                  │   GitHub Actions (free, unlimited)     │
                  │   ┌────────┐ ┌──────┐ ┌────────────┐  │
                  │   │  CI    │ │ E2E  │ │ crons:     │  │
                  │   │  lint  │ │      │ │ cost-cap   │  │
                  │   │  test  │ │      │ │ short-form │  │
                  │   │  build │ │      │ │ pseo-pages │  │
                  │   └────────┘ └──────┘ └────────────┘  │
                  └────────────┬───────────────────────────┘
                               │ deploy / call /api/cron/*
                               ▼
              ┌──────────────────────────────────────────┐
              │   Vercel — Next.js 14 (App Router)      │
              │                                          │
   user ─────►│   /          /[locale]    /upload        │
              │   /pricing   /dashboard   /api/*         │
              │                                          │
              │   /api/analyze  ◄── the only paid call   │
              │     │   gates: Turnstile · rate-limit ·  │
              │     │          quota · file-size · auth  │
              │     ▼                                    │
              │   lib/ai/router  ──►  Gemini  ──►  HF    │
              │   ProviderError → fallback chain         │
              └────────────┬───────────────────────────┘
                           │
                           ▼
        ┌──────────────────────────────────────────────┐
        │   Supabase                                   │
        │   tables: profiles, documents, analyses,     │
        │           subscriptions, app_config,         │
        │           analyze_calls, waitlist            │
        │   storage: documents (private bucket)        │
        │   RPC: try_consume_free_quota,               │
        │        get_user_tier, get_today_spend_usd    │
        └──────────────────────────────────────────────┘
```

## Spend safety (the "never lose money" layer)

Every cost surface has a hard ceiling and a soft circuit-breaker:

| Layer | Cap |
|---|---|
| Google Cloud Billing budget | Hard cap (e.g. $30/mo) — Gemini stops |
| Vercel Spend Mgmt | Project pauses at threshold |
| Supabase | No card on file → can't be billed past free tier |
| `/api/cron/cost-cap` | Hourly: flips `analyze_paused` if today's spend > prorated daily allowance |
| Per-user free quota | 3 docs/mo, atomic decrement in Postgres |
| IP rate limit | 5 analyze req/IP/hour via Upstash Redis |
| Cloudflare Turnstile | Bot floods blocked at the edge |
| File size + page count | Server rejects > 20 MB / > 50 pages on free tier |

If every cron and every gate above fails, the **Google Cloud budget**
is the floor. You will never be billed more than that.

## Plan & North Star

- **Month 6:** $5K MRR · **Month 12:** $20K MRR · **Year 3:** $1M ARR
- See [`plan.md`](./plan.md) for the full roadmap, kill criteria, and
  the four-tier B2C → small-team → API → embed-partners ladder that
  takes us to $1M.

## Built by

**Mara** — a tiny solo team. If PaperLens helps you, the maintainers
keep the lights on with coffee:

- ☕ **Team:** https://buymeacoffee.com/iammara
- ☕ **Developer:** https://buymeacoffee.com/justabdulaziz10

## Documentation

- [`plan.md`](./plan.md) — Full $1M-ARR plan, marketing playbook, kill criteria
- [`SETUP.md`](./SETUP.md) — Every manual step the founder needs to do
- [`DEPLOYMENT.md`](./DEPLOYMENT.md) — Vercel + Polar + Supabase deploy notes
- [`CONTRIBUTING.md`](./CONTRIBUTING.md) — How to file issues / send PRs
- [`SECURITY.md`](./SECURITY.md) — Responsible disclosure
- [`CODE_OF_CONDUCT.md`](./CODE_OF_CONDUCT.md) — How we treat each other
- [`marketing/`](./marketing) — Lifecycle emails, SEO, short-form scripts
- [`LICENSE`](./LICENSE) — MIT

## Status

The waitlist landing page + the `/api/analyze` pipeline (Gemini + HF
fallback, with all gates) are live. The signed-in upload UI, pricing
page, and Polar.sh checkout ship in the next sprint. See `plan.md`
"12-week build" for the schedule.

---

PaperLens is **not** legal, medical, tax, or financial advice. It
explains what your documents say, in plain language. For decisions
that matter, talk to a qualified professional.
