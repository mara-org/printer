# Security policy

## Reporting a vulnerability

Please do **not** open a public GitHub issue for security problems.

Instead, email **security@paperlens.app** with:
- A description of the issue
- Steps to reproduce
- The affected version / commit SHA
- Your contact details (so we can credit you, if you want)

If the email above is not yet active (we are still pre-domain), open
a draft GitHub Security Advisory at:
`https://github.com/mara-org/printer/security/advisories/new`

We aim to acknowledge within **72 hours** and to ship a fix within
**14 days** for high-severity issues.

## Scope

In scope:
- The hosted application at https://printer-olive.vercel.app and any
  future production domain
- The code in this repository
- The Supabase project, only via documented public surfaces
- Stripe, Resend, and other third-party integrations only where the
  bug is in our code

Out of scope:
- Third-party services themselves (report to those vendors directly)
- Self-hosted forks
- Social-engineering, physical attacks, denial-of-service via volume

## Safe-harbor

We will not pursue legal action against researchers who:
- Make a good-faith effort to avoid privacy violations and data loss
- Do not exploit the issue beyond the minimum needed to demonstrate it
- Give us reasonable time to fix before public disclosure

## Hall of fame

Reporters who follow this policy and find a real, in-scope issue get
credited in `SECURITY-ACKNOWLEDGEMENTS.md` once the fix ships.
