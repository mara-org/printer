# SETUP — what only you can do (slim version)

This is what's left for you. Everything else from the original setup
has already been done.

## ✅ Already done (you don't need to read these)

Gemini API key, Hugging Face token, Supabase service role, Cloudflare
Turnstile, Upstash Redis, Resend, Sentry, Pexels, CRON_SECRET, GitHub
branch protection, Vercel deployment protection disabled, Supabase
no card on file. PostHog and Stripe were dropped (PostHog → Vercel
Analytics built-in; Stripe → Polar.sh because it accepts Saudi sellers
and handles VAT as Merchant of Record).

## What's left

### 1. Google Cloud — billing budget cap (CRITICAL, ~3 min)

This is the absolute spend ceiling for Gemini. Without it, abuse or a
bug could rack up paid-tier charges.

1. https://console.cloud.google.com/billing
2. Pick the project that owns your `GEMINI_API_KEY` (likely
   `paperlens-ai` if you named it that). Link a billing account if it
   doesn't have one yet — the free tier still works, but the cap below
   only applies once a billing account is attached.
3. **Budgets & alerts** → **Create budget**:
   - Name: `paperlens-cap`
   - Amount: **$30/month** (raise later as MRR grows)
   - Alerts: 50%, 90%, 100% (default)
   - **CHECK** "Cap project at 100% of budget" — this is the real cap
4. Save.

Nothing to hand off — it's a setting, not a key.

### 2. Vercel — spend cap (~1 min)

1. https://vercel.com/abdulazizs-projects-cb679bdc/settings/billing
2. **Spend Management** → set monthly hard cap to **$20** (or whatever
   you're comfortable with). Project pauses when hit; no overage bill.

### 3. Polar.sh — payments setup (~10 min)

You've replaced Stripe with Polar because Polar accepts Saudi sellers
and handles VAT/sales tax in 80+ countries automatically as the
Merchant of Record. Fees: ~4% + $0.40 per transaction; no monthly fee.

1. https://polar.sh — sign up.
2. Create your **organization**:
   - Name: `PaperLens`
   - Slug: `paperlens`
3. Add a **payout method** (bank account, Wise, etc.).
4. Create three **products** (you can do this in the dashboard now or
   wait until I build the Stripe-equivalent helpers in the next sprint):
   - **PaperLens Pro** — Recurring, $6.99/month
   - **PaperLens Power** — Recurring, $14.99/month
   - **PaperLens Lifetime** — One-time, $79
5. Settings → **API tokens** → create one named `paperlens-prod` with
   scope: `products:read`, `subscriptions:read+write`, `customers:read+write`,
   `webhooks:read+write`. Copy the token.
6. Settings → **Webhooks** → create endpoint:
   - URL: `https://printer-olive.vercel.app/api/polar/webhook`
     (route is built next sprint; webhook will 404 until then — that's fine)
   - Events: `subscription.created`, `subscription.updated`,
     `subscription.canceled`, `order.created`
   - Copy the signing secret.

**Hand off:**
```
POLAR_ACCESS_TOKEN=polar_oat_...
POLAR_WEBHOOK_SECRET=polar_whsec_...
POLAR_ORG_ID=<from your org URL slug or settings>
NEXT_PUBLIC_POLAR_PRODUCT_PRO=<product id, after step 4>
NEXT_PUBLIC_POLAR_PRODUCT_POWER=<product id>
NEXT_PUBLIC_POLAR_PRODUCT_LIFETIME=<product id>
```

If you'd rather I create the products via Polar's API once you give me
the access token, just send the token and skip step 4.

### 4. Add the keys to Vercel (~5 min)

I cannot add Vercel env vars from here — the Vercel MCP doesn't expose
that endpoint. Two ways for you to do it:

**Option A — paste-import in dashboard (fastest)**

1. https://vercel.com/abdulazizs-projects-cb679bdc/printer/settings/environment-variables
2. Click **"Import .env"** (top-right of the page)
3. Paste the block I sent you in chat, choose **Production** scope,
   click Import.

**Option B — Vercel CLI**

```sh
cd /path/to/printer
npx vercel link    # one time — pick the printer project
# Then for each:
echo "AIza..." | npx vercel env add GEMINI_API_KEY production
# ... repeat per key
```

### 5. Add CRON_SECRET to GitHub Secrets (~30s)

1. https://github.com/mara-org/printer/settings/secrets/actions
2. **New repository secret** → name: `CRON_SECRET`, value: same as the
   one you put in Vercel.

---

## Phase 2 — social platforms (later, week 9+)

Don't worry about these now. When we hit the social-posting sprint:
TikTok Developer, Meta (IG + FB), YouTube Data API, Reddit API,
X (Twitter) Free tier, LinkedIn Marketing API.

---

## What I'll do once you confirm

Reply with **"polar done"** or **"vercel env imported"** (or both)
and I will:

1. Smoke-test `/api/health` against production.
2. Run a real analyze call against `/api/analyze` with a sample PDF
   to verify Gemini wiring.
3. Start the next sprint:
   - Auth pages (Supabase Auth: email + Google OAuth)
   - `/upload` UI (drag-drop + Turnstile + signed-URL upload to Storage)
   - `/dashboard` (analysis history)
   - `/pricing` + Polar checkout integration + webhook handler
   - Resend transactional email integration
