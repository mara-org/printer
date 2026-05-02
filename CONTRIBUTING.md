# Contributing

Thanks for the interest. PaperLens is built in public; PRs and issues
are welcome.

## Quick start

```sh
nvm use            # Node 22 (from .nvmrc)
npm install
cp .env.local.example .env.local   # fill in keys you have
npm run dev
npm run ci         # mirrors GitHub Actions
```

The minimum env to develop the landing page is just the two Supabase
public keys. To exercise `/api/analyze` locally you need
`GEMINI_API_KEY` and `SUPABASE_SERVICE_ROLE_KEY` (see `SETUP.md`).

## Branching

- `main` is protected; merge via PR only.
- Branch names: `feat/short-description`, `fix/short-description`,
  `chore/short-description`. AI-assisted branches are prefixed
  `claude/...`.

## Pull request checklist

- [ ] CI is green (typecheck + lint + test + build)
- [ ] No secrets in the diff (gitleaks runs automatically)
- [ ] Touches the analyze pipeline? Add or update a test in
      `lib/__tests__/`
- [ ] Touches Stripe / billing? Note the test plan in the PR body
- [ ] User-visible string change? Update all locale variants under
      `app/[locale]`

The PR template (`.github/pull_request_template.md`) prompts for these.

## Coding style

- TypeScript strict mode, no `any` unless commented why
- Edit existing files; do not introduce new abstractions for a
  single call site
- No comments that just restate what code does
- Match the surrounding style; do not reformat unrelated code

## Issues

Please file a GitHub issue with:
- What you tried
- What you expected
- What happened
- Browser / OS / commit SHA where relevant

For security issues, see `SECURITY.md` instead.

## License

By contributing, you agree your contributions are licensed under the
project license (MIT, see `LICENSE`).

## Support the project

Coffee keeps the lights on:

- Team: https://buymeacoffee.com/iammara
- Developer: https://buymeacoffee.com/justabdulaziz10
