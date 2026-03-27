# ATA-CMS Hardening Pass Report

## Audit snapshot

### PASS initially

- non-ecommerce scope remained intact
- public locales were limited to `en` and `fr`
- `fa` was modeled and blocked from public routing
- public routes and core admin routes existed
- inquiry persistence worked and was visible in admin
- pricing fallback and availability logic existed
- sitemap, robots, metadata, and hreflang foundations existed
- responsive public navigation and accessibility baseline were already present

### PARTIAL initially

- repository/project identity still used `ATA Website` / `ata-website` in key places
- public query layer did not consistently restrict nested translations to `published`
- public product documents could be shown without a published localized label
- admin browser-level verification was missing
- startup ergonomics were still manual
- admin copy still exposed some scaffold-era wording
- dependency audit had unresolved advisories requiring risky upgrades

### FAIL initially

- no one-click local start workflow existed
- repo was not yet prepared cleanly under the target project name `ATA-CMS`

## Fixes implemented in this pass

- renamed repository-facing project identity to `ATA-CMS` in package metadata and README
- added one-click local run scripts for Windows and macOS/Linux
- added Windows/macOS/Linux stop helpers
- added shared local bootstrap script for env creation, Prisma generation, schema sync, safe seed detection, and local start
- hardened public query layer so nested public translations are filtered by `published` status
- hardened public document visibility so only public files with a published localized label and real URL render on public product pages
- added unit coverage for public document visibility rules
- added Playwright admin smoke coverage for login redirect and dashboard/inquiries access
- refreshed stale admin copy to final-product wording
- added local run guide and release/hardening notes to docs

## Remaining non-blocking gaps

- dependency advisories remain because available fixes require potentially destabilizing dependency changes
- overall coverage is still modest at the repository level because route/component rendering is not heavily component-tested
- GitHub remote configuration is still pending and must be supplied externally
