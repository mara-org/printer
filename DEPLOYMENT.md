# Deployment

## What is provisioned

- **Vercel project `printer`** — production at
  **https://printer-olive.vercel.app** (kept until first $20 of MRR, then
  swap to `paperlens.app`).
- **Supabase project `paperlens`** (free tier, $0/mo)
  - URL: `https://qcrrfisswbaecuipcatr.supabase.co`
  - Schema: waitlist, profiles, documents, analyses, subscriptions
  - RLS on every user table; anon allowed only to insert into waitlist
- **Stripe products + prices (LIVE)**
  - Pro $6.99/mo — `price_1TSZRk7iHZBeOOe5xY3ak1Yy`
  - Lifetime $79 — `price_1TSZRn7iHZBeOOe5QfKbH5gB`
  - Power $14.99/mo — `price_1TSZRp7iHZBeOOe5YNBBoKFB`
- **Apple Developer account** ($99/yr) — already in hand.

## Free-first stack confirmation

Every paid component has a free path. Until MRR justifies upgrades:

| Need | Free path | Trigger to upgrade |
|------|-----------|--------------------|
| AI for free-tier users | Google Gemini 2.5 Flash (1500 docs/day) | n/a — never costs us |
| AI for paid-tier users | Claude Sonnet 4.6 with monthly cap | Cap rises with MRR |
| Hosting | Vercel | ~50K MAU |
| DB / auth / storage | Supabase free | ~10K paying users |
| Email | Resend free (3K/mo) | ~5K MAU |
| TTS | Edge TTS (`edge-tts` lib, no key) | Optional ElevenLabs at MRR > $5K |
| Stock video | Pexels + Pixabay + Unsplash | n/a |
| Cron / CI | GitHub Actions on public repo (unlimited) | Never |
| Errors | Sentry free (5K/mo) | ~5K users |
| Analytics | PostHog free (1M/mo) | Probably never |
| Bot protection | Cloudflare Turnstile | Never |
| Domain | `printer-olive.vercel.app` | First $20 MRR → buy `paperlens.app` |
| Native iOS | Capacitor + existing Apple Dev account | n/a (already paid) |
| Native Android | PWA only for v1 | First $25 MRR → Google Play |

## Vercel env vars (current + upcoming)

Already set:
```
NEXT_PUBLIC_SUPABASE_URL=https://qcrrfisswbaecuipcatr.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_...
```

Add as each cron / feature ships:
```
# Stripe
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PRICE_PRO=price_1TSZRk7iHZBeOOe5xY3ak1Yy
NEXT_PUBLIC_STRIPE_PRICE_LIFETIME=price_1TSZRn7iHZBeOOe5QfKbH5gB
NEXT_PUBLIC_STRIPE_PRICE_POWER=price_1TSZRp7iHZBeOOe5YNBBoKFB

# AI
GEMINI_API_KEY=...                     # aistudio.google.com (FREE, instant)
ANTHROPIC_API_KEY=sk-ant-...           # paid users only
HUGGINGFACE_TOKEN=hf_...               # already authed as justabdulaziz10

# Email
RESEND_API_KEY=re_...

# Cron auth
CRON_SECRET=<random-32-bytes>

# Bot protection
NEXT_PUBLIC_TURNSTILE_SITE_KEY=...
TURNSTILE_SECRET_KEY=...

# Rate limit
UPSTASH_REDIS_REST_URL=...
UPSTASH_REDIS_REST_TOKEN=...

# Master kill switch (default unset = false)
KILL_SWITCH=false
```

## GitHub repo Secrets to add

Settings → Secrets and variables → Actions:
- `CRON_SECRET` — same value as Vercel `CRON_SECRET`

Everything else for crons (Gemini key, Resend key, etc.) is read from
the Vercel-side route, not from GitHub Actions, so the only secret
GH Actions itself needs is `CRON_SECRET`.

## Spend safety setup (do these once)

1. **Anthropic Console** → Settings → Billing → Limits → set monthly
   hard cap (e.g. **$30**). This is the absolute ceiling.
2. **Vercel** → Settings → Spend Management → hard cap (e.g. **$20**).
   Project pauses at threshold; no overage billing.
3. **Supabase** → confirm no card on file (free tier overages get
   capped, not billed).
4. **Stripe** → Settings → set Business Name to "PaperLens" (unblocks
   Payment Links), enable Stripe Tax.

After step 4, **the maximum the system can ever cost is ~$50/month**
even under total abuse. Layered defenses below mean real cost is ~$0.

## CI/CD pipeline

All workflows live in `.github/workflows/`. Free for public repos.

| Workflow | Trigger | What it does |
|----------|---------|--------------|
| `ci.yml` | push, PR | typecheck, lint, test, build (parallel jobs) |
| `secret-scan.yml` | push, PR, weekly | gitleaks scan |
| `e2e.yml` | Vercel deployment success | curl-based smoke against the preview/prod URL |
| `health-check.yml` | every 5 min | hits `/api/health`, opens incident issue on 3/3 fail |
| `cron-cost-cap.yml` | hourly | hits `/api/cron/cost-cap` (404 ok until route exists) |
| `dependabot.yml` | weekly Mon | npm minor/patch + GH Actions updates |

### Branch protection (set once in GitHub UI)

Settings → Branches → Add rule for `main`:
- Require status checks: `typecheck`, `lint`, `test`, `build`, `gitleaks`
- Require branches up to date
- Require linear history
- Restrict pushes (only via PR)

## Local dev

```sh
nvm use            # uses Node 22 from .nvmrc
npm install
npm run dev        # http://localhost:3000
npm run ci         # typecheck + lint + test + build (same as CI)
```

## Smoke test the deployment

```sh
curl -s https://printer-olive.vercel.app/api/health | jq
# → { "ok": true, "service": "paperlens", "sha": "...", "region": "...", "ts": ... }
```

If you see a Vercel login wall instead of JSON: project Settings →
Deployment Protection → set "Vercel Authentication" to **Disabled**.

## After domain is bought (later, with revenue)

1. Buy `paperlens.app` (Cloudflare Registrar, ~$12/yr).
2. Vercel project → Settings → Domains → add `paperlens.app`.
3. Update env: `NEXT_PUBLIC_SITE_URL=https://paperlens.app`.
4. Update GH Actions env in `health-check.yml`, `e2e.yml`,
   `cron-cost-cap.yml` (replace `printer-olive.vercel.app`).
5. Supabase Auth → URL Configuration → Site URL.
6. Resend → add domain (DKIM/SPF auto-generated).
7. Submit Search Console (per locale).
