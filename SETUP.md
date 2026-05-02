# SETUP — what only you can do

This is the complete list of one-time clicks you (the founder) need to
make. After everything in this file is done, the system runs on rails
forever and Claude can ship the rest of the product without further
account-creation steps.

Everything is **free** unless explicitly noted. Total spend after this
setup is $0–$30/mo until paid users justify upgrading individual pieces.

## How to use this doc

1. Go down each section in order.
2. After completing a section, paste the values into the **hand-off
   block at the bottom** (or just edit it in place and ping me).
3. When the hand-off block is filled, send it back. I'll wire everything
   into Vercel env + GitHub Secrets and ship the next sprint.

Keys you paste into me are immediately added to Vercel as encrypted env
vars; they never get committed to the repo.

---

## 0. Already done ✅

- Vercel project `printer` deployed at https://printer-olive.vercel.app
- Supabase project `paperlens` (free tier) + schema applied
- Stripe live products + prices created
- Apple Developer account ($99/yr, paid)
- GitHub repo public; CI/CD wired
- Branch: `claude/aar-project-setup-XTWvS`

---

## 1. Google AI Studio — Gemini API key (CRITICAL, ~2 min)

This unlocks the analyze pipeline.

1. Go to https://aistudio.google.com/app/apikey
2. Sign in with the Google account you want billed.
3. Click **"Create API key"** → choose "Create API key in new project"
   (or pick an existing project — keep it dedicated to PaperLens for
   clean billing).
4. Copy the key (starts with `AIza...`).
5. Optional but recommended: rename the project to `paperlens-ai`.

**Hand off:** `GEMINI_API_KEY = AIza...`

## 2. Google Cloud Console — billing budget cap (CRITICAL, ~3 min)

This is the absolute spend ceiling. Without it, a runaway bug or abuse
could rack up Gemini paid-tier charges.

1. Go to https://console.cloud.google.com/billing
2. Pick the project you used in step 1 (`paperlens-ai`). If no billing
   account is linked yet, link/create one — Gemini's free tier still
   works without a card, but the safer path is to attach a card AND set
   the cap, so you get the higher paid-tier rate-limits the moment you
   hit free-tier quota.
3. Go to **Budgets & alerts** → **Create budget**:
   - Name: `paperlens-cap`
   - Amount: `$30/month` (adjust later)
   - Alerts: 50%, 90%, 100% (default)
   - **CHECK** "Cap project at 100% of budget" (this is the real cap)
4. Save.

Nothing to hand off for this — it's a setting, not a key.

## 3. Hugging Face — fallback inference token (~1 min)

Already authed via `justabdulaziz10`. Just generate a token.

1. Go to https://huggingface.co/settings/tokens
2. Click **"Create new token"** → type **"Read"** (or "Fine-grained" with
   `Inference` permission).
3. Copy the token (starts with `hf_...`).

**Hand off:** `HUGGINGFACE_TOKEN = hf_...`

## 4. Supabase — service role key + storage check (~2 min)

The service role key lets the server insert into `analyze_calls` and
flip kill switches. Treat it like a password — Vercel env only, never
in code, never in browser.

1. https://supabase.com/dashboard/project/qcrrfisswbaecuipcatr/settings/api
2. Copy **"service_role" key** (NOT the anon key).
3. Confirm **no card on file** at /settings/billing — free tier auto-caps.
4. (Optional) Confirm storage bucket `documents` exists at /storage/buckets
   (it should — I created it in the latest migration).

**Hand off:** `SUPABASE_SERVICE_ROLE_KEY = eyJ...`

## 5. Cloudflare Turnstile — bot protection (~3 min)

1. Go to https://dash.cloudflare.com/?to=/:account/turnstile
2. Click **Add site**:
   - Site name: `paperlens`
   - Domains: `printer-olive.vercel.app` (add your custom domain later)
   - Widget mode: **Managed**
3. Copy the **Site key** and **Secret key**.

**Hand off:**
- `NEXT_PUBLIC_TURNSTILE_SITE_KEY = 0x4AA...`
- `TURNSTILE_SECRET_KEY = 0x4AA...`

## 6. Upstash Redis — rate limiting + caches (~2 min)

1. https://console.upstash.com/redis → **Create database**
2. Name: `paperlens-rl`, Region: closest to your Vercel deploy
   (`us-east-1` to match Supabase), TLS on, **Free** plan.
3. After creation, click the database → **REST API** tab.
4. Copy `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`.

**Hand off:**
- `UPSTASH_REDIS_REST_URL = https://...upstash.io`
- `UPSTASH_REDIS_REST_TOKEN = ...`

## 7. Resend — email (transactional + lifecycle) (~3 min)

1. https://resend.com/signup
2. **API keys** → **Create API key** → "Sending access" → name it `paperlens-prod`.
3. Copy the key (starts with `re_...`).
4. (Domain verification waits until you buy `paperlens.app`. Until then,
   Resend will send from `onboarding@resend.dev` which is fine for waitlist.)

**Hand off:** `RESEND_API_KEY = re_...`

## 8. Stripe — finish the account (~5 min)

Products are already created. Three things still missing:

1. https://dashboard.stripe.com/settings/account → set **Business name**
   to `PaperLens` (this unblocks Payment Links and Customer Portal).
2. https://dashboard.stripe.com/settings/tax → **Enable Stripe Tax**.
   Confirm jurisdictions Stripe suggests; it will auto-collect VAT/sales
   tax going forward.
3. Get the **secret key**:
   - https://dashboard.stripe.com/apikeys
   - Reveal **"Secret key"** under Standard keys (starts with `sk_live_...`).
4. We'll add the webhook endpoint after the next sprint
   (`/api/stripe/webhook`); ignore the webhook signing secret for now.

**Hand off:** `STRIPE_SECRET_KEY = sk_live_...`

## 9. Sentry — error monitoring (~2 min)

1. https://sentry.io/signup → free tier (5K events/mo).
2. **Create project** → platform: **Next.js** → name: `paperlens`.
3. Copy the **DSN** (looks like `https://...@...ingest.sentry.io/...`).

**Hand off:** `SENTRY_DSN = https://...@sentry.io/...`

## 10. PostHog — product analytics (~2 min)

1. https://posthog.com/signup → free tier (1M events/mo).
2. Choose **EU** or **US** region (US is fine, lower latency).
3. After project creation, copy the **Project API Key**
   (starts with `phc_...`) and the **Host URL** (`https://us.i.posthog.com`).

**Hand off:**
- `NEXT_PUBLIC_POSTHOG_KEY = phc_...`
- `NEXT_PUBLIC_POSTHOG_HOST = https://us.i.posthog.com`

## 11. Pexels — free stock b-roll for short-form video (~1 min)

1. https://www.pexels.com/api/new/ → request API key (instant).
2. Copy the key.

**Hand off:** `PEXELS_API_KEY = ...`

## 12. GitHub repo Secrets (~3 min)

These power the GitHub Actions crons.

1. https://github.com/mara-org/printer/settings/secrets/actions
2. Add **CRON_SECRET** = a random 32-byte hex string. Generate one with:
   `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
   You'll paste the SAME value into Vercel env in the next section.

**Hand off:** `CRON_SECRET = <hex>`

Also: enable branch protection on `main`:
- Settings → Branches → Add rule for `main`
- Require status checks: `typecheck`, `lint`, `test`, `build`, `gitleaks`
- Require linear history
- Restrict pushes (only via PR)

## 13. Vercel — deployment protection + spend cap (~2 min)

1. https://vercel.com/abdulazizs-projects-cb679bdc/printer/settings/deployment-protection
   → set **Vercel Authentication** to **Disabled** (so the site is public).
2. https://vercel.com/abdulazizs-projects-cb679bdc/settings/billing
   → **Spend Management** → set monthly hard cap to e.g. **$20**.

Nothing to hand off here — both are settings.

---

## Phase 2 — social platforms (later, when scheduling content)

These come into play in week 9+. You don't need them to ship the MVP.
Listed here so you can budget the time later:

- **TikTok Developer**: https://developers.tiktok.com — register a sandbox
  app, get production review for Content Posting API (~3 days back-and-forth).
- **Meta (Instagram + Facebook) Developer**: https://developers.facebook.com
  — Business account, Graph API token with `instagram_content_publish`.
- **YouTube Data API v3**: https://console.cloud.google.com/apis/library/youtube.googleapis.com
  — enable on the same `paperlens-ai` project, OAuth consent screen.
- **Reddit API**: https://www.reddit.com/prefs/apps → script-type app.
- **X (Twitter) Free tier**: https://developer.x.com/en/portal — 500 posts/mo.
- **LinkedIn Marketing API**: https://www.linkedin.com/developers/.

---

## Hand-off block (copy this back to me, filled)

When you've done sections 1–13, paste this filled block into the chat
and I'll wire everything into Vercel + GitHub.

```
GEMINI_API_KEY=
HUGGINGFACE_TOKEN=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_TURNSTILE_SITE_KEY=
TURNSTILE_SECRET_KEY=
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
RESEND_API_KEY=
STRIPE_SECRET_KEY=
SENTRY_DSN=
NEXT_PUBLIC_POSTHOG_KEY=
NEXT_PUBLIC_POSTHOG_HOST=
PEXELS_API_KEY=
CRON_SECRET=

DONE_GOOGLE_CLOUD_BUDGET_CAP=yes/no
DONE_STRIPE_BUSINESS_NAME=yes/no
DONE_STRIPE_TAX_ENABLED=yes/no
DONE_GITHUB_BRANCH_PROTECTION=yes/no
DONE_VERCEL_DEPLOYMENT_PROTECTION_DISABLED=yes/no
DONE_VERCEL_SPEND_CAP=yes/no
DONE_SUPABASE_NO_CARD=yes/no
```

Don't worry if some keys aren't ready in one go — paste what you have,
mark the rest TODO, and I'll work with what's available. The minimum
to ship the analyze pipeline is:

- `GEMINI_API_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `CRON_SECRET`
- (DONE) Google Cloud budget cap
- (DONE) Vercel deployment protection disabled

Everything else can ship in the following sprint.

---

## What I'll do once you hand back

When the block above arrives, I will:

1. Add every key to Vercel project env (production scope).
2. Add `CRON_SECRET` to GitHub repo Secrets.
3. Trigger a redeploy.
4. Run `curl https://printer-olive.vercel.app/api/health` to confirm.
5. Run a smoke test against `/api/analyze` with a known PDF.
6. Commit a `STATUS.md` recording what's wired and verified.
7. Start the next sprint:
   - `/upload` UI page (drag-drop + Turnstile + signed URL)
   - `/dashboard` (analysis history)
   - `/pricing` + Stripe Checkout + webhook handler
   - Auth pages (sign-in / sign-up with Supabase Auth)
   - Resend transactional email integration

After that sprint, the product is end-to-end functional and the
revenue path is open.
