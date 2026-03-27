# ATA Website

Public multilingual website and lightweight admin CMS for `Abadis Tejarat Arka` (`ATA` as the compact brand form).

## Purpose

This repository contains the finalized specification package and the implementation work for a standalone B2B catalog website. The product is a public, SEO-focused, inquiry-driven website with an embedded admin CMS. It is not an ecommerce system.

## Current Status

- Phase 0 in progress: repository hygiene, baseline tracking, and documentation commit
- Application implementation has not started yet in this baseline state
- Source of truth remains the documentation package under `docs/`

## Planned Stack

- Next.js App Router
- TypeScript with strict mode
- Tailwind CSS
- shadcn/ui
- Prisma
- PostgreSQL for production, local-safe development database for MVP setup when needed
- next-intl
- Auth.js or equivalent free/local-safe admin authentication approach

## Major Constraints

- Public locales: `en` and `fr`
- Default locale: `en`
- `fa` must be fully modeled in admin but not public and not indexable in MVP
- No cart, checkout, payment, or online ordering
- No paid third-party service dependency required for MVP core flows
- Products support manufacturer relation, category relation, optional public pricing, availability states, and public documents when content exists
- Inquiries must be stored in the database and manageable from admin
- Typography baseline for MVP: `Manrope`

## Authoritative Documentation

The following documents are the implementation source of truth:

- `docs/00_project_overview.md`
- `docs/03_sitemap.md`
- `docs/04_domain_model.md`
- `docs/05_multilingual_strategy.md`
- `docs/06_seo_strategy.md`
- `docs/07_ui_ux_spec.md`
- `docs/08_cms_spec.md`
- `docs/09_technical_architecture.md`
- `docs/10_implementation_roadmap.md`
- `docs/12_acceptance_checklist_for_build_phase.md`
- `docs/13_final_product_decisions.md`
- `docs/wireframes/*`
- `docs/admin/*`
- `docs/decisions/*`

## Repository Layout

- `docs/` specification package and implementation reference
- `references/` supporting reference notes from the ATA ecosystem

## Implementation Discipline

- Follow the docs when implementation pressure conflicts with convenience
- Make the smallest safe decision when a documentation gap blocks progress
- Keep public website and admin CMS boundaries clean
- Favor production-quality foundations over throwaway scaffolding
