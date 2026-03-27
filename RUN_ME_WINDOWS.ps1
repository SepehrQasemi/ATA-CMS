param(
  [switch]$SetupOnly
)

$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent $MyInvocation.MyCommand.Path

function Fail([string]$Message) {
  Write-Host "[ATA-CMS] $Message" -ForegroundColor Red
  exit 1
}

if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
  Fail "Node.js is required. Install Node.js 20+ and retry."
}

if (-not (Get-Command npm -ErrorAction SilentlyContinue)) {
  Fail "npm is required. Install Node.js/npm and retry."
}

Set-Location $Root

if (-not (Test-Path ".env") -and (Test-Path ".env.example")) {
  Copy-Item ".env.example" ".env"
  Write-Host "[ATA-CMS] Created .env from .env.example"
}

Write-Host "[ATA-CMS] Installing dependencies..."
npm install
if ($LASTEXITCODE -ne 0) {
  exit $LASTEXITCODE
}

if ($SetupOnly) {
  npx tsx scripts/run-local.ts --setup-only
} else {
  npx tsx scripts/run-local.ts
}

exit $LASTEXITCODE
