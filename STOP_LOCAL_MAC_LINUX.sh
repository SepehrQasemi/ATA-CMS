#!/usr/bin/env bash
set -euo pipefail

PIDS="$(lsof -ti tcp:3000 || true)"

if [[ -z "$PIDS" ]]; then
  echo "[ATA-CMS] No process is listening on port 3000."
  exit 0
fi

echo "$PIDS" | xargs kill
echo "[ATA-CMS] Stopped process(es) on port 3000."
