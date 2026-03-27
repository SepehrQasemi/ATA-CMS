# Technical Architecture Recommendation

## Recommended build stack

### Framework

- `Next.js` with App Router

Reason:
- strong fit for public pages plus protected admin in one app
- first-class metadata, sitemap, and robots support
- good deployment story on Vercel
- flexible rendering for marketing/catalog pages and admin workflows

### Language

- `TypeScript`

Reason:
- shared domain types across public pages, admin forms, and database access
- safer multilingual content modeling and publish-state logic

### Database

- `PostgreSQL`
- recommended hosting direction for MVP: free-tier PostgreSQL compatible provider, with `Supabase Postgres` as the default recommendation

Reason:
- aligns with requested stack
- works cleanly with Prisma
- supports multilingual catalog, CMS, and inquiry storage cleanly
- avoids a paid-first requirement for the MVP

Local development recommendation:
- local Postgres via Docker or local Supabase stack if preferred

### ORM

- `Prisma`

Reason:
- clear schema modeling for translation tables
- strong TypeScript ergonomics
- easy seeding and migration workflows

### Styling

- `Tailwind CSS`
- custom ATA theme tokens layered on top
- `shadcn/ui` for accessible primitives, not default aesthetics

Reason:
- fast implementation of admin forms and layout primitives
- easy to encode brand tokens and responsive behaviors
- useful for avoiding low-quality bespoke admin widgets

### i18n

- `next-intl`

Reason:
- strong fit for locale-prefixed routes and localized metadata
- clean separation between routing and translation loading

### Media / uploads

- free-tier object/file storage with a Postgres-adjacent provider, with `Supabase Storage` as the default recommendation

Reason:
- supports both images and product documents
- avoids making `Vercel Blob` a paid-first dependency
- keeps operational complexity low for MVP

### Admin auth direction

- `Auth.js` with database-backed sessions
- credentials-based admin login as the MVP default

Reason:
- good fit for a single Next.js app
- avoids pulling in unnecessary external auth complexity for a small internal CMS
- avoids requiring email delivery infrastructure in MVP
- allows invited internal users and simple role checks

Recommended MVP roles:
- `admin`
- `editor`

### Analytics

- no paid analytics tool should be required for MVP
- use `Google Search Console` for SEO visibility
- optional free measurement can be added later after privacy review

Reason:
- the MVP must avoid paid-service dependencies
- search performance and technical indexation matter more than advanced marketing dashboards at launch

### Error monitoring

- no paid error-monitoring service should be required for MVP
- start with application logs, Vercel logs, and basic admin-visible error handling
- keep `Sentry` as an optional future improvement, not a build requirement

Reason:
- launch scope should not depend on paid operational tooling
- the first MVP quality bar can be met with disciplined logging and testing

### SEO tooling direction

Prefer native Next.js features:
- `generateMetadata`
- `sitemap.ts`
- `robots.ts`

Reason:
- minimal tooling surface
- less duplication
- enough for this sitemap and metadata scope

### Testing direction

- `Vitest` for unit tests
- `React Testing Library` for component tests
- `Playwright` for end-to-end coverage

Focus areas:
- locale routing
- publish gating
- inquiry form flow
- admin content create/edit/publish flow
- sitemap and metadata generation

## Recommended application shape

Use one repository and one Next.js application with two route areas:

- public site routes
- protected admin routes

This is preferable to:
- a separate public app
- a separate CMS product
- a separate admin frontend

Reason:
- less infrastructure
- shared types and validation
- easier consistency across public and admin features

## Rendering strategy

### Public pages

Use static generation or cached server rendering where possible, with revalidation when content changes.

Best fit:
- home, about, categories, products, manufacturers rendered as cache-friendly content pages

### Admin pages

Use dynamic server rendering or client-assisted forms where necessary.

Reason:
- admin needs fresher state
- public pages need performance and stability

## Data architecture principles

- store language-neutral base records separately from translation rows
- centralize publish logic in one service layer
- centralize locale completeness checks
- centralize SEO field validation
- centralize category-path generation
- centralize price-display rules and contact-for-pricing fallback rules

Do not:
- spread publication logic across many components
- let route handlers and pages each invent their own publication rules

## CMS architecture principle

Keep the CMS structured.

Use:
- explicit forms
- explicit locale tabs
- explicit publish buttons
- explicit completeness checks

Do not use:
- a visual page builder
- raw arbitrary JSON editing for normal editors unless hidden behind structured UI

## Public design-system architecture

Recommended approach:

- define ATA theme tokens first
- wrap `shadcn/ui` primitives with ATA-branded components
- use one icon library consistently in implementation, preferably `lucide-react`
- use `Manrope` as the single MVP font family

Reason:
- accessibility comes from robust primitives
- brand quality comes from a controlled theme layer
- typography consistency is simpler for a multilingual MVP

## Recommended package boundaries

Even in a single app, separate concerns:

- `lib/domain` for catalog and publishing rules
- `lib/i18n` for locale logic
- `lib/seo` for canonical/hreflang/metadata helpers
- `lib/cms` for admin validation and publish services
- `app/(public)` and `app/admin` route groups

## Deployment recommendation

- deploy the app to `Vercel`
- use a free-tier PostgreSQL provider such as `Supabase Postgres`
- use free-tier object storage such as `Supabase Storage`
- configure production, preview, and development environments cleanly

Reason:
- keeps the Next.js deployment path aligned with the requested stack
- avoids paid-first platform services for the MVP
- still gives a clean preview workflow for content review before production

## Security and reliability baseline

- protect admin routes server-side
- validate inquiry form inputs on server
- rate-limit or abuse-protect inquiry submissions in the implementation phase
- avoid exposing draft content through predictable public URLs
- keep media uploads constrained by file type and size
- store inquiries in the primary database from day one

## What should not be introduced in MVP

- separate headless CMS product like Strapi, Sanity, or Contentful
- microservices
- GraphQL layer
- Redis
- search engine infrastructure such as Elasticsearch
- workflow engine
- event bus
- custom block-based page builder
- CRM integration at request time
- complex role matrix copied from ATA-CRM
- advanced PIM/DAM features
- required paid analytics, error monitoring, storage, or email services

## Why the recommendation is intentionally simple

This project needs:
- strong public pages
- safe multilingual publishing
- manageable internal editing
- database-backed inquiry capture
- file/document support for products

It does not need a large platform architecture.

The best MVP is a disciplined monolith, not a distributed system.
