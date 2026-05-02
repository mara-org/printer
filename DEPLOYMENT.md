# Deployment

The Supabase project is live. Vercel deploy needs a one-time link step
that I cannot do from here — picking which GitHub repo to import requires
a click in the Vercel UI under your account.

## What is provisioned

- **Supabase project:** `paperlens` (region: us-east-1, free tier, $0/mo)
  - Project ref: `qcrrfisswbaecuipcatr`
  - URL: `https://qcrrfisswbaecuipcatr.supabase.co`
  - Schema: waitlist, profiles, documents, analyses, subscriptions
  - RLS on every user table; anon allowed only to insert into waitlist
  - Publishable key already in `.env.example` (RLS-protected, safe to commit)

- **GitHub branch:** `claude/aar-project-setup-XTWvS` on `mara-org/printer`

## To unblock Vercel deploy — pick ONE

### Option A — Link via Vercel UI (recommended, 60 seconds)

1. https://vercel.com/new
2. "Import Git Repository" → select `mara-org/printer`
3. Framework: Next.js (auto-detected)
4. Production branch: `claude/aar-project-setup-XTWvS` (or merge to main first)
5. Environment variables — paste these:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://qcrrfisswbaecuipcatr.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_8Enz7MPf2_H471tBd6XgnQ_10gD-TxZ
   ```
6. Deploy. Every push to the branch auto-deploys after that.

### Option B — Give me a Vercel token

Create one at https://vercel.com/account/tokens (scope: full account or
team `abdulazizs-projects-cb679bdc`). Drop it in this chat or set
`VERCEL_TOKEN` in the env, and I'll run `vercel deploy --prod` from here.

### Option C — Run locally

```sh
npx vercel link
npx vercel env add NEXT_PUBLIC_SUPABASE_URL
npx vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
npx vercel deploy --prod
```

## After first deploy

Tell me the production URL. I will:
- Add it as `metadataBase` for OG / canonical tags
- Add it to Supabase Auth → URL Configuration → Site URL (so future
  email-magic-link signups redirect correctly)
- Wire PostHog with the live domain
- Start submitting Search Console (per locale) for the SEO sprint

## Domain

`paperlens.app` is the working choice in `plan.md`. Buy it (~$12/yr at
Cloudflare or Porkbun), point it at Vercel, and we're done. I cannot
purchase it for you — it requires your card.
