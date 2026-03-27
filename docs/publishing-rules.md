# Publishing Rules

## Core rule

Public publication is not a single toggle. A page or entity is public only when all relevant publication conditions are satisfied.

## Public publication gate

An item is public only if:

1. locale visibility is `public`
2. base entity status is `published`
3. locale translation status is `published`
4. required content fields are complete
5. required SEO fields are complete
6. any entity-specific dependencies exist

## Entity-specific dependency rules

### Product

Before a product locale can publish:
- category exists
- manufacturer exists
- availability status exists
- at least one image exists
- localized slug exists
- either a public price exists or a contact-for-pricing message is available

### Category

Before a category locale can publish:
- localized slug path exists
- descriptive content exists
- at least one relevant published product is available in that locale
- parent hierarchy is valid

### Manufacturer

Before a manufacturer locale can publish:
- localized slug exists
- profile content exists
- at least one related published product exists

### Home

Before a home locale can publish:
- hero and CTA content exist
- featured sections are populated or intentionally disabled

### Product documents

Before a product document appears publicly:
- parent product locale is public
- document is marked `is_public`
- file exists and is valid
- localized label exists for that public locale

## Indexing rules

Public indexing is allowed only for valid public pages.

Draft, review, archived, incomplete, or internal-only locale content must:
- stay out of sitemap
- stay out of hreflang
- avoid indexable canonicals

## Locale rules

- `en` and `fr` may be public
- `fa` remains internal-only until explicitly enabled
- missing French content must not display English fallback on public routes
- Persian content must never appear publicly before rollout approval

## Slug rules

- Slug required for every routable translation
- Slug must be locale-specific
- Product and manufacturer slugs must be unique for their content type and locale
- Category slug segments must be unique among siblings and combine into a unique localized path
- Slug changes after publication should produce redirects in implementation

## Pricing rules

- Public pricing is optional
- If a public price is not set, the product page must show a localized contact-for-pricing message
- Public prices remain informational and must not imply online checkout

## Inquiry rules

- Contact requests remain internal data only
- inquiry forms must capture source locale and source page
- product/manufacturer context should be attached when applicable
- inquiry storage must work without third-party notification tooling

## Media rules

- publishable products require at least one image
- media files must be valid and safe
- alt text behavior must be clear before publication
- public product documents must be intentionally marked and labeled

## Editorial responsibility rule

If content is unknown, incomplete, or commercially unsafe:
- keep it in `draft` or `review`
- do not publish it just to fill a route
