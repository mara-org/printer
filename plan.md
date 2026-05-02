# Plan: PaperLens — Fully Automated, Free-First Solo SaaS to $1M ARR

AI everyday-document explainer. Snap a photo of any official document
(lease, contract, insurance, medical bill, tax letter, government form);
get a plain-language summary in your language, flagged risks, suggested
questions, and benchmarks.

**Operating principles:**
1. **Zero hires, ever.** Build, marketing, support, and ops all run on
   AI + scheduled jobs + platform APIs.
2. **Free until revenue.** Every component runs on a free tier until
   paid users justify upgrading that one component. No card on file
   except Stripe (incoming) and Apple Developer (already paid).
3. **CI/CD from day one, designed to last forever.** Every change is
   gated by automated checks; every cron has a kill switch; every
   external dependency has a circuit breaker.

## Why this niche

| Criterion                  | PaperLens                                              |
|----------------------------|--------------------------------------------------------|
| Universal pain             | Every adult signs documents they do not fully read     |
| Worldwide                  | Non-English markets are massively underserved          |
| AI-native moat             | Vision + LLM + multilingual; impossible pre-2024       |
| Repeat use                 | Leases, jobs, doctors, tax, school — life events recur |
| B2C price fit              | $6.99/mo or $1.99/doc — global purchasing-power-aware  |
| Solo + automation friendly | Single-screen UX; content + support are AI-tractable   |
| Distribution surface       | App Store SEO + programmatic SEO + automated short-form |

Killer detail: **localized landing pages in 20+ languages.** A renter in Berlin
googling "Mietvertrag erklären" or in São Paulo searching "explicar contrato
de aluguel" finds us, not a US-only tool. This is the wedge.

## North star

- **Month 6:** $5K MRR (~700 paid users at $6.99)
- **Month 12:** $20K MRR ($240K ARR)
- **Month 24:** $80K MRR ($960K ARR) via tiered pricing + app stores
- **$1M ARR path:** B2C alone gets us to ~$500K. The second $500K is the Power
  tier ($14.99) for power users + a thin self-serve API for partners. Both
  ship as automated upgrades — no sales calls, no contracts.

## Free-first stack (locked)

| Layer | Choice | Free tier | When we'd upgrade |
|-------|--------|-----------|-------------------|
| Frontend | Next.js 14 App Router + Tailwind | n/a | n/a |
| Hosting | **Vercel Hobby** (or current team account with hard spend cap = $0) | 100 GB bw, 100 h compute, 1M edge req/mo | Only when traffic exceeds, ~50k MAU |
| Domain | **printer-olive.vercel.app** for now → buy `paperlens.app` ($12/yr) once revenue covers it | Free | First $20 of MRR |
| Auth | Supabase Auth | 50K MAU | Beyond 50K |
| DB | Supabase Postgres | 500 MB | Tighten storage; upgrade at ~10K paying |
| Storage | Supabase Storage | 1 GB | Delete uploaded files immediately after analysis (free tier); keep 30 days only for paid |
| **AI (all tiers)** | **Google Gemini 2.5 Flash** (vision-capable, 1M context) | 1500 docs/day on free key | Paid Gemini tier 1 unlocks at ~$0.001/doc; cap set in Google Cloud billing |
| **AI — fallback** | Hugging Face Inference (Llama-3.2-Vision, Qwen2-VL) via authed `justabdulaziz10` | Monthly free credits | Auto-routed only when Gemini quota exhausts mid-day |
| Payments | Stripe live (Pro $6.99/mo, Power $14.99/mo, Lifetime $79) | Pay-as-you-go fees only | n/a |
| Stripe Tax | On from day 1 — auto-collects + remits VAT/sales tax | Per-txn fee | n/a |
| Email outbound | Resend | 3K/mo, 100/day | Move to Brevo or upgrade Resend at ~5K MAU |
| Email inbound | Resend Inbound webhook → Gemini reply | Free | n/a |
| Voice (TTS) | **Microsoft Edge TTS** (`edge-tts` lib) — no key needed | Unlimited | Move to ElevenLabs only after MRR > $5K, optional |
| B-roll / stock | Pexels + Pixabay + Unsplash APIs | Free, generous | n/a |
| Video render | ShortGPT or moviepy on GitHub Actions runners | Free (public repo = unlimited mins) | n/a |
| Bot protection | Cloudflare Turnstile | Free, no limit | n/a |
| Rate limit cache | Upstash Redis | 10K cmd/day | At ~5K active users |
| Errors | Sentry | 5K events/mo | At ~5K users |
| Analytics | PostHog | 1M events/mo | Probably never |
| **Cron / schedulers** | **GitHub Actions on the public repo** | **Unlimited free minutes** for public repos | Never |
| CI/CD | GitHub Actions + Vercel Git integration | Free for public repos | Never |
| Secret scan | gitleaks GitHub Action | Free | n/a |
| Uptime | GitHub Actions every 5 min hits `/api/health` | Free | n/a |
| Dep updates | Dependabot | Free | n/a |
| Native iOS app | Capacitor wrap PWA → existing Apple Developer account ($99/yr already paid) | n/a | n/a |
| Native Android | PWA on web only for v1; Google Play later when revenue justifies $25 one-time | Free | First $25 of MRR |
| ASO data | App Store Connect API + Google Play Developer API directly (free) | Free | Skip AppFigures entirely |

**One-model AI cost model:** every analyze call goes to Gemini 2.5 Flash,
regardless of user tier. Tier differentiation is done by **features +
quota**, not model quality:

| Tier | Quota | Features |
|------|-------|----------|
| Free | 3 docs/month | Standard parsing, 1 follow-up Q, watermarked export, queued (lower priority) |
| Pro $6.99/mo | Unlimited | + unlimited follow-ups, multilingual export, history search, no watermark, priority queue |
| Power $14.99/mo | Unlimited | + 50+ page docs, bulk upload (10 at once), API access, side-by-side compare |
| Lifetime $79 | Unlimited | Pro features, one-time payment |

Cost per analysis on Gemini 2.5 Flash (paid tier 1): ~$0.001 per
document at typical lengths. 50,000 paying users × 2 docs/mo = $100/mo
total AI bill. Margin on Pro alone is >99%.

## Why we host crons on GitHub Actions, not Vercel Cron

- **Vercel Cron** on Hobby: limited cron slots, executions count toward
  serverless function invocations.
- **GitHub Actions on a public repo**: unlimited free minutes, native
  scheduling, native secret store, native log retention. The repo is
  already public.

Crons live in `.github/workflows/cron-*.yml`, each calling either an
internal Next.js API route (`https://printer-olive.vercel.app/api/cron/X`,
auth via `CRON_SECRET` header) or running a script directly on the
runner. Either way the only cost surface is Vercel function execution,
which the spend cap pins to $0.

## CI/CD architecture (designed to last forever)

The principle: **a future change should never silently break what works
today.** Every cron, every API route, every external integration is
guarded by an automated check, a circuit breaker, or both.

### Pipeline gates (every PR runs all of these)

| Gate | Workflow | Blocks merge? |
|------|----------|---------------|
| TypeScript strict | `ci.yml` (typecheck job) | Yes |
| ESLint + Next lint | `ci.yml` (lint job) | Yes |
| Build succeeds | `ci.yml` (build job) | Yes |
| Unit tests pass | `ci.yml` (test job) | Yes |
| E2E smoke (Playwright) | `e2e.yml` against Vercel preview | Yes |
| Secret leak scan | `secret-scan.yml` (gitleaks) | Yes |
| Supabase migration dry-run on shadow DB | `ci.yml` (migrate-dry job) | Yes |
| Bundle size check | `ci.yml` (size-limit) | Warn-only initially |

Branch protection on `main` requires all of the above to pass.

### Post-merge gates

| Gate | Workflow | Action on fail |
|------|----------|----------------|
| Vercel auto-deploy | Vercel Git integration | Vercel rolls back automatically on build fail |
| `/api/health` probe every 5 min | `health-check.yml` | After 3 consecutive fails: open GitHub issue + post Sentry event + Vercel alias rollback |
| Synthetic analyze probe every 1 hr | `synthetic.yml` | Submits a known PDF, asserts JSON shape; fails open issue |
| External-API contract tests | `contract-tests.yml` nightly | Detects breaking changes in Gemini/Stripe/Supabase APIs before they break prod |

### Spend safety (the "never lose money" layer)

| Control | Where | Effect |
|---------|-------|--------|
| Google Cloud billing budget alert + cap | Google Cloud Console → Billing → Budgets | Hard monthly cap, e.g. $30; sends webhook to `/api/cron/cost-cap` at 50/90/100% |
| Vercel spend cap | Vercel team Spend Mgmt | Project pauses at threshold, no billing past it |
| Supabase: no card on file | Supabase Settings | Free tier overages get hard-capped, not billed |
| `cost-cap.yml` cron hourly | GitHub Actions → `/api/cron/cost-cap` | Reads our own `analyze_calls` Supabase counter; flips `ANALYZE_PAUSED=true` if today's spend > daily-budget/30 |
| Free-tier per-user quota | Supabase RLS + atomic `select … for update` | Free = 3 docs/mo enforced atomically; cannot exceed |
| File size + page count gate | `app/api/analyze/route.ts` | Reject >20 MB or >50 pages on free tier; >100 pages on paid |
| IP rate limit | Upstash Redis | 5 analyze req / IP / hour |
| Cloudflare Turnstile | Sign-up + upload form | Bot floods blocked at the edge |
| Hugging Face fallback for free tier | `lib/ai/Provider.ts` | When Gemini quota exhausts, free-tier requests degrade to HF (also free) instead of paying |

If every layer above fails, the **Google Cloud billing budget cap** is
the floor. You will never be billed more than that.

### Self-healing rules

- Each cron writes a heartbeat to `cron_runs` Supabase table; an hourly
  watchdog opens a GitHub issue if any cron has not heartbeat in 2x its
  interval.
- Each cron has a kill-switch env var (`CRON_<NAME>_PAUSED=true`). Set
  it once in Vercel + GitHub Secrets to halt that cron without code.
- Master kill switch: `KILL_SWITCH=true` halts every cron and pauses
  the analyze route.
- Auto-rollback: if a deploy increases error rate >1% in the first
  10 minutes, `health-check.yml` calls Vercel's promote API to revert
  to the previous READY deployment.

### Designed-to-last constraints

- **Pinned major versions only.** Dependabot proposes minors + patches
  weekly; majors require manual review.
- **Provider-abstracted AI calls.** `lib/ai/Provider.ts` is the only
  surface; `gemini.ts`, `claude.ts`, `huggingface.ts` are interchangeable.
  Swapping providers is one config change.
- **Schema migrations are checked-in, additive-only by default.** Destructive
  migrations require a `BREAKING:` commit prefix.
- **Locale-stable IDs.** Supabase rows use UUIDs; URL slugs are stable
  even when copy is regenerated.
- **No environment-specific code paths.** Same code runs on preview,
  prod, and locally; behavior is config, not branching.

### Bus factor

If the founder is unavailable for 30 days the system continues to:
- accept paying customers (Stripe Checkout)
- analyze documents (Gemini 2.5 Flash for all tiers)
- send lifecycle emails
- post short-form video
- generate SEO pages
- handle inbound email via Gemini

Things that pause without a human:
- Apple/Google review replies (rare)
- Stripe disputes > $500 (auto-routed to inbox; no auto-action)

Bus factor is "1 founder, but fine for a month."

## Automation architecture

Every recurring task is a GitHub Actions workflow under
`.github/workflows/cron-*.yml`. Each calls a Next.js API route at
`/api/cron/<name>` authenticated with `CRON_SECRET`.

| Cron | Schedule | What it does |
|------|----------|--------------|
| `cost-cap` | hourly | Reads internal `analyze_calls` counter + Google Cloud billing budget; pauses analyze if over daily prorated allowance |
| `lifecycle-emails` | every 1h | Sends Day-N emails via Resend |
| `inbound-mail-reply` | on Resend webhook | Gemini reads inbound, sends reply, logs thread |
| `generate-pseo-pages` | weekly Sun 03:00 UTC | 5 new locale×doctype pages, auto-PR + auto-merge if CI passes |
| `refresh-pseo-pages` | monthly | Re-runs pages > 90 days against latest model |
| `short-form-batch` | daily 06:00 UTC | Script (Gemini) → voice (Edge TTS) → render (ShortGPT) → post (TikTok/IG/YT APIs) |
| `reddit-watch` | every 15 min | Polls subs for keyword matches, drafts value-first reply, posts via Reddit API per quota |
| `x-thread` | daily 12:00 UTC | Posts daily thread via X API Free tier (500 posts/mo) |
| `aso-keyword-update` | weekly | Pulls App Store Connect rankings, swaps weakest keyword per locale |
| `dispute-auto-handler` | on Stripe webhook | Auto-refunds first-time disputes < $20; escalates rest |
| `weekly-digest` | Sun 18:00 UTC | Aggregates funnels + drop-offs, opens GH issues with Gemini-suggested patches |
| `health-check` | every 5 min | Hits `/api/health`; on fail, alerts + auto-rollback |
| `synthetic-analyze` | hourly | End-to-end probe with known PDF |
| `contract-tests` | nightly | Pings Gemini/Stripe/Supabase APIs to detect breaking changes |

## What the founder does (one-time setup, not staffing)

These are credential-provisioning steps that take an afternoon and
never recur:

1. ~~Buy domain~~ — using `printer-olive.vercel.app` until revenue.
2. ✅ Apple Developer (already have).
3. Provision API keys: **Gemini** (the critical one — aistudio.google.com,
   free, instant), Resend, Stripe (live, ✅ products already created),
   PostHog, Sentry, Pexels, Cloudflare Turnstile, TikTok Developer,
   IG Graph API, YouTube Data, Reddit, X Free tier, Apple Search Ads,
   Upstash Redis, Hugging Face (already authed via `justabdulaziz10`).
4. Set Google Cloud billing budget + hard cap on the Gemini API project.
5. Confirm no card on file at Supabase (= can't be billed).
6. Approve `KILL_SWITCH` env var defaults across Vercel + GitHub.
7. Stripe: set Business Name to "PaperLens" (unblocks Payment Links),
   enable Stripe Tax.

After that the system runs without further founder involvement except
for catastrophic alerts (Sentry P1, Stripe dispute > $500), platform
suspensions, and tax/legal mail. Expected: **~30 min/week** at steady
state.

## What is intentionally NOT in the plan

Channels excluded because they cannot be automated without
impersonation, TOS violations, or unrealistic ongoing review:

- Hacker News Show HN posts (no API, bot accounts banned)
- Product Hunt manual launches (needs hunter + live comment presence)
- 1:1 influencer DMs (replaced by self-serve affiliate program at
  `/affiliates`, payouts via Stripe Connect)
- Cold press pitches (replaced by SEO + paid)
- Live customer-support chat (replaced by AI email + AI in-app chat)

If a channel needs a human face, it is not here.

## 12-week build (every week ends with green CI on every change)

### Week 0 — CI/CD scaffold + spend safety (1 day)
- ✅ Stripe products live, Supabase schema, waitlist API.
- ✅ GitHub Actions CI/CD scaffold (`ci.yml`, `e2e.yml`, `secret-scan.yml`,
  `health-check.yml`, `cron-cost-cap.yml`, `dependabot.yml`).
- Founder sets Google Cloud billing budget cap on the Gemini project.
- All future PRs gated by green CI.

### Week 1 — Landing + waitlist + first crons
- ✅ Hero, demo loop, 3-step explainer, waitlist form on
  `printer-olive.vercel.app`.
- 5 locales: EN, ES, PT-BR, DE, FR.
- `cron-cost-cap` and `cron-lifecycle-emails` go live.
- Goal: 200 waitlist signups by end of week 1 from organic SEO seeding
  (Gemini generates 25 PSEO pages on day 1 to start indexing).

### Weeks 2-3 — Core analyze pipeline (free + paid tiers)
- Supabase Auth (email + Google OAuth) + Cloudflare Turnstile on signup.
- Per-user quota table; atomic decrement before any AI call.
- Upload flow: image or PDF, max 20MB, page-count gate.
- `lib/ai/Provider.ts` interface; `gemini.ts` and `claude.ts`
  implementations.
- Analysis pipeline:
  - OCR via vision model (one model, no Tesseract complexity)
  - Document classification (lease/insurance/medical/tax/etc.)
  - Per-class structured prompt → JSON: summary, risks, questions, terms
  - Render in user's locale with cultural context
- Follow-up Q&A on the parsed doc (cached context, prompt caching ON
  for Gemini path).
- Auto-purge uploads after analysis on free tier; 30 days on paid.

### Week 4 — Payments + 5 more locales
- Stripe Checkout + webhook → Supabase `subscriptions`.
- Customer portal on. Auto-refund cron on.
- Stripe Tax on. Business Name set.
- 5 more locales: IT, NL, PL, JA, KO.
- Soft launch via Resend campaign cron.

### Week 5 — iOS via Capacitor (Apple Dev already in hand)
- Capacitor wrap of the PWA → submit to App Store via
  App Store Connect API.
- Title/subtitle/keywords localized per locale (Gemini-generated).
- Screenshots auto-rendered via Playwright on GitHub Actions.

### Weeks 6-8 — Programmatic SEO autopilot
- `cron-generate-pseo-pages` engine: 5 new pages/week.
- Each page: 800-1200 words, embedded mini-analyzer, schema.org markup,
  hreflang. Gemini drafts; CI lints; LLM-as-judge quality gate; auto-merge.
- Affiliate program at `/affiliates` (Stripe Connect).

### Weeks 9-12 — Automated short-form + paid acquisition
- `cron-short-form-batch` produces 9 vertical videos/day on GitHub
  Actions runners (free for public repos).
- Once 30-day retention > 60%, paid unlocks: Apple Search Ads + Google
  UAC, both API-driven.

## Marketing playbook (all channels automated, all free)

| Channel | % of effort | Tools (all free tiers) |
|---------|-------------|------------------------|
| Programmatic SEO | 35% | Gemini (paid users only — system prompt cached) + GitHub Actions cron |
| App Store SEO | 25% | App Store Connect API + Google Play Dev API |
| Short-form video | 25% | Gemini script + **Edge TTS** + ShortGPT + Pexels + TikTok/IG/YT APIs |
| Reddit value posts | 5% | Reddit API + Gemini |
| Affiliate program | 10% | Stripe Connect |
| Paid (post-PMF) | 0% till MRR > $5K | Apple Search Ads API, Google Ads API |

20 priority locales: EN-US, EN-GB, ES, ES-MX, PT-BR, DE, FR, IT, NL,
PL, JA, KO, ZH-TW, TR, AR, HI, ID, VI, TH, RU. Skip ZH-CN (App Store
+ payments friction).

## Cost ceiling (with free-first stack)

| Phase | Hard cap | Source of cost |
|-------|----------|----------------|
| Pre-launch | **$0** | All free tiers; Apple Dev already paid |
| Months 1-2 | **$0–$10/mo** | Possibly paid Google for first dozen paying-tier analyses |
| Months 3-4 | **$5–$30/mo** | Gemini paid tier 1 covering paid-user volume; everything else still free |
| Months 5-6 | **$200/mo**, only if MRR > $5K | Google + maybe upgrade Resend |
| Year 2 | scales linearly with MRR; gross margin target ≥ 85% | Google + Stripe fees |

`cost-cap` cron + Google Cloud billing budget enforce the ceilings.
`Free user → Gemini` rule ensures free signups cannot cost us money.

## Kill criteria

- 200 waitlist signups by end of week 1: required.
- 50 paid users by end of week 4: required.
- $1K MRR by end of month 3: required, or pivot the wedge.
- 30-day paid retention > 60% by month 4: required, or freeze paid spend.

If kill criteria miss by >30%, founder flips `KILL_SWITCH=true` and
revisits. Don't grind on a dead pony.

## Honest limits of "free + automated forever"

- **No quality moat from the model itself.** We use Gemini 2.5 Flash
  for every tier; competitors can use the same model. The moat is
  localized SEO + recurring use + workflow polish, not raw AI quality.
  If Google deprecates the free tier we fall back to Hugging Face for
  free users without a code change.
- **Platform suspensions** still happen. Each platform has a human-only
  appeal flow. Budget 1-2 hours/quarter for appeals.
- **Stripe disputes > $500** auto-route to founder review.
- **Tax filings.** Stripe Tax handles VAT and US sales tax registrations
  in most jurisdictions; year-end filings need an accountant or TurboTax.
- **Apple/Google review rejections** sometimes need a written reply
  from the publisher. Gemini drafts; founder pastes.
- **Solo B2C** is harder than solo B2B: lower LTV, higher churn. We
  compensate with App Store SEO + programmatic SEO + low CAC.
- **$1M ARR in year 1 is rare.** Plan for $240K year 1 and the $1M
  trajectory in year 2.
- **Legal disclaimer:** PaperLens is **not** legal advice. Required in
  copy everywhere or we get sued, especially in EU (GDPR + consumer law).

The rest is automated, free, and indefinite.
