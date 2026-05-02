# Programmatic SEO + App Store SEO

The two channels with compounding returns and zero ongoing CAC.
Execute relentlessly; measure weekly.

## Programmatic SEO: 240 landing pages

URL pattern: `/{locale}/explain/{document-type}`

### 12 document types

1. lease / rental-agreement
2. employment-contract / job-offer
3. nda
4. health-insurance
5. auto-insurance
6. life-insurance
7. medical-bill
8. eob (explanation of benefits)
9. tax-letter
10. mortgage
11. terms-of-service
12. privacy-policy

### 20 locales

en-us, en-gb, es, es-mx, pt-br, de, fr, it, nl, pl, ja, ko, zh-tw, tr,
ar, hi, id, vi, th, ru.

12 × 20 = 240 pages, each:
- Title: "How to read a {document-type} (in plain {language})"
- 800-1200 words of original content (Claude generates; no human review
  step — instead, an LLM-as-judge cron re-evaluates each page monthly
  against a quality rubric and flags pages below threshold for regen)
- Embedded mini-analyzer: paste an excerpt, get a free summary, no signup
- 3 internal links: to two related doc-type pages + to /pricing
- 1 external authoritative link (gov / legal aid / consumer protection)
- Schema.org Article + FAQPage markup
- hreflang tags between locale variants

Generation is fully automated by `/api/cron/generate-pseo-pages`:
Claude writes 5 pages/week, opens an auto-PR, CI runs lint + LLM-as-judge
quality gate, auto-merges if both pass. After 240 pages the cron switches
to refreshing the oldest pages monthly.

### Keyword targets per locale (sample)

| Locale | Primary | Volume | Difficulty |
|--------|---------|--------|------------|
| en-us  | how to read a lease            | 4.4K  | low    |
| es-mx  | cómo leer un contrato de arrendamiento | 1.8K | low |
| pt-br  | como entender contrato de aluguel | 2.9K | low |
| de     | mietvertrag erklärt            | 6.2K  | low    |
| fr     | comprendre son bail            | 2.1K  | low    |
| ja     | 賃貸契約 解説                  | 1.4K  | low    |

Heavy reliance on long-tail in non-English markets where competition is
near-zero and intent is extremely high.

### Backlink plan (no outreach, no guest posts)

Outreach-based link-building requires human relationships. Excluded.
Instead, links accrue from automated, value-creating surfaces:

- **Affiliate program at `/affiliates`**: anyone (including bloggers,
  YouTubers, NGOs) self-onboards, gets `?ref=` link, 30% rev-share
  for 6 months via Stripe Connect. Bloggers organically link.
- **Free embeddable widget at `/embed`**: any site can drop a
  `<script>` tag and offer a 1-doc analyzer to their readers. The
  widget includes a backlink. NGOs and tenant-rights orgs adopt it
  organically because it provides real reader value.
- **Linkable assets**: the cron generates a quarterly data report
  ("State of leases 2026: 50,000 documents analyzed") published as a
  static page, surfaced via the same SEO pipeline. Journalists and
  bloggers link to data, not pitches.
- **HARO / qwoted equivalent**: skipped. The reply quality required
  to land citations needs human judgment and would burn the domain
  if mass-replied by AI.

## App Store SEO

### iOS App Store

Title (30 chars): "PaperLens: Document AI"
Subtitle (30 chars): "Read leases, contracts, bills"
Keywords (100 chars, comma-separated, no spaces):
`lease,contract,insurance,document,scan,explain,translate,legal,medical,bill,policy,rental,review`

Localize per market. Examples:

| Locale | Title | Subtitle |
|--------|-------|----------|
| de     | PaperLens: Vertrags-KI | Mietvertrag verstehen |
| es-mx  | PaperLens: IA Documentos | Leer contratos al instante |
| pt-br  | PaperLens: IA Documentos | Entender contratos rápido |
| ja     | PaperLens: 書類AI | 契約書を分かりやすく |

### Screenshots (10 per locale)

1. Snap a document — phone tilted, real lease visible
2. "Plain language" summary card
3. "Risks flagged" — 3 red callouts
4. Follow-up Q&A bubble
5. Multi-language switcher
6. Privacy: "Auto-deleted in 30 days"
7. Document-type variety (lease, insurance, medical, tax, contract)
8. Pricing — Free vs. Pro
9. Testimonial (placeholder until we have real ones)
10. CTA: "Free for 3 documents"

### ASO sprint plan (cron-driven)

- Week 5: founder submits v1 binary once (only manual step in ASO; the
  store demands a human-signed submission). Metadata is English-only
  to derisk first review.
- Weeks 6–8: `/api/cron/aso-keyword-update` adds locales in waves via
  the App Store Connect API + Google Play Developer API. No app
  binary changes needed for metadata updates after the first one.
- Weekly: the cron pulls AppFigures rankings, asks Claude for the
  weakest keyword per locale, replaces it via the store APIs, and
  records the swap in Supabase `aso_keyword_history` for attribution.
- Screenshots are auto-rendered: a Next.js route renders the marketing
  screen, Playwright on Vercel screenshots it per device + locale,
  uploaded via the store APIs.

## Reporting

Weekly dashboard (Looker / PostHog):
- Organic search clicks per locale
- App Store impressions / installs per locale
- Programmatic page → signup conversion
- Keyword ranking deltas

Decision rule: if a locale has < 100 weekly clicks by month 3, deprioritize.
Concentrate budget on the top 8 locales.
