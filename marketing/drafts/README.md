# Distribution drafts

Auto-generated daily by `.github/workflows/cron-marketing-drafts.yml` via
`scripts/marketing-draft.mjs`. Each `<YYYY-MM-DD>.json` file contains:

- `reddit_replies` — 5 value-first reply drafts targeted at specific
  subreddits + thread types. The founder finds a matching live thread
  (or skips) and posts manually.
- `x_thread` — one daily thread (5–7 tweets, ≤270 chars each).

Drafts are intentionally **not** posted automatically. Reddit and X
account integrity is more valuable than the time saved by auto-posting.

To re-run today's draft, delete `marketing/drafts/<today>.json` and re-run
the workflow via the GitHub Actions tab → "cron-marketing-drafts" → "Run
workflow".
