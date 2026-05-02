# Short-form video scripts (TikTok / Reels / Shorts)

Format: 7-15 seconds. Hook in the first 1.5s. Pattern interrupt at 3s.
On-screen text mandatory (60%+ of TikTok watches muted). End with soft CTA.

**These are seed templates.** Claude generates new scripts daily by
mutating these structures with fresh hooks, locales, and document types
via `/api/cron/short-form-batch` — no human ever picks the next clip.

## Series 1 — "Things hidden in your X"

### S1E1 — Lease auto-renewal
- HOOK (0-1.5s): "Your landlord is hoping you don't read this clause."
- BUILD (1.5-6s): Camera on a real lease, finger underlines auto-renewal.
- PAYOFF (6-10s): "It auto-renews for 12 months unless you give 90 days notice."
- CTA (10-12s): "PaperLens reads every clause for you. Free for 3 docs."

### S1E2 — Insurance deductible trap
- HOOK: "I scanned my insurance and found out I'd pay $4,000 before they pay $1."
- BUILD: Highlight deductible vs. out-of-pocket-max in red.
- PAYOFF: "These are different numbers. Most people think they're the same."
- CTA: "Scan yours in PaperLens. Link in bio."

### S1E3 — Gym contract clause
- HOOK: "This gym contract has a 2x renewal clause."
- BUILD: Show line: "Membership renews at then-current rate."
- PAYOFF: "Last year that was 47% more for the same gym."
- CTA: "PaperLens flags clauses like this in 4 seconds."

### S1E4 — Medical bill duplicate charge
- HOOK: "Your hospital bill has a duplicate charge. Bet you didn't see it."
- BUILD: Same procedure code listed twice on different days.
- PAYOFF: "I caught $312 in 30 seconds with PaperLens."
- CTA: "Free for your first 3 documents."

### S1E5 — Job offer non-compete
- HOOK: "This non-compete in your job offer is illegal in your state."
- BUILD: Highlight 18-month restriction.
- PAYOFF: "California voids these. Your offer counts on you not knowing."
- CTA: "Run your offer through PaperLens before you sign."

## Series 2 — "I scanned X random Y"

- "I scanned 50 leases in NYC. Here's what landlords don't want you to see."
- "I scanned 30 freelance contracts. 22 had this same illegal clause."
- "I scanned my parents' insurance. They've been paying for nothing for 6 years."
- "I scanned every doctor's bill from 2025. Found $1,847 in errors."
- "I scanned a Berlin Mietvertrag for a friend. Saved her €2,400."

## Series 3 — Localized hooks (translate, do not import US examples)

### DE
"Dein Mietvertrag hat eine Klausel, die Vermieter nicht möchten dass du
liest." → Schönheitsreparaturen-Klausel ungültig nach BGH.

### ES-MX
"Tu contrato de arrendamiento tiene una cláusula que tu casero no quiere
que leas." → Aumento anual indexado a UDIS sin tope.

### PT-BR
"Seu contrato de aluguel tem uma cláusula que o proprietário não quer
que você leia." → Reajuste por IGP-M sem teto após 12 meses.

### FR
"Ton bail contient une clause que ton propriétaire ne veut pas que tu lises."
→ Clause d'indexation sur l'IRL avec rétroactivité illégale.

## Cadence (fully automated)

- 3 videos per platform per day = 9/day total
- `/api/cron/short-form-batch` runs daily 06:00 UTC and produces all 9:
  - Claude generates the script in the target locale + on-screen text
  - ElevenLabs synthesizes the voiceover (multilingual voice IDs cached
    per locale for consistency)
  - ShortGPT or Pictory renders the 9:16 vertical with stock b-roll
    pulled from Pexels API + auto-captions burned in
  - The output is uploaded via:
    - TikTok Content Posting API (sandbox-then-production approved app)
    - Instagram Graph API (Reels container → publish endpoint)
    - YouTube Data API v3 (Shorts upload)
  - Pinned first comment is set via each platform's API where supported
- Failures retry 3× with exponential backoff, then alert via Sentry.
- The cron is idempotent: each script gets a deterministic ID stored in
  Supabase `short_form_posts` so the same clip never double-posts.

No batch shoots, no editor, no VA, no scheduling tool middleman.
