# ATA Website

Public multilingual website and lightweight admin CMS for `Abadis Tejarat Arka` (`ATA` as the compact brand form).

## Purpose

This repository contains the finalized specification package and the implementation work for a standalone B2B catalog website. The product is a public, SEO-focused, inquiry-driven website with an embedded admin CMS. It is not an ecommerce system.

## Current Status

- Phase 0 complete: repository hygiene, baseline tracking, and documentation commit done
- Phase 1 complete: Next.js foundation, strict TypeScript, Tailwind, next-intl, auth skeleton, Prisma, base layouts
- Phase 2 complete: core domain model, admin CRUD foundation, publication rules, locale rules, seeded development data
- Phase 3 complete: public multilingual website pages, inquiry flow, product/category/manufacturer experiences
- Phase 4 complete: metadata, hreflang, sitemap, robots, locale-aware publication protections, non-public `fa` blocking
- Phase 5 complete: responsive/mobile navigation, loading and not-found states, accessibility polish, motion restraint, testing and release-readiness pass
- Source of truth remains the documentation package under `docs/`

## Implemented Stack

- Next.js App Router
- TypeScript with strict mode
- Tailwind CSS
- Reusable shadcn-style UI primitives
- Prisma
- SQLite for local-safe development, PostgreSQL-ready schema structure for production
- next-intl
- Free/local-safe admin authentication with signed sessions
- Vitest + Playwright for automated testing

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
- `app/` Next.js App Router public site and admin CMS routes
- `components/` design system and feature UI building blocks
- `lib/` domain logic, validation, SEO, i18n, and data helpers
- `prisma/` schema, migrations, and seed data
- `tests/` unit and validation coverage
- `e2e/` Playwright end-to-end coverage
- `public/` brand, catalog, and document assets
- `references/` supporting reference notes from the ATA ecosystem

## Core Commands

- `npm run dev`
- `npm run build`
- `npm run lint`
- `npm run typecheck`
- `npm test`
- `npm run coverage`
- `npm run e2e`
- `npm run db:push`
- `npm run db:migrate`
- `npm run db:seed`

## Implementation Discipline

- Follow the docs when implementation pressure conflicts with convenience
- Make the smallest safe decision when a documentation gap blocks progress
- Keep public website and admin CMS boundaries clean
- Favor production-quality foundations over throwaway scaffolding
- Keep `fa` modeled in admin but non-public and non-indexable for MVP
