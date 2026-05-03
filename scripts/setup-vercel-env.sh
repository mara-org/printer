#!/usr/bin/env bash
# One-shot uploader: pushes every KEY=VALUE in VERCEL_ENV_PASTE.txt to Vercel
# project env (production scope). Idempotent — re-running updates existing keys.
#
# Prereqs:
#   - Vercel CLI: comes via `npx vercel` (no install needed)
#   - You're logged into Vercel:  `npx vercel login`
#   - Project is linked:          `npx vercel link`  (run from repo root)
#
# Usage:
#   bash scripts/setup-vercel-env.sh
#
# This script never commits secrets. VERCEL_ENV_PASTE.txt is gitignored.

set -euo pipefail

PASTE_FILE="${1:-VERCEL_ENV_PASTE.txt}"
SCOPE="${SCOPE:-production}"

if [[ ! -f "$PASTE_FILE" ]]; then
  echo "error: $PASTE_FILE not found" >&2
  exit 1
fi

if [[ ! -d ".vercel" ]]; then
  echo "error: project not linked. Run \`npx vercel link\` first." >&2
  exit 1
fi

echo "Pushing env vars to Vercel ($SCOPE scope)…"
echo

while IFS= read -r line || [[ -n "$line" ]]; do
  [[ -z "$line" || "$line" == \#* ]] && continue
  key="${line%%=*}"
  value="${line#*=}"
  # strip surrounding quotes if present
  value="${value%\"}"
  value="${value#\"}"

  if [[ -z "$key" || -z "$value" ]]; then
    echo "  skip: empty key or value on line: $line"
    continue
  fi

  # Remove existing var (ignore errors), then add fresh value.
  npx vercel env rm "$key" "$SCOPE" --yes >/dev/null 2>&1 || true
  printf '%s' "$value" | npx vercel env add "$key" "$SCOPE" >/dev/null
  echo "  ✓ $key"
done < "$PASTE_FILE"

echo
echo "Done. Trigger a redeploy so the new vars take effect:"
echo "  npx vercel --prod"
