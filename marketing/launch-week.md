# Launch Week — fully automated, day by day

Assumes the product is functional, payments live, 5 locales shipped,
waitlist has 200+ signups, all crons + API tokens are in Vercel env.

**No `[HUMAN]` tasks. Every action below is a cron job, an API call, or
a one-off script that runs unattended.** The founder is asleep.

## Pre-launch (Sunday before)

- `/api/cron/short-form-batch` runs daily for 7 days prior, building a
  21-clip backlog scheduled to post Mon–Sun via TikTok / IG / YT APIs.
- `/api/cron/lifecycle-emails` is verified against Resend's preview API
  so the Monday "It's ready" wave fires correctly.
- Sentry, Vercel Analytics, Polar webhooks confirmed firing (synthetic test in
  `/api/health` hit by an external uptime cron).
- Load test: GitHub Action `load-test.yml` runs k6 against
  `/api/analyze` at 50 concurrent uploads, fails the deploy if p95 > 8s.

## Monday — Waitlist activation

- 09:00 UTC: Resend campaign cron fires "It's ready" email,
  segmented by locale (5 locales = 5 templates, all Gemini-authored).
- 12:00 UTC: X API cron posts a launch thread (queued; if X API not
  yet provisioned this step is skipped without blocking).
- 15:00 UTC: Reddit cron posts to r/personalfinance with a value-first
  format (post body + first comment with PaperLens mention) per
  subreddit rules; throttle = 1 sub/day.
- 18:00 UTC: First short-form clip auto-publishes (TikTok + Reels + Shorts).
- Inbound email replies are handled by `/api/cron/inbound-mail-reply`:
  Gemini drafts + sends within 5 minutes of receipt; threads logged in
  Supabase `support_threads` table.

Target: 50 paid conversions from waitlist (25% of 200).

## Tuesday — Compounding day

- Reddit cron posts to one new sub per day (auto-rotates among
  r/legaladvice, r/de, r/brasil, r/india, r/expats), all value-first.
- 3 short-form clips publish (one per platform, staggered 4 hrs apart).
- 5 new programmatic SEO pages auto-merge to main and deploy
  (`/api/cron/generate-pseo-pages` runs nightly during launch week).
- AI in-app chat (Gemini on `/api/chat`) handles all incoming questions
  with full doc context; escalates to founder inbox only if (a) refund
  request > $79, (b) legal/press keyword detected, (c) Gemini
  confidence < 0.6.

## Wednesday — Reddit + forums

- Reddit cron rotates through 5 subs today (still throttled, still
  value-first; spam = ban). Posts include locale-specific tracks for
  r/de, r/brasil, r/india.
- 3 short-form clips publish.
- The X cron (if enabled) reposts Monday's thread with new metrics
  from Vercel Analytics.

Rule encoded in the cron: every post is 80% value, 20% mention. Mods
ban promo-first; the prompt enforces ratio + checks subreddit rules
embedded as JSON in the cron's config.

## Thursday — Affiliate program goes live

- `/affiliates` page deploys: a self-serve form where any influencer
  signs up, gets a `?ref=` link tied to a Polar affiliates account, and
  earns 30% rev-share for 6 months on referred signups.
- Cron posts the affiliate launch announcement to TikTok / Reels /
  Shorts and to relevant subs; influencers self-onboard.
- No 1:1 DMs are sent — they would get the brand-new account banned
  on every platform, and they require human relationship work.

## Friday — Press? No.

- Press pitches are intentionally not in the playbook. They require
  human relationships and burn the domain reputation if automated.
- Instead: a press kit page (`/press`) goes live (auto-generated:
  founder photo placeholder, screenshots, key metrics from Vercel Analytics,
  one-line pitch in 5 locales). Journalists who find us via SEO get
  what they need without an outbound email.

## Weekend — Watch and learn (also automated)

- A Vercel Cron `weekly-digest` runs Sunday 18:00 UTC: aggregates
  Vercel Analytics counters, finds the top 3 drop-off points, drafts a fix list,
  opens GitHub issues against `main` with Gemini-suggested patches.
- The founder reads the digest email on Sunday evening (~15 min) and
  approves the issues to merge.

## Decision after launch week

- > 100 paid: increase paid-ad cap by 2x via env var. Cron rebalances.
- 50–100 paid: keep the cron schedule unchanged for 4 more weeks.
- < 50 paid: founder flips `KILL_SWITCH=true` env var. All crons pause.
  Time to revisit the wedge — typically a product-fit issue, not marketing.

## What blew up (real, not theoretical) and how the system handles it

| Failure                          | Auto-handler                                  |
|----------------------------------|-----------------------------------------------|
| TikTok API returns 429           | Cron backs off 1h, retries; alerts after 3 fails |
| Resend bounce rate > 5%          | Cron pauses outbound, opens Sentry issue      |
| Reddit account shadowbanned      | Cron detects via reply-visibility check, opens issue, founder appeals |
| Polar dispute > $500            | Auto-routes to founder inbox with draft reply |
| Gemini spend > daily cap      | Free tier auto-falls back to Hugging Face; paid analyses queue |
| Sentry error rate > 1%           | Auto-rollback last deploy if introduced today |

The only steps requiring the founder are platform appeals and Polar
disputes > $500 — totaling under 30 min/week at steady state.
