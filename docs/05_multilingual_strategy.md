# Multilingual Strategy

## Core policy

The website is multilingual by architecture from day one, but not every modeled locale is public from day one.

Launch behavior:
- `en`: public
- `fr`: public
- `fa`: architected, editable internally, not public

Default public locale:
- `en`

## Why this matters

This avoids the common failure mode where a future locale is ignored in the data model, then added later through brittle retrofits.

At the same time, it avoids another failure mode:
- partially translated public pages
- accidental indexing of incomplete Persian content
- broken RTL layout appearing before it is ready

## Locale definitions

### `en`

- Public: yes
- Direction: `ltr`
- Role: default public locale
- Routing: locale-prefixed public routes

### `fr`

- Public: yes
- Direction: `ltr`
- Role: full secondary public locale
- Routing: locale-prefixed public routes

### `fa`

- Public: no at launch
- Direction: future `rtl`
- Role: internal-only locale until content and RTL QA are ready
- Routing: no public route exposure

## Public routing pattern

Recommended routing pattern:

- `/` -> redirect to `/en`
- `/en`
- `/en/about`
- `/en/products`
- `/en/categories`
- `/en/categories/{...categoryPath}`
- `/en/products/{slug}`
- `/en/manufacturers/{slug}`
- `/en/contact`
- same structure under `/fr`

Persian:
- no public `/fa/...` output while locale status is `internal_only`

## Why locale-prefixed routing is recommended

- clear SEO separation between languages
- clean hreflang generation
- no ambiguity about canonical URLs
- locale-specific slugs are straightforward
- editors can reason about publication per locale without hidden fallback behavior

## Locale-specific slug strategy

Every routable public entity translation must own its own slug data:

- page translation slug
- category translation slug segment and full localized path
- product translation slug
- manufacturer translation slug

Rules:
- slug data must be stored per locale
- slugs should be lower-case and kebab-case
- product/manufacturer/page slugs must be unique within that content type and locale
- category `slug_segment` should be unique among siblings per locale
- a category's full path must be unique per locale
- if a slug changes after publication, the build should create a redirect during implementation

## Publication rules per locale

Public rendering is allowed only when all of the following are true:

1. the locale visibility is `public`
2. the base entity is `published`
3. the translation row for that locale is `published`
4. the translation passes completeness validation

If any of those fail:
- the page is not public
- it is not included in sitemap
- it is not included in hreflang clusters
- it is not indexable

## Translation completeness requirements

At minimum, a translation must have:

### Static pages

- title
- required slug for routed pages
- core body/sections present
- meta title
- meta description

### Category pages

- localized category name
- localized slug segment and valid hierarchy path
- short description
- body strong enough to introduce the category branch
- SEO title and description

### Product pages

- localized product name
- slug
- short description
- long description or structured body
- availability message appropriate to the locale
- if no public price exists, a localized contact-for-pricing message or a valid site-level default
- SEO title and description
- at least one image on the parent product

### Manufacturer pages

- localized manufacturer name
- slug
- summary
- body
- SEO title and description

### Product documents

- if a document is public, it should have a localized label before being shown on a public locale page

## Fallback strategy

### Public pages

No cross-locale content fallback should be used for public entity pages.

If a French translation is not published:
- the French route should not show English content
- the French route should return a not-found state or be absent from routing
- hreflang should omit that missing French alternative for that entity

Reason:
- mixed-language public pages are poor for both SEO and trust
- fallback hides editorial incompleteness

### Internal admin previews

Admin preview may show:
- missing-field indicators
- comparison with another locale
- draft translation state

But this preview behavior must never leak to public routes.

### Shared non-text data

The following can be shared across locales:
- images
- manufacturer origin country
- availability status enum
- numeric specs
- public price amount and currency
- downloadable files

Localized display labels still belong to the active locale.

## Admin editing expectations

### Editing model

- Editors create one base entity
- Editors fill one translation per locale
- Publish state is controlled at both base and translation levels

### Recommended editorial flow

1. Create base entity and complete English translation
2. Publish English only if complete
3. Add French translation
4. Publish French only after completion review
5. Keep Persian in draft or review until explicitly activated

### Admin UI expectations

- Locale tabs on each content form
- Explicit status badge per locale
- Completeness progress per locale
- No silent auto-translation assumptions
- Warning when a base entity is published but a public locale translation is missing
- Persian remains editable in admin even while non-public

## Persian future-enablement path

Persian should be activated only after all of the following are complete:

1. locale visibility changed from `internal_only` to `public`
2. routing for `/fa/...` enabled
3. `dir="rtl"` support activated
4. typography verified for Persian script
5. navigation, forms, breadcrumbs, and cards tested in RTL
6. Persian metadata, sitemaps, and hreflang enabled
7. robots rules updated to allow indexing if desired

## Persian indexing policy before launch

Before Persian is public:

- do not expose `/fa/...` routes
- do not include Persian URLs in sitemap
- do not emit Persian hreflang links
- do not include Persian in locale switcher on the public site
- do not allow Persian drafts to appear through previewless public URLs

## Relationship to ATA-CRM precedent

ATA-CRM already proves a relevant product decision:

- `en` and `fr` are the active public-facing locales
- `fa` exists in architecture but is archived from the public runtime

The website should keep that same high-level policy, but improve it:
- keep Persian in the domain model
- keep Persian editable internally
- model it correctly for later RTL
- do not map Persian selections back to English in the website build

## Final recommendation

Use locale-prefixed routes, translation-table-based publication, and zero public content fallback.

That gives:
- clean SEO
- predictable editorial control
- safe future Persian rollout
- minimal ambiguity for implementation
