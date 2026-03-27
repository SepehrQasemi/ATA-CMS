#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

if ! command -v node >/dev/null 2>&1; then
  echo "[ATA-CMS] Node.js 20+ is required." >&2
  exit 1
fi

if ! command -v npm >/dev/null 2>&1; then
  echo "[ATA-CMS] npm is required." >&2
  exit 1
fi

cd "$ROOT_DIR"

if [[ ! -f ".env" && -f ".env.example" ]]; then
  cp ".env.example" ".env"
  echo "[ATA-CMS] Created .env from .env.example"
fi

echo "[ATA-CMS] Installing dependencies..."
npm install

if [[ "${1:-}" == "--setup-only" ]]; then
  npx tsx scripts/run-local.ts --setup-only
else
  npx tsx scripts/run-local.ts
fi
