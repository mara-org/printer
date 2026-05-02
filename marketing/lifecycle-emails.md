# Lifecycle email sequence (Resend)

All emails ≤ 80 words. Plain text feels human; resist the urge to add HTML
banners. Subject lines are sentence-case, no emojis (cleaner inbox treatment).

**Sender persona:** "PaperLens Team" from `team@paperlens.app`.
**Inbound replies** to that address are handled by Claude via
`/api/cron/inbound-mail-reply` (Resend inbound webhook → Claude → Resend
send). Claude has access to the user's account, last 10 documents, and
support knowledge base. Replies log to Supabase `support_threads`.

Escalation rules (Claude opens a founder-inbox issue instead of
auto-replying) for:
- Refund requests > $79
- Legal / press / journalist keywords
- Claude self-reported confidence < 0.6
- Repeat unresolved thread (>3 round-trips)

Anything else: Claude replies within 5 minutes, 24/7. No "Founder"
signature claims to read every reply — copy below uses "PaperLens"
to be honest while staying warm.

## Day 0 — Welcome

Subject: You're in. Here's how to get the most from PaperLens.

Hey {first_name}, welcome.

The fastest way to see what PaperLens does: upload the next document
sitting on your desk. A lease, an insurance letter, the medical bill you
keep meaning to read.

You'll get the plain-language summary in ~10 seconds, with the risky
parts highlighted. Free for your first 3 documents.

Reply if anything breaks — we read every reply and respond fast.

— PaperLens

## Day 1 — Tip

Subject: Most people miss this clause type

A pattern from the first 1,000 documents people ran through PaperLens:
auto-renewal clauses are the single most-missed item.

If you have a gym, software subscription, or insurance policy on file,
run it through PaperLens today. The renewal date is usually buried.

[Open PaperLens →]

## Day 3 — Social proof + nudge

Subject: 312 dollars

That's the average savings PaperLens users find on their first medical
bill scan. Duplicate charges, billing-code errors, services not covered.

Got a bill from this year? Worth ten seconds.

[Scan now →]

## Day 7 — Quota nudge

Subject: 1 free scan left

You've used 2 of your 3 free scans this month.

Pro is $6.99/month. Cancel anytime. The first month pays for itself if
PaperLens catches one error on a single document.

[See Pro →]

## Day 14 — Recurrence

Subject: That document you keep putting off

The reason people don't read contracts is they don't have time.
PaperLens takes ten seconds.

The lease renewal, the new job offer, the parents' insurance — pick one.

[Open PaperLens →]

## Day 30 — Anniversary + referral

Subject: One month with PaperLens

You've scanned {n} documents this month. Quick favor: if PaperLens has
saved you time or money, send this referral link to one friend who
moves apartments a lot, freelances, or just got a confusing letter.

They get 30 days of Pro free. You get a month free for every signup.

[Your link: paperlens.app/r/{code}]

## Day 60 — Win-back (sent only if inactive 30+ days)

Subject: A new doc type might help

Since you last scanned, PaperLens added support for {top_new_doc_type}.
If you've got one of those sitting around, it's a quick test.

[Try it →]

## Churn save (cancellation flow)

Subject: One question before you go

You're cancelling — that's fine, no hard feelings. Quick thing: what
was the one feature you wanted that PaperLens didn't have?

Reply with two sentences. Every reply is read by our AI support agent
and tagged into our roadmap signal — the top three pain points each
month shape what ships next.

— PaperLens
