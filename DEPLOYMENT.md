# Deployment

## What is provisioned

- **Vercel project `printer`** — production at
  **https://printer-olive.vercel.app** (kept until first $20 of MRR, then
  swap to `paperlens.app`).
- **Supabase project `paperlens`** (free tier, $0/mo)
  - URL: `https://qcrrfisswbaecuipcatr.supabase.co`
  - Schema: waitlist, profiles, documents, analyses, subscriptions
  - RLS on every user table; anon allowed only to insert into waitlist
- **Polar.sh** — to be set up by the founder; products created in the
  next sprint. Polar is the Merchant of Record (handles VAT in 80+
  countries, accepts Saudi sellers, ~4% + $0.40 per transaction).
- **Apple Developer account** ($99/yr) — already in hand.

## Free-first stack confirmation

Every paid component has a free path. Until MRR justifies upgrades:

| Need | Free path | Trigger to upgrade |
|------|-----------|--------------------|
| AI for **all** tiers | Google Gemini 2.5 Flash (1500 docs/day on free key) | Auto-upgrade to paid Gemini tier 1 (~$0.001/doc) when free quota exhausts; capped via Google Cloud Billing budget |
| AI fallback | Hugging Face Inference (already authed as `justabdulaziz10`) | Auto-routed when Gemini unavailable |
| Hosting | Vercel | ~50K MAU |
| DB / auth / storage | Supabase free | ~10K paying users |
| Email | Resend free (3K/mo) | ~5K MAU |
| TTS | Edge TTS (`edge-tts` lib, no key) | Optional ElevenLabs at MRR > $5K |
| Stock video | Pexels + Pixabay + Unsplash | n/a |
| Cron / CI | GitHub Actions on public repo (unlimited) | Never |
| Errors | Sentry free (5K/mo) | ~5K users |
| Analytics | Vercel Analytics (built-in, free Hobby tier) | Probably never |
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
# Polar (Merchant of Record; KSA-friendly)
POLAR_ACCESS_TOKEN=polar_oat_...
POLAR_WEBHOOK_SECRET=polar_whsec_...
POLAR_ORG_ID=
NEXT_PUBLIC_POLAR_PRODUCT_PRO=
NEXT_PUBLIC_POLAR_PRODUCT_LIFETIME=
NEXT_PUBLIC_POLAR_PRODUCT_POWER=

# AI (Gemini for all tiers; HF as fallback)
GEMINI_API_KEY=...                     # aistudio.google.com (FREE, instant)
HUGGINGFACE_TOKEN=hf_...               # fallback when Gemini unavailable

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

1. **Google Cloud Console** → Billing → Budgets & alerts → create a
   budget on the Gemini API project (e.g. **$30/month**) with alerts
   at 50/90/100% AND **"Cap project at 100%"** enabled. This is the
   absolute ceiling for AI cost.
2. **Vercel** → Settings → Spend Management → hard cap (e.g. **$20**).
   Project pauses at threshold; no overage billing.
3. **Supabase** → confirm no card on file (free tier overages get
   capped, not billed).
4. **Polar.sh** → create your organization, set the display name to
   "PaperLens", add a payout method. As the Merchant of Record, Polar
   collects + remits VAT/sales tax automatically — nothing else to flip.

After step 4, **the maximum the system can ever cost is ~$50/month**
even under total abuse. Layered defenses below mean real cost is ~$0
until paid users justify Gemini paid tier. At realistic Gemini paid-tier
volumes ($0.001/doc), 30,000 paying users at 2 docs/mo = $60/mo total.

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
