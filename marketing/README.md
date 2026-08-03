# Marketing assets

All copy, scripts, and playbooks for PaperLens launch and ongoing growth.
**Everything in this folder is generated, scheduled, and posted by
automation — no humans, no hires.**

| File                       | Use                                              |
|----------------------------|--------------------------------------------------|
| short-form-scripts.md      | TikTok / Reels / Shorts daily scripts (cron-posted) |
| seo-strategy.md            | Programmatic SEO (240 pages) + App Store SEO     |
| launch-week.md             | Day-by-day public launch plan (all cron-driven)  |
| lifecycle-emails.md        | Resend email sequence + AI inbound reply         |

## How automation runs everything

| Surface        | Generator   | Scheduler          | Publisher API           |
|----------------|-------------|--------------------|-------------------------|
| Short-form video | Gemini script + ElevenLabs voice + ShortGPT/Pictory render | Vercel Cron daily 06:00 UTC | TikTok Content Posting API, IG Graph API, YouTube Data API |
| Long-form YT   | Gemini     | Cron weekly        | YouTube Data API         |
| Reddit posts   | Gemini     | Cron every 15m, throttled per sub rules | Reddit API              |
| X threads      | Gemini     | Cron daily 12:00   | X API v2 Basic ($200/mo, only after MRR > $5K) |
| LinkedIn       | Gemini     | Cron weekly        | LinkedIn Marketing API   |
| Lifecycle email | Gemini    | Cron hourly        | Resend                   |
| Inbound email reply | Gemini | Resend webhook     | Resend                   |
| PSEO landing pages | Gemini | Cron weekly Sun 03:00 | Git PR + auto-merge → Vercel deploy |
| App Store metadata | Gemini | Cron weekly        | App Store Connect API + Google Play Developer API |
| Paid bid management | Cron logic on Vercel Analytics + analyze_calls SQL | Cron daily 04:00 | Apple Search Ads API, Google Ads API |

## What the founder provides, once

API keys for: Gemini (Google AI Studio), Resend, Polar.sh, Sentry,
ElevenLabs, Buffer/Publer, TikTok Developer, IG Graph API,
YouTube Data, Reddit, X (when ready), AppFigures, Apple Search Ads,
Google Ads. Plus Apple Developer ($99/yr) + Google Play ($25 once).

Then: nothing. The founder reviews a weekly digest in 15 minutes.

## Channels intentionally excluded (cannot be automated)

These are **not** in the strategy because they require a real human
presence and would burn the brand if faked:

- Hacker News Show HN (no API, bot accounts banned)
- Product Hunt manual launches (needs a hunter + live comment presence)
- 1:1 influencer DMs (replaced by a self-serve affiliate program at
  `/affiliates`, payouts via Polar affiliates)
- Cold press pitches (replaced by SEO + paid)
- Live customer-support chat (replaced by AI email + AI in-app chat)

If a channel needs a human face, it is not here.

## What automation does not cover (the irreducible founder minutes)

- Platform-suspension appeals (1–2 hrs/quarter expected)
- Polar disputes > $500 auto-route to founder inbox with a draft reply
- Apple/Google review rejections that need a written reply
- Tax filings (annual; Polar tax handling handles VAT collection automatically)
- Initial credential provisioning (one afternoon, once)

Total expected ongoing founder time post-setup: **~30 min/week**.
