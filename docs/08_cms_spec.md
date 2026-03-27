# CMS Specification

## CMS objective

The CMS should be just powerful enough to manage the public website safely:

- pages
- home page sections
- products
- categories
- manufacturers
- media
- inquiries
- SEO metadata
- locale publication state
- navigation and footer settings

It should not become a generic page-builder platform.

## Editorial model

- One protected admin area inside the same application
- Structured forms, not arbitrary layout editing
- Base entity data separated from locale-specific content
- Explicit draft/review/published states
- Locale visibility and completeness shown before publish
- Persian is editable in admin but must remain unpublished and non-indexed in MVP

## Editorial workflow baseline

1. Create or update base entity
2. Fill locale-specific fields
3. Resolve validation/completeness warnings
4. Save as `draft` or `review`
5. Publish base entity and translation only when ready
6. Changes to published content should remain deliberate, not auto-public by accident

## Admin areas

## Dashboard

### Key actions

- view content counts
- view draft/review/published totals
- view missing locale coverage
- view recent inquiries
- jump to priority edit screens

### Required fields or data

- content aggregates by entity
- recent inquiry list
- locale completeness summary

### Validations

- none beyond data integrity

### Editorial workflow role

- operational overview only

### Publish workflow role

- highlights blocked publish states and missing metadata

### Nice-to-haves later, not MVP

- per-editor workload
- scheduled publication calendar

## Pages

### Key actions

- create page records where allowed
- edit system pages such as home, about, contact
- edit per-locale content
- manage SEO fields
- preview page

### Required fields

- page key
- locale content blocks
- title
- slug where routed
- publish status

### Validations

- one system page per reserved page key
- required locale fields before translation publication
- slug uniqueness

### Editorial workflow

- pages use structured sections rather than raw long-form HTML wherever practical

### Publish workflow

- translation can only publish if required sections and metadata are complete

### Nice-to-haves later, not MVP

- reusable page-section templates
- scheduled publishing

## Home page sections

### Key actions

- manage hero copy
- manage featured categories/products/manufacturers
- manage trust blocks
- manage CTA sections
- reorder approved home sections within a fixed schema

### Required fields

- hero heading
- hero subheading
- primary CTA label/link
- featured entity selections

### Validations

- no empty featured blocks on published home page
- featured references must point to published entities in that locale where relevant

### Editorial workflow

- home sections should be edited through a dedicated structured form, not hidden inside a blob field without UI controls

### Publish workflow

- home locale must pass all required-section checks before publication

### Nice-to-haves later, not MVP

- A/B hero testing

## Products

### Key actions

- create/edit product base data
- assign category and manufacturer
- manage availability status
- optionally set a public price
- upload/select images
- attach public or internal product documents
- manage localized product content
- manage localized specs
- publish/unpublish per locale

### Required fields

- category
- manufacturer
- availability status
- localized product name
- localized slug
- short description
- publish status

### Validations

- one category required
- one manufacturer required
- slug uniqueness per locale
- at least one image before locale publication
- required SEO fields before locale publication
- if a public price is set, currency is required
- if no public price is set, contact-for-pricing messaging must exist through product or site translation content

### Editorial workflow

- editors maintain base product data once, then localize content per locale
- pricing stays informational only; no checkout fields or inventory reservation logic

### Publish workflow

- base product must be published
- locale translation must be complete and published

### Nice-to-haves later, not MVP

- bulk import/export
- product duplication
- revision history beyond basic timestamps

## Categories

### Key actions

- create/edit categories
- manage parent-child relationships
- set sort order and featured state
- manage localized landing-page copy
- publish/unpublish per locale

### Required fields

- internal code or identity
- localized name
- localized slug segment
- publish status

### Validations

- category code unique
- slug segment uniqueness among siblings per locale
- no cyclical hierarchy
- at least one related published product before public publication is recommended

### Editorial workflow

- categories are editorial landing pages, not just taxonomy labels
- hierarchy is part of MVP, not a later enhancement

### Publish workflow

- category locale should not publish if it is too thin or empty

### Nice-to-haves later, not MVP

- bulk tree operations

## Manufacturers

### Key actions

- create/edit manufacturer records
- attach logo/image
- manage localized profile content
- review linked products
- publish/unpublish per locale

### Required fields

- manufacturer identity code
- localized name
- localized slug
- publish status

### Validations

- unique identity code
- slug uniqueness per locale
- prevent deletion if linked products exist
- manufacturer represents producer/brand only

### Editorial workflow

- manufacturer pages should be credible profile pages, not just names in a dropdown
- supplier/reseller concepts are intentionally excluded in MVP

### Publish workflow

- do not publish a manufacturer page that has no useful body content or no related published products

### Nice-to-haves later, not MVP

- certifications or badges module
- country grouping filters

## Media

### Key actions

- upload images and documents
- replace files
- inspect usage
- assign titles

### Required fields

- file
- media type
- title or at least original filename retention

### Validations

- allowed file types only
- image size and dimensions within safe limits
- reject dangerous file types

### Editorial workflow

- media is shared infrastructure, not standalone content

### Publish workflow

- referenced content should warn on missing required media

### Nice-to-haves later, not MVP

- image focal point UI
- automatic alt suggestion tooling

## Inquiries

### Key actions

- view submissions
- filter by status
- review source page/product/manufacturer context
- add internal notes
- change status

### Required fields

- inquiry status
- captured contact data
- source locale and source page context

### Validations

- email required for valid inquiry
- message required
- consent required

### Editorial workflow

- inquiry area is operational, not editorial
- inquiries are stored directly in the website database

### Publish workflow

- not applicable

### Nice-to-haves later, not MVP

- CRM lead push
- assignment and SLA tracking
- optional email notifications after the core storage/admin flow exists

## Settings

### Key actions

- manage company contact details
- manage locale visibility
- manage navigation and footer settings
- manage social links
- manage default share image and SEO defaults

### Required fields

- default locale
- public locales
- contact email

### Validations

- one default public locale only
- non-public locales cannot be marked as indexable

### Editorial workflow

- settings changes should be infrequent and controlled

### Publish workflow

- dangerous settings such as locale visibility and default locale should require confirmation

### Nice-to-haves later, not MVP

- environment-based settings preview

## SEO controls

### Key actions

- edit meta titles/descriptions
- view missing metadata
- inspect locale publication mismatches
- preview sitemap participation

### Required fields

- metadata fields for all publishable translations

### Validations

- warn on missing or weak metadata
- prevent publication when required SEO fields are missing

### Editorial workflow

- SEO fields should be part of the normal form, with this area acting as an overview and exception dashboard

### Publish workflow

- translation publication should be blocked if SEO minimums are not met

### Nice-to-haves later, not MVP

- redirect manager
- search snippet preview

## Navigation and footer settings

These should be manageable in CMS settings, not hard-coded.

Recommended editable areas:
- main navigation labels and links
- footer navigation groups
- company contact block
- social links
- short footer company blurb per locale

## Roles and permissions direction

MVP recommendation:
- keep this simple
- start with `admin` and `editor`

What not to add in MVP:
- granular field-level ACL
- complex approval chains
- many role tiers copied from ATA-CRM

## What the CMS should explicitly not manage in MVP

- visual drag-and-drop page building
- ecommerce inventory or ordering
- CRM workflows
- advanced localization automation
- marketing automation journeys
- supplier/reseller/partner relationship modeling

## CMS conclusion

The CMS should optimize for safe publishing and catalog management, not for maximal flexibility.

That is the right trade-off for this project.
