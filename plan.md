# Plan: Solo SaaS to $1M ARR

Adapted from the "$0 to $10K/month with Claude" thread. Honest version: the
stack below is ~one evening of setup. The remaining 11 weeks 50 months are
distribution, retention, and pricing. ARR comes from customers, not boilerplate.

## North star

- **12 months:** $10K MRR ($120K ARR) — this is the realistic stretch goal for
  a solo founder on a single product. It is the threshold that proves the
  wedge is real.
- **24 months:** $40K-80K MRR via either (a) raising price on the same wedge
  or (b) a second product against the same ICP.
- **$1M ARR ($83K MRR):** requires either an enterprise tier (5-10 logos at
  $1-2K/mo) or a portfolio of 3-4 micro-SaaS. Plan for it; do not promise it.

## Open questions (need answers before week 1)

1. **Niche / pain.** What specific workflow are we replacing, for whom?
   No answer = no project. Do not skip this to feel productive.
2. **ICP.** Who pays? B2B prosumer ($29-99/mo) is the default sweet spot for
   solo SaaS. B2C churns. Enterprise is too slow without a network.
3. **Distribution channel.** One channel, picked up front:
   SEO programmatic / X build-in-public / cold outbound / directories /
   integration marketplace. Pick one; the others are a distraction.

## Stack (locked — do not yak-shave)

| Layer        | Choice                          | Why                                  |
|--------------|---------------------------------|--------------------------------------|
| Boilerplate  | Open SaaS (Wasp)                | Auth + Stripe + admin in one command |
| DB / Auth    | Supabase                        | Free tier covers first 500 users     |
| Hosting      | Vercel                          | Push-to-deploy, free tier            |
| Payments     | Stripe                          | 2.9% + 30c, no fixed cost            |
| AI           | Anthropic API (claude-sonnet-4-6 default; opus-4-7 for hard tasks) | Cheapest path to a moat |
| Monitoring   | Sentry free tier                | Catch bugs before churn              |
| Email        | Resend or Loops                 | Cheap, transactional + lifecycle     |
| Analytics    | PostHog self-host or free tier  | Funnels + session replay             |

Skills to install in Claude Code on day 1:
`stripe`, `supabase`, `vercel`, `webapp-testing`, `mcp-builder`.

## 12-week execution plan

### Week 0 — Decide (2 days, no code)
- Write a 1-page brief: pain, ICP, willingness-to-pay evidence, channel.
- 10 customer-discovery conversations. No conversations = no build.
- Kill criterion: if 7/10 say "I'd just use a spreadsheet," pick a new pain.

### Week 1 — Foundation (one evening, per the tweet)
- `wasp new printer -t saas` (or whatever the product name becomes)
- `npx supabase init && npx supabase start`
- Wire Stripe in test mode. One $29/mo plan. No tiers yet.
- Deploy to Vercel on a real domain.
- Sentry + PostHog wired before any feature code.

### Weeks 2-3 — Build the wedge
- One workflow, end-to-end, that solves the pain from week 0.
- No settings page. No team accounts. No dark mode. No mobile app.
- Ship behind a waitlist on the landing page from day 1.

### Week 4 — Closed beta
- 10 design partners from the week-0 conversations. Free.
- Daily usage check-ins. If they don't open it in week 1, the wedge is wrong.
- Instrument: activation event, weekly active, time-to-value.

### Weeks 5-6 — Charge
- Turn on Stripe for new signups. Grandfather the 10 betas for 3 months.
- First paid customer is the only milestone that matters this month.
- Price at $49, not $29. It is easier to discount than to raise.

### Weeks 7-10 — One channel, hard
- Execute the channel chosen in week 0. No channel-hopping.
- Target: 1 qualified signup/day by end of week 10.
- Weekly: ship one improvement driven by a churned/cancelled user's reason.

### Weeks 11-12 — Decide what's next
- If MRR > $2K and growing 20%+ MoM: double down, hire a VA for support.
- If MRR < $500 after honest channel execution: pivot the wedge, keep the stack.
- If MRR is dead flat: the pain isn't acute. Go back to week 0.

## What "use every MCP" actually means

The tweet name-drops a lot of tools. Most are noise for week 1. Use them when
they remove a real bottleneck, not because they exist.

- **GitHub MCP** — yes, day 1. PRs, CI, issue triage.
- **Supabase MCP** — yes, once schema work begins. Migrations + types.
- **Stripe MCP** — only after first paying customer. Premature otherwise.
- **Vercel MCP** — yes, for deploy logs and runtime errors.
- **Sentry / PostHog** — via their dashboards, not MCPs, until volume justifies.
- **Notion / Gmail / Calendar / Figma / Lucid / Canva / HuggingFace MCPs** —
  skip unless the product specifically needs them.

Rule: an MCP earns its slot by replacing >30 min/week of manual work.

## Cost ceiling (kill switch)

| Month | Hard cap | If exceeded                       |
|-------|----------|-----------------------------------|
| 1-2   | $50      | Something is misconfigured. Stop. |
| 3-4   | $200     | Only if paying customers exist.   |
| 5-6   | $500     | Only if MRR > 3x burn.            |

Anthropic API spend is the line item most likely to surprise. Set a budget
alert at $50 on day 1. Cache aggressively. Default to Sonnet, not Opus.

## What this plan does NOT promise

- That the stack alone makes money. It does not.
- That AI features are a moat. They are table stakes in 2026.
- That $1M ARR happens in year 1 solo. It rarely does on a first product.
- That "launching" is the hard part. Distribution and retention are.

The honest version of the tweet: the tools compress 3 weeks of plumbing into
one evening, which means you get to the actually-hard part (finding people
who will pay) 3 weeks sooner. That is the whole edge. Use it.
