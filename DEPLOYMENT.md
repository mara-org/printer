# Deployment

## What is provisioned

- **Vercel project** — deployed by founder; Supabase env vars set there.
- **Supabase project `paperlens`** (us-east-1, free tier, $0/mo)
  - Project ref: `qcrrfisswbaecuipcatr`
  - URL: `https://qcrrfisswbaecuipcatr.supabase.co`
  - Schema: waitlist, profiles, documents, analyses, subscriptions
  - RLS on every user table; anon allowed only to insert into waitlist
- **Stripe products + prices (LIVE mode)**
  - PaperLens Pro — `prod_URSM9BDFSWQSFY`
    - $6.99/mo — `price_1TSZRk7iHZBeOOe5xY3ak1Yy`
  - PaperLens Lifetime — `prod_URSMVw8zCHVjPn`
    - $79 one-time — `price_1TSZRn7iHZBeOOe5QfKbH5gB`
  - PaperLens Power — `prod_URSM9OLhn5meR4`
    - $14.99/mo — `price_1TSZRp7iHZBeOOe5YNBBoKFB`

## Vercel env vars to add

Beyond what's already set, add these for the next milestones:

```
NEXT_PUBLIC_STRIPE_PRICE_PRO=price_1TSZRk7iHZBeOOe5xY3ak1Yy
NEXT_PUBLIC_STRIPE_PRICE_LIFETIME=price_1TSZRn7iHZBeOOe5QfKbH5gB
NEXT_PUBLIC_STRIPE_PRICE_POWER=price_1TSZRp7iHZBeOOe5YNBBoKFB
STRIPE_SECRET_KEY=sk_live_...        # from dashboard.stripe.com/apikeys
STRIPE_WEBHOOK_SECRET=whsec_...      # set after creating webhook endpoint
ANTHROPIC_API_KEY=sk-ant-...         # for the analyze pipeline
RESEND_API_KEY=re_...                # for lifecycle + inbound mail
CRON_SECRET=<random-32-bytes>        # protects /api/cron/* routes
```

The full env-var list (social platform tokens, ElevenLabs, Apple Search
Ads, etc.) lives in `plan.md` under "What the founder does (one-time
setup, not staffing)" — provision those when each cron is built.

## Stripe note: business name required for Payment Links

The first attempt to create Payment Links via the Stripe MCP failed with:

> Merchant must have a defined business name to use Payment Links.

Fix: dashboard.stripe.com/settings/account → set **Business name** to
"PaperLens" (or your legal entity if different). After that, full
Stripe Checkout Sessions and Payment Links both work. This is a
one-line settings change.

Stripe Tax should also be enabled in the same settings flow:
dashboard.stripe.com/settings/tax — turn on, register for the
jurisdictions Stripe suggests. Stripe collects + remits VAT/sales tax
automatically after that.

## Domain

`paperlens.app` is the working choice. Buy it (~$12/yr at Cloudflare
or Porkbun), point it at Vercel. Cannot be automated — requires the
founder's card. One-time, not "hiring".

## After domain is live

The system will:
- Add `paperlens.app` as `metadataBase` for OG / canonical tags
- Set Supabase Auth → URL Configuration → Site URL
- Wire PostHog with the live domain
- Submit Search Console (per locale) for the SEO sprint
- Configure Resend domain (DKIM + SPF DNS records auto-generated)
- Begin the cron-driven content pipeline described in `plan.md`
