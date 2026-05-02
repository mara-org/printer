# Plan: PaperLens — Solo B2C SaaS to $1M ARR

AI everyday-document explainer. Snap a photo of any official document
(lease, contract, insurance, medical bill, tax letter, government form);
get a plain-language summary in your language, flagged risks, suggested
questions, and benchmarks.

## Why this niche

| Criterion                  | PaperLens                                              |
|----------------------------|--------------------------------------------------------|
| Universal pain             | Every adult signs documents they do not fully read     |
| Worldwide                  | Non-English markets are massively underserved          |
| AI-native moat             | Vision + LLM + multilingual; impossible pre-2024       |
| Repeat use                 | Leases, jobs, doctors, tax, school — life events recur |
| B2C price fit              | $6.99/mo or $1.99/doc — global purchasing-power-aware  |
| Solo-buildable             | Single-screen UX: upload, read, ask follow-ups         |
| Distribution surface       | App Store SEO + programmatic SEO + short-form video    |

Killer detail: **localized landing pages in 20+ languages.** A renter in Berlin
googling "Mietvertrag erklären" or in São Paulo searching "explicar contrato
de aluguel" finds us, not a US-only tool. This is the wedge.

## North star

- **Month 6:** $5K MRR (~700 paid users at $6.99)
- **Month 12:** $20K MRR ($240K ARR)
- **Month 24:** $80K MRR ($960K ARR) via tiered pricing + app store + B2C
  partnerships (real-estate platforms, immigration services, tax prep)
- **$1M ARR path:** B2C alone gets us to ~$500K. The second $500K is a Pro
  tier ($14.99) for power users + a thin B2B API for partners who embed
  PaperLens. Not a pivot — an expansion.

## Stack (locked)

| Layer        | Choice                          |
|--------------|---------------------------------|
| Frontend     | Next.js 14 (App Router) + Tailwind |
| Auth         | Supabase Auth (email + Google + Apple) |
| DB           | Supabase Postgres               |
| Storage      | Supabase Storage (uploaded docs, auto-purge after 30d) |
| AI           | Anthropic API: claude-sonnet-4-6 default, opus-4-7 for hard parsing |
| Vision       | Claude vision (one model, fewer moving parts) |
| Payments     | Stripe (subscriptions + one-shot) |
| Hosting      | Vercel                          |
| Email        | Resend (transactional + lifecycle) |
| Analytics    | PostHog                         |
| Errors       | Sentry                          |
| i18n         | next-intl                       |

Why Next.js, not the Wasp/Open SaaS template from the thread: i18n at scale
(20+ locales, programmatic SEO) is friction in Wasp and native in Next.js.
We trade one evening of saved auth for years of compounding SEO.

## What I (Claude) will and will not do

**Will, locally and reversibly:**
- Scaffold the Next.js app, landing page, auth flow, upload + analyze
  pipeline, Stripe webhook, i18n routing, App Store / Play Store metadata
- Draft all marketing copy: 20 localized landing pages, App Store
  descriptions, TikTok/Reels scripts, Reddit posts, influencer outreach
  templates, lifecycle emails, paid-ad copy
- Build the analytics + experimentation harness so you can A/B test
- Commit and push everything to `claude/aar-project-setup-XTWvS`

**Will, only after you approve each one:**
- Create a Supabase project (your account, your billing)
- Create a Vercel project + connect domain
- Create Stripe products + price IDs
- Configure Resend domain
- Push App Store / Play Store builds (requires your developer accounts,
  $99 + $25 one-time)

**Will not do, full stop:**
- Post on social media as you
- Send cold emails to real people from your domain
- Run paid ads with your card
- Buy domains
- Anything that costs money or speaks publicly under your identity

The marketing plan below is real and detailed. Executing it requires you
(or someone you hire) to be the human in the loop for posting, talking to
customers, and authorizing spend. I am the engine; I am not the face.

## 12-week build

### Week 0 — Validate (3 days, before any code)
- 20 cold DMs to renters / freelancers / immigrants asking: "When was the
  last time you signed a document you did not fully understand? What did
  you do?" If <12/20 say "signed it anyway" or "asked a friend," kill it.
- Buy domain (paperlens.app or similar). $12.
- Set up: GitHub repo (done), Linear or GitHub Projects, Sentry, PostHog.

### Week 1 — Landing + waitlist
- Next.js skeleton (laid down in this commit).
- Hero, demo video placeholder, 3-step explainer, waitlist form.
- 5 locales live: EN, ES, PT-BR, DE, FR. Translated by Claude, reviewed.
- Deploy to Vercel. Plausible/PostHog wired before any traffic.
- Goal: 200 waitlist signups by end of week 1 from organic seeding.

### Weeks 2-3 — Core product
- Supabase schema: users, documents, analyses, subscriptions.
- Upload flow: image or PDF, max 20MB, virus-scan via Supabase Edge.
- Analysis pipeline:
  - OCR via Claude vision (one model, no Tesseract complexity)
  - Document classification (lease/insurance/medical/tax/etc.)
  - Per-class structured prompt → JSON: summary, risks, questions, terms
  - Render in user's locale with cultural context (e.g., US tenancy law
    differs from German Mietrecht)
- Follow-up Q&A on the parsed doc (cached context, prompt caching ON).
- Auto-purge uploads after 30 days. Privacy is a marketing weapon here.

### Week 4 — Payments + polish
- Stripe: free (3 docs/mo), Pro ($6.99/mo, unlimited), Lifetime ($79).
- Add 5 more locales: IT, NL, PL, JA, KO.
- Sentry + PostHog funnels: upload → analysis → first follow-up → paywall.
- Soft launch to waitlist. Goal: 50 paid by end of week 4.

### Week 5 — App Store SEO
- Submit iOS + Android (PWA wrapped via Capacitor — fastest solo path).
- App Store keyword research per locale. Title/subtitle optimized per
  language, not translated word-for-word.
- 30 screenshots per store, localized.
- $99 + $25 in dev account fees. This is the only fixed cost worth it.

### Weeks 6-8 — Programmatic SEO
- Generate landing pages: `/[locale]/explain/[document-type]`
  e.g. `/de/erklaeren/mietvertrag`, `/es-mx/explicar/contrato-de-arrendamiento`
- 12 doc types × 20 locales = 240 landing pages, each with a free
  in-page mini-analyzer (no signup) → upgrade prompt.
- Submit sitemap. Build backlinks via 3 guest posts on tenant-rights /
  immigrant / personal-finance blogs per week.

### Weeks 9-12 — Short-form video + influencers
- 30 TikTok/Reels scripts, hooks like:
  - "Things your landlord hopes you don't read in your lease"
  - "I scanned my insurance policy and found out…"
  - "The clause that auto-renews your gym at 2x price"
- Daily post cadence on TikTok, IG Reels, YouTube Shorts.
- Reach out to 50 micro-influencers (10K-100K) in finance / legal /
  immigrant creators, offer 30% rev-share for 6 months.

## Worldwide marketing playbook (post-launch)

### Channel mix and budget at $5K MRR

| Channel              | % of effort | Why                                |
|----------------------|-------------|------------------------------------|
| Programmatic SEO     | 35%         | Compounds; localizable; cheap      |
| App Store SEO        | 25%         | High intent; $0 CAC                |
| TikTok/Reels organic | 20%         | B2C virality engine in 2026        |
| Reddit + forums      | 10%         | High-intent, niche communities     |
| Micro-influencers    | 10%         | Rev-share, no upfront              |
| Paid ads             | 0% till MRR > $10K | Don't pay for traffic before retention works |

### Localization is the unfair advantage

Every competitor is English-first and "translates" via Google Translate.
We commission native review for the top 20 languages and treat each as a
separate product surface. A page in Polish ranks for Polish queries with
zero competition.

20 priority locales (in launch order):
EN-US, EN-GB, ES, ES-MX, PT-BR, DE, FR, IT, NL, PL, JA, KO, ZH-TW,
TR, AR, HI, ID, VI, TH, RU.

Skip ZH-CN initially (App Store complexity, payment friction).

### Lifecycle email sequence (Resend)

1. Day 0: Welcome + first analysis tip
2. Day 1: "Most users miss this clause type — try it on your X"
3. Day 3: Social proof + upgrade nudge
4. Day 7: Free quota almost gone → Pro
5. Day 14: Second-doc reminder (recurrence is the retention lever)
6. Day 30: Anniversary + referral ask

### Public content cadence (you or a VA, not me)

- 3 short-form videos/day across TikTok + Reels + Shorts (batched weekly)
- 1 long-form YouTube/week ("I analyzed 50 leases — here's what's hidden")
- 2 Reddit answers/day in r/personalfinance, r/legaladvice, r/insurance,
  localized subs (r/de, r/france, r/mexico, r/india)
- 1 tweet/day, 1 LinkedIn post/week

I will draft every script, post, and reply template. A human posts.

## Cost ceiling

| Phase      | Hard cap          |
|------------|-------------------|
| Pre-launch | $150 (domain, dev accounts) |
| Months 1-2 | $50/mo (Anthropic, Vercel, Resend free tiers) |
| Months 3-4 | $300/mo            |
| Months 5-6 | $1K/mo, only if MRR > $5K |

Anthropic spend is the line to watch. Mitigations:
- Prompt caching on system prompt + per-doc analysis context
- Sonnet by default; Opus only on long contracts > 10 pages
- Server-side rate limit free tier to prevent abuse

## Kill criteria

- 200 waitlist signups by end of week 1: required.
- 50 paid users by end of week 4: required.
- $1K MRR by end of month 3: required, or pivot the wedge.
- 30-day paid retention > 60% by month 4: required, or fix product before
  spending on growth.

If kill criteria miss by >30%, pause and rethink. Don't grind on a dead pony.

## Honest limits of this plan

- Solo B2C is harder than solo B2B: lower LTV, higher churn, fickle taste.
  We compensate with App Store SEO + programmatic SEO + low CAC.
- Worldwide localization sounds like leverage; it's also 20× the QA surface.
  Stage rollout: 5 locales week 1, 10 by week 4, 20 by week 12.
- $1M ARR in year 1 solo on a first product: rare. Plan for $240K year 1
  and the $1M trajectory in year 2 with the Pro tier and partner API.
- Apple/Google reviews can reject. Have a web-only fallback ready (PWA).
- Legal disclaimer: PaperLens is **not** legal advice. Required in copy
  everywhere or we get sued, especially in EU (GDPR + consumer law).
