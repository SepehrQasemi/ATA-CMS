# ATA-CMS Local Run Guide

## Fastest path

### Windows

- Double-click `RUN_ME_WINDOWS.bat`
- Or run `.\RUN_ME_WINDOWS.ps1`

### macOS / Linux

- Run `./RUN_ME_MAC_LINUX.sh`

## What the bootstrap does

1. ensures `.env` exists
2. installs dependencies
3. generates Prisma client
4. syncs the local database schema
5. seeds sample content only when the local database is empty
6. starts Next.js on `127.0.0.1:3000`

## Setup-only mode

- Windows:
  `powershell -ExecutionPolicy Bypass -File .\RUN_ME_WINDOWS.ps1 -SetupOnly`
- macOS / Linux:
  `./RUN_ME_MAC_LINUX.sh --setup-only`
- npm:
  `npm run local:setup`

## Stop helpers

- Windows:
  `.\STOP_LOCAL_WINDOWS.ps1`
- macOS / Linux:
  `./STOP_LOCAL_MAC_LINUX.sh`

These stop helpers only target the local process listening on port `3000`.

## Default URLs

- Public EN: `http://127.0.0.1:3000/en`
- Public FR: `http://127.0.0.1:3000/fr`
- Admin login: `http://127.0.0.1:3000/admin/login`
