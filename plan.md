# Plan: PaperLens — Fully Automated Solo SaaS to $1M ARR

AI everyday-document explainer. Snap a photo of any official document
(lease, contract, insurance, medical bill, tax letter, government form);
get a plain-language summary in your language, flagged risks, suggested
questions, and benchmarks.

**Operating principle: zero hires, ever.** Build, marketing, support,
and ops all run on Claude + scheduled jobs + platform APIs. The founder
authorizes spend and provides credentials; everything else is on rails.

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
  tier ($14.99) for power users + a thin self-serve API for partners who embed
  PaperLens. Both ship as automated upgrades — no sales calls, no contracts.

## Stack (locked)

| Layer        | Choice                          |
|--------------|---------------------------------|
| Frontend     | Next.js 14 (App Router) + Tailwind |
| Auth         | Supabase Auth (email + Google + Apple) |
| DB           | Supabase Postgres               |
| Storage      | Supabase Storage (uploaded docs, auto-purge after 30d) |
| AI           | Anthropic API: claude-sonnet-4-6 default, opus-4-7 for hard parsing |
| Vision       | Claude vision (one model, fewer moving parts) |
| Payments     | Stripe (subscriptions + one-shot, Stripe Tax on for global VAT/sales tax) |
| Hosting      | Vercel                          |
| Cron         | Vercel Cron (drives all scheduled automation) |
| Email        | Resend (transactional + lifecycle + AI-replied inbound via inbound webhook) |
| Analytics    | PostHog                         |
| Errors       | Sentry                          |
| i18n         | next-intl                       |
| Content gen  | Claude API on a Vercel Cron, output committed to repo + redeployed |

Why Next.js, not the Wasp/Open SaaS template: i18n at scale (20+ locales,
programmatic SEO) is friction in Wasp and native in Next.js. We trade one
evening of saved auth for years of compounding SEO.

## Automation architecture

Everything that recurs is a Vercel Cron route under `/api/cron/*`,
authenticated with `CRON_SECRET`. Each route is idempotent and logs to
PostHog + Sentry.

| Cron route                        | Schedule           | What it does                                  |
|-----------------------------------|--------------------|-----------------------------------------------|
| `/api/cron/lifecycle-emails`      | every 1h           | Sends Day-N emails via Resend                 |
| `/api/cron/inbound-mail-reply`    | on Resend webhook  | Claude reads inbound, drafts + sends reply, logs to thread |
| `/api/cron/generate-pseo-pages`   | weekly Sun 03:00   | Generates 5 new locale×doc-type pages, opens auto-PR, auto-merges if lint passes |
| `/api/cron/refresh-pseo-pages`    | monthly            | Re-runs pages older than 90 days against latest model + data |
| `/api/cron/short-form-batch`      | daily 06:00 UTC    | Generates 9 platform-ready scripts + voiceover (ElevenLabs) + b-roll (stock API), pushes to Buffer / TikTok / IG / YT APIs |
| `/api/cron/reddit-watch`          | every 15m          | Polls subs for keyword matches, drafts value-first reply, posts via Reddit API per quota |
| `/api/cron/x-thread`              | daily 12:00 UTC    | Posts a daily thread via X API v2 (Basic tier, $200/mo, only after MRR > $5K) |
| `/api/cron/asa-budget-rebalance`  | daily 04:00 UTC    | Adjusts Apple Search Ads / Google UAC bids per locale ROAS via their APIs |
| `/api/cron/aso-keyword-update`    | weekly             | Pulls AppFigures rankings, swaps weakest keyword per locale |
| `/api/cron/dispute-auto-handler`  | on Stripe webhook  | Auto-refunds first-time disputes < $20; escalates rest to founder inbox |
| `/api/cron/cost-cap`              | hourly             | Pauses AI features if Anthropic spend > monthly cap |

Each cron route is one TypeScript file. Claude maintains them.

## What the founder does (one-time setup, not staffing)

These are not hires. They are credential-provisioning steps that take
minutes total and never recur:

1. Buy domain (paperlens.app, ~$12/yr at Cloudflare or Porkbun)
2. Sign up for Apple Developer ($99/yr) + Google Play ($25 one-time)
3. Provision API keys: Anthropic, Resend, Stripe (live), PostHog, Sentry,
   ElevenLabs, Buffer/Publer, TikTok Developer, IG Graph API, YouTube Data,
   Reddit, X API Basic, AppFigures, Apple Search Ads, Google Ads
4. Approve initial Vercel deploy + Supabase project (done)
5. Sign Stripe identity verification + enable Stripe Tax (one form)
6. Approve a monthly cost cap; the `/api/cron/cost-cap` route enforces it

After step 6 the system runs without further founder involvement except
for: (a) catastrophic alerts (Sentry pages > P1, Stripe dispute > $500),
(b) platform suspensions that require human appeal, (c) tax/legal mail.

## What is intentionally NOT in the plan (because it requires humans)

These channels are excluded — they cannot be automated without
impersonation, platform TOS violations, or unrealistic ongoing review:

- **Hacker News Show HN posts** — bot accounts get banned; no API. Skip.
- **Product Hunt manual launches** — requires a hunter and live comment
  presence. Skip; rely on programmatic SEO + paid ads instead.
- **1:1 influencer DMs and rev-share negotiations** — unsolicited DMs
  at scale get accounts banned. Replaced with: a public affiliate program
  (Stripe-native), influencers self-onboard via `/affiliates`, code +
  payouts handled by Stripe Connect + a cron.
- **Press pitches to journalists** — automated press email is spam and
  burns the domain reputation. Skip; SEO + ASO + paid is enough at
  $1M ARR scale.
- **Live customer-support chat** — replaced with AI email + in-app chat.
  90% of tickets resolve without escalation per industry baselines for
  document-AI niches; the other 10% queue to founder inbox with full
  context, draft reply, and "approve & send" link.

If a channel needs a human face, it is not in the plan. The plan still
gets to $1M because programmatic SEO + ASO + automated short-form +
paid acquisition (post-PMF) is mathematically sufficient at this LTV.

## 12-week build (every week is automated by week's end)

### Week 0 — Provision (1 day)
- Founder buys domain, creates dev accounts, drops API keys into Vercel.
- Claude writes `/api/cron/cost-cap` first so spend can never run away.

### Week 1 — Landing + waitlist + automation skeleton
- Next.js skeleton (done).
- Hero, demo loop, 3-step explainer, waitlist form (done).
- 5 locales live: EN, ES, PT-BR, DE, FR.
- Resend + PostHog wired. Lifecycle cron live.
- Goal: 200 waitlist signups by end of week 1 from organic SEO seeding
  (Claude generates 25 PSEO pages on day 1 to start indexing).

### Weeks 2-3 — Core product
- Supabase schema (done).
- Upload flow: image or PDF, max 20MB, virus-scan via Supabase Edge.
- Analysis pipeline:
  - OCR via Claude vision (one model, no Tesseract complexity)
  - Document classification (lease/insurance/medical/tax/etc.)
  - Per-class structured prompt → JSON: summary, risks, questions, terms
  - Render in user's locale with cultural context
- Follow-up Q&A on the parsed doc (cached context, prompt caching ON).
- Auto-purge uploads after 30 days. Privacy is a marketing weapon.

### Week 4 — Payments + polish
- Stripe products live (done): Free 3 docs/mo, Pro $6.99/mo, Power $14.99/mo, Lifetime $79.
- Checkout via Stripe Checkout, webhooks → Supabase `subscriptions` table.
- Stripe Tax on. Customer portal on. Auto-refund cron on.
- 5 more locales: IT, NL, PL, JA, KO.
- Soft launch to waitlist via Resend campaign (cron-triggered, segmented).

### Week 5 — App Store SEO
- Submit iOS + Android (PWA wrapped via Capacitor).
- Title/subtitle/keywords localized per locale via Claude, pushed via
  App Store Connect API + Google Play Developer API.
- Screenshots auto-rendered: a Next.js page renders the marketing
  screen, Playwright on Vercel screenshots it per device + locale,
  uploaded via the store APIs. Zero manual screenshot work.

### Weeks 6-8 — Programmatic SEO autopilot
- `/api/cron/generate-pseo-pages` is now the engine: 5 new pages/week
  forever, until 12×20 = 240 pages are live, then it switches to
  refreshing existing pages.
- Each page: 800–1200 words, embedded mini-analyzer, schema.org markup,
  hreflang. Claude drafts; CI lints; auto-merges if checks pass.
- Backlinks via the affiliate program, not guest-post outreach.

### Weeks 9-12 — Automated short-form + paid
- `/api/cron/short-form-batch` produces 9 vertical videos/day:
  Claude writes the script, ElevenLabs voices it, Pictory or
  ShortGPT renders the visuals, Buffer/Publer schedules to TikTok +
  IG Reels + YouTube Shorts via official APIs.
- Once 30-day retention > 60% (the kill criterion), turn on paid:
  Apple Search Ads + Google UAC, both API-driven, ROAS-rebalanced
  daily by `/api/cron/asa-budget-rebalance`.

## Marketing playbook (all channels automated)

### Channel mix at $5K MRR

| Channel              | % of effort | Automation                                  |
|----------------------|-------------|---------------------------------------------|
| Programmatic SEO     | 35%         | Weekly cron, 5 pages/week, auto-PR + merge  |
| App Store SEO        | 25%         | Weekly cron pushes metadata via store APIs  |
| Short-form video     | 25%         | Daily cron: script → voice → render → post  |
| Reddit value posts   | 5%          | Cron drafts + posts via Reddit API, throttled to comply with sub rules |
| Affiliate program    | 10%         | Stripe Connect + self-serve, no DMs         |
| Paid (post-PMF)      | 0% till MRR > $5K, then 10–25% | API-driven bid management |

### Localization stays the unfair advantage

Every page, every video script, every App Store listing is generated
per locale by Claude, not translated word-for-word. 20 locales:
EN-US, EN-GB, ES, ES-MX, PT-BR, DE, FR, IT, NL, PL, JA, KO, ZH-TW,
TR, AR, HI, ID, VI, TH, RU. Skip ZH-CN (App Store + payments friction).

### Lifecycle email sequence (Resend, AI-replied inbound)

1. Day 0: Welcome + first analysis tip
2. Day 1: "Most users miss this clause type — try it on your X"
3. Day 3: Social proof + upgrade nudge
4. Day 7: Free quota almost gone → Pro
5. Day 14: Second-doc reminder (recurrence is the retention lever)
6. Day 30: Anniversary + referral ask
7. Day 60: Win-back if inactive 30 days
8. Cancellation flow: one-question survey, AI replies, AI logs to PostHog

Replies to the founder address are handled by `/api/cron/inbound-mail-reply`:
Claude drafts, sends, logs. Disputes / legal / press route to a separate
inbox that the founder reviews on a weekly schedule (15 min/week).

### Public content cadence (fully automated)

- 9 short-form videos/day across TikTok + IG Reels + YT Shorts
- 1 long-form YouTube/week (Claude script → ElevenLabs voice → ShortGPT
  render → YouTube Data API upload)
- 10 Reddit value-first comments/week, throttled per subreddit
- 1 X thread/day (only after X API Basic is provisioned)
- 1 LinkedIn post/week via LinkedIn Marketing API

No founder posting. No VA. No agency.

## Cost ceiling

| Phase      | Hard cap          |
|------------|-------------------|
| Pre-launch | $150 (domain, dev accounts) |
| Months 1–2 | $80/mo (Anthropic, Vercel, Resend, ElevenLabs starter) |
| Months 3–4 | $400/mo (add X API Basic, paid render credits) |
| Months 5–6 | $1.5K/mo, only if MRR > $5K (paid acquisition unlocks) |

`/api/cron/cost-cap` enforces these limits. If Anthropic burn > monthly
cap by hour-prorated check, free-tier analyses fall back to a smaller
model and paid-tier requests are queued.

Anthropic spend is the single line that can run away. Mitigations:
- Prompt caching on system prompt + per-doc analysis context
- Sonnet by default; Opus only on long contracts > 10 pages
- Server-side rate limit on free tier (3 docs/mo enforced in Postgres)
- Cost cap cron above

## Kill criteria

- 200 waitlist signups by end of week 1: required.
- 50 paid users by end of week 4: required.
- $1K MRR by end of month 3: required, or pivot the wedge.
- 30-day paid retention > 60% by month 4: required, or freeze paid spend.

If kill criteria miss by >30%, the founder pauses the system (a single
env var flag turns off all crons) and decides on a pivot. Don't grind
on a dead pony.

## Honest limits of "automated forever"

- **Platform suspensions happen.** TikTok, IG, YouTube, Reddit, X, and
  the App Stores all reserve the right to suspend accounts. Each one
  has a human-only appeal flow. Budget 1–2 hours/quarter for appeals.
  This is the irreducible founder time.
- **Stripe disputes over $500** auto-route to founder review because
  contesting them well needs human judgement on the specific case.
- **Tax filings.** Stripe Tax handles VAT and US sales tax registrations
  in most jurisdictions, but year-end filings (US federal, your country
  of residence) need an accountant or TurboTax — not "hiring" in any
  meaningful sense, but a once-a-year action.
- **Apple/Google review rejections** sometimes need a written reply
  from the publisher account holder. Claude drafts; founder pastes into
  the review portal.
- **Solo B2C** is harder than solo B2B: lower LTV, higher churn. We
  compensate with App Store SEO + programmatic SEO + low CAC.
- **$1M ARR in year 1 on a first product is rare.** Plan for $240K
  year 1 and the $1M trajectory in year 2 with the Power tier + API.
- **Legal disclaimer:** PaperLens is **not** legal advice. Required in
  copy everywhere or we get sued, especially in EU (GDPR + consumer law).

The rest is automated, indefinitely.
