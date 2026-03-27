# Implementation Roadmap

## Phase 0: Discovery / Specification

### Goals

- understand ATA-CRM brand references
- define the product scope and constraints
- define IA, domain model, multilingual model, SEO model, and CMS scope

### Deliverables

- complete documentation package in this repository
- brand audit
- build-phase acceptance checklist
- final product decision record

### Dependencies

- access to ATA-CRM reference repository

### Exit criteria

- documentation package is internally consistent
- major assumptions are explicit
- build stack and roadmap are approved

### Risks

- over-assuming missing brand details
- under-specifying publication or locale rules

## Phase 1: Foundation / Scaffolding

### Goals

- initialize the actual application
- encode the chosen architecture and theme foundations
- establish route groups, auth shell, and core infrastructure

### Deliverables

- Next.js app scaffold
- TypeScript, Tailwind, shadcn/ui setup
- Prisma setup with initial schema draft
- Auth.js admin auth foundation
- public route group and admin route group
- ATA theme token layer
- `Manrope` typography setup

### Dependencies

- approval of this spec package
- environment and deployment project setup

### Exit criteria

- app boots locally
- admin routes are protected
- locale routing structure exists
- theme tokens reflect the approved ATA brand interpretation
- no paid service is required for the basic local development loop

### Risks

- accidental drift from the documented brand audit
- premature building of pages before domain rules are encoded

## Phase 2: Data Model And Admin Basics

### Goals

- implement the schema and basic CMS CRUD
- make publishing and locale state manageable

### Deliverables

- Prisma schema and migrations
- seed/config for locales and system pages
- admin lists and edit forms for:
  - pages
  - products
  - categories
  - manufacturers
  - media
  - inquiries
  - settings
- category hierarchy support
- product price fields and contact-for-pricing logic
- product document support
- base validation and publish gating

### Dependencies

- Phase 1 foundation
- finalized environment variables and storage configuration

### Exit criteria

- editors can create and save content
- per-locale publish state exists
- inquiry storage works
- category hierarchy is editable
- product documents can be attached
- no public page depends on hard-coded sample data

### Risks

- under-building the admin completeness checks
- letting schema shortcuts break locale or SEO rules later

## Phase 3: Public Website Pages

### Goals

- build the public pages and connect them to CMS-managed content
- implement a high-quality home page and strong detail pages

### Deliverables

- home page
- about page
- products index
- categories index
- hierarchy-aware category detail page
- product detail page
- manufacturers index
- manufacturer detail page
- contact page
- inquiry submission flow
- optional public price display and contact-for-pricing fallback
- public product document links where content exists

### Dependencies

- Phase 2 CMS and data model
- initial content or representative seed data

### Exit criteria

- all core public routes render from managed data
- product/category/manufacturer cross-linking works
- inquiry flow functions from general and contextual entry points
- home page feels like a B2B website, not a dashboard clone

### Risks

- public design slipping into dashboard-like composition
- thin content making the pages technically complete but commercially weak

## Phase 4: SEO Foundation

### Goals

- implement the technical SEO rules already specified
- make publication safe from an indexing standpoint

### Deliverables

- canonical generation
- hreflang generation
- metadata generation
- sitemap
- robots
- slug validation
- hierarchy-aware category path generation
- non-public locale protection
- breadcrumbs and semantic HTML review

### Dependencies

- Phase 3 public pages
- stable content model

### Exit criteria

- no draft or incomplete content appears in sitemap
- locale alternates only exist for valid published pages
- metadata is generated from CMS data consistently
- Persian remains non-public and non-indexed

### Risks

- hidden publication bugs leaking incomplete pages
- treating SEO as metadata-only while ignoring content quality

## Phase 5: Polish / Testing / Content Readiness

### Goals

- harden quality
- verify responsive/accessibility behavior
- validate launch readiness with real content

### Deliverables

- unit/component/e2e coverage for critical flows
- responsive QA
- accessibility pass
- logging and operational error review
- content readiness review
- launch checklist

### Dependencies

- all previous phases
- near-final content inputs

### Exit criteria

- critical flows tested
- public pages meet content and SEO minimums
- admin publishing rules hold under realistic usage
- launch blockers are either resolved or explicitly accepted

### Risks

- real content revealing schema gaps too late
- untranslated or low-quality content blocking launch

## Phase sequencing notes

- Do not start with page polish before Phase 2 publish logic exists
- Do not publish public pages before SEO gating is implemented
- Do not enable Persian publicly before RTL and content readiness are complete
- Do not add paid-service dependencies just to complete MVP scope

## Recommended order of implementation effort inside the roadmap

1. schema and locale rules
2. admin publishing flows
3. home page and catalog pages
4. SEO plumbing
5. final polish and launch readiness
