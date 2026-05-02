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
- 800-1200 words of original content (Claude generates, native review)
- Embedded mini-analyzer: paste an excerpt, get a free summary, no signup
- 3 internal links: to two related doc-type pages + to /pricing
- 1 external authoritative link (gov / legal aid / consumer protection)
- Schema.org Article + FAQPage markup
- hreflang tags between locale variants

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

### Backlink plan

- 30 guest posts in year 1, 1/week after week 4
- Targets: Reddit Wiki, NerdWallet-equivalents in each locale, immigrant
  communities (e.g., InterNations, German-Way, Brazilian forums in EU)
- HARO / Help-A-B2B-Writer: respond 5x/week with PaperLens-relevant quotes
- Tenant rights NGOs: offer free integration; ask for footer link

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

### ASO sprint plan

- Week 5: submit v1, English-only metadata to derisk review
- Week 6: add DE, FR, ES, PT-BR after first approval
- Week 7: add JA, KO, IT, NL after second update
- Week 8: full 20-locale rollout
- Weekly: AppFigures keyword tracking; iterate top 3 weak keywords/week

## Reporting

Weekly dashboard (Looker / PostHog):
- Organic search clicks per locale
- App Store impressions / installs per locale
- Programmatic page → signup conversion
- Keyword ranking deltas

Decision rule: if a locale has < 100 weekly clicks by month 3, deprioritize.
Concentrate budget on the top 8 locales.
