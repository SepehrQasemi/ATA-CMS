# Admin Form Requirements

## Shared form principles

- Separate base fields from locale-specific fields
- Show locale tabs for `en`, `fr`, `fa`
- Display completeness and publish status per locale
- Keep destructive actions clearly separated from save/publish actions
- Validate on both client and server

## Product form

### Base fields

- SKU
- category
- manufacturer
- availability status
- public price amount
- public price currency
- public price unit label
- price last verified date
- featured flag
- primary image
- base publish status

### Locale fields

- name
- slug
- short description
- long description
- availability note
- contact-for-pricing message
- SEO title
- SEO description

### Child editors

- images
- specs
- documents

### Publish validation

- category required
- manufacturer required
- at least one image required
- locale slug required
- locale summary required
- metadata required
- if price amount exists, currency required
- if no public price exists, contact-for-pricing copy required through product or site settings

## Category form

### Base fields

- internal code
- parent category
- featured flag
- sort order
- hero image
- base publish status

### Locale fields

- name
- slug segment
- short description
- body
- SEO title
- SEO description

### Publish validation

- localized slug segment required
- descriptive content required
- metadata required
- no cyclical parent assignment

## Manufacturer form

### Base fields

- internal code
- origin country
- website
- logo
- hero image
- featured flag
- base publish status

### Locale fields

- name
- slug
- summary
- body
- SEO title
- SEO description

### Publish validation

- localized slug required
- summary/body required
- metadata required
- manufacturer must represent a producer/brand, not a reseller/supplier record

## Page form

### Base fields

- page key
- navigation visibility
- template or section schema
- base publish status

### Locale fields

- title
- slug where applicable
- structured content sections
- SEO title
- SEO description

### Publish validation

- required system sections completed
- metadata completed

## Settings form

### Global fields

- default locale
- public locales
- contact email
- phone
- social links
- navigation/footer controls
- search-console verification token

### Locale fields

- site name
- site tagline
- footer blurb
- default meta suffix
- contact intro
- default contact-for-pricing message

## Inquiry record form

This should mostly be a review form, not a creation form.

Editable fields:
- status
- internal notes

Read-only submitted fields:
- source locale
- source page
- linked product/manufacturer
- contact details
- message
