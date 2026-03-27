# Sitemap And Information Architecture

## Routing baseline

Recommended public routing strategy:

- Root `/` is not a content page
- Root redirects to `/en`
- All public pages are locale-prefixed
- Only published public locales are publicly routable
- Category detail URLs must support multiple hierarchy levels from day one

Public locales at launch:
- `en`
- `fr`

Architected but non-public:
- `fa`

## Public sitemap

### `/`

- Purpose: neutral entrypoint only
- Target user intent: none; system route
- Main content blocks: none
- Required data dependencies: locale configuration
- SEO importance: none
- Language behavior: redirects to default public locale `en`
- Indexable/public: public route, not indexable

### `/{locale}`

- Purpose: strategic home page for Abadis Tejarat Arka, using `ATA` only where compact branding is needed
- Target user intent: understand the company quickly, validate B2B credibility, discover products/categories/manufacturers, and move toward inquiry
- Main content blocks:
  - hero
  - company positioning
  - featured categories
  - featured products
  - featured manufacturers
  - company strengths / trust signals
  - inquiry CTA band
  - optional FAQ or support block
  - footer
- Required data dependencies:
  - home page translation content
  - featured categories
  - featured products
  - featured manufacturers
  - site settings and footer/navigation content
- SEO importance: critical
- Language behavior: localized content and localized metadata per public locale
- Indexable/public: yes

### `/{locale}/about`

- Purpose: explain Abadis Tejarat Arka, its trading capabilities, market focus, and professional B2B positioning
- Target user intent: validate credibility before inquiry
- Main content blocks:
  - company overview
  - mission/positioning
  - sourcing or trading strengths
  - industries or market coverage
  - CTA to products/contact
- Required data dependencies:
  - page record
  - page translation
  - site settings
- SEO importance: high
- Language behavior: per-locale translation and slug
- Indexable/public: yes

### `/{locale}/products`

- Purpose: browse and filter the informational B2B catalog
- Target user intent: find relevant products and move into detail pages or inquiry
- Main content blocks:
  - page intro
  - filter controls
  - product card grid or list
  - featured/priority categories
  - related manufacturers linkouts
  - CTA to contact
- Required data dependencies:
  - published products in locale
  - categories
  - manufacturers for filter/context
  - optional featured flags
- SEO importance: high
- Language behavior: localized page copy and localized product names/slugs
- Indexable/public: yes

### `/{locale}/categories`

- Purpose: expose the category hierarchy as an additional discovery layer
- Target user intent: browse by product family and move into deeper category branches or products
- Main content blocks:
  - category intro
  - top-level and child category cards
  - optional featured products
  - CTA to contact
- Required data dependencies:
  - published categories in locale
  - parent/child hierarchy
  - category summaries
  - related product counts
- SEO importance: medium-high
- Language behavior: localized category names and hierarchy-aware slug paths
- Indexable/public: yes

### `/{locale}/categories/{...categoryPath}`

- Purpose: indexable category landing page listing relevant products and optionally child categories and related manufacturers
- Target user intent: explore one category branch deeply
- Main content blocks:
  - category hero
  - category description
  - optional child-category links
  - product list
  - related manufacturers
  - inquiry CTA
  - internal links to product pages
- Required data dependencies:
  - category base record
  - category translation
  - category ancestry / descendants
  - related published products
  - optionally related manufacturers derived from products
- SEO importance: critical
- Language behavior: locale-specific slug path and translation
- Indexable/public: yes, only when minimum content rules are met

### `/{locale}/products/{productSlug}`

- Purpose: primary commercial detail page for an individual product
- Target user intent: evaluate fit, manufacturer, availability, public pricing if available, supporting documents, and next contact step
- Main content blocks:
  - product hero
  - availability badge and sourcing message
  - price block or contact-for-pricing message
  - product overview
  - specifications
  - image gallery
  - manufacturer block
  - related products
  - inquiry CTA/form
  - optional downloads/documents
- Required data dependencies:
  - product base record
  - product translation
  - category
  - manufacturer
  - product images
  - product specs
  - product documents
  - site settings for inquiry routing
- SEO importance: critical
- Language behavior: locale-specific slug and translation
- Indexable/public: yes, only when fully publishable for that locale

### `/{locale}/manufacturers`

- Purpose: expose the producer/brand catalog and support discovery by manufacturer
- Target user intent: browse product producers/brands and validate sourcing credibility
- Main content blocks:
  - page intro
  - manufacturer cards
  - optional geographic or category context
  - CTA to contact
- Required data dependencies:
  - published manufacturers
  - manufacturer summaries
  - related product counts
- SEO importance: high
- Language behavior: localized names and slugs
- Indexable/public: yes

### `/{locale}/manufacturers/{manufacturerSlug}`

- Purpose: manufacturer detail page that reinforces sourcing credibility and routes visitors to related products
- Target user intent: evaluate a producer/brand and see what ATA offers from that producer/brand
- Main content blocks:
  - manufacturer hero
  - manufacturer overview
  - country/origin and company facts
  - related product list
  - CTA to inquiry
- Required data dependencies:
  - manufacturer base record
  - manufacturer translation
  - related published products
  - optional logo/image
- SEO importance: critical
- Language behavior: locale-specific slug and translation
- Indexable/public: yes, if translation is complete and manufacturer has enough public context

### `/{locale}/contact`

- Purpose: central B2B inquiry and contact page
- Target user intent: contact Abadis Tejarat Arka, request sourcing help, ask about a product/manufacturer, or request pricing
- Main content blocks:
  - contact intro
  - inquiry form
  - direct company contact details
  - response expectation note
  - optional map/address or regional context
- Required data dependencies:
  - contact page content
  - site settings
  - inquiry form config
- SEO importance: medium
- Language behavior: localized copy; form stores source locale
- Indexable/public: yes

## Recommended utility pages after MVP foundation

These are useful and low-risk, but not core branded pages for the initial scope:

- `/{locale}/privacy`
- `/{locale}/legal`
- `/{locale}/downloads` only if real files exist
- `/{locale}/industries` only if ATA has validated industry segmentation copy

## Admin / CMS sitemap

Admin routes should be protected, non-indexable, and excluded from public sitemaps.

### `/admin`

- Purpose: editorial dashboard and operational summary
- Target user intent: understand content status, pending work, and inquiry activity
- Main content blocks:
  - content counts
  - draft vs published status
  - locale completeness warnings
  - recent inquiries
  - media/inventory shortcuts
- Required data dependencies:
  - aggregate counts across content entities
  - inquiry counts
  - locale completeness metrics
- SEO importance: none
- Language behavior: admin UI can be English-first in MVP; content locale data still visible
- Indexable/public: protected, not indexable

### `/admin/pages`

- Purpose: manage static/system pages such as home, about, contact, and utility pages
- Target user intent: edit editorial content and translation state
- Main content blocks:
  - page list
  - locale status indicators
  - edit actions
- Required data dependencies:
  - pages
  - page translations
- SEO importance: none directly, but operationally important
- Language behavior: edit all locales; public visibility depends on locale publication rules
- Indexable/public: protected, not indexable

### `/admin/pages/{id}`

- Purpose: edit page content, sections, translation status, and SEO
- Target user intent: update one page safely
- Main content blocks:
  - locale tabs
  - structured content sections
  - SEO fields
  - publish controls
  - preview link
- Required data dependencies:
  - page
  - page translations
  - media references
- SEO importance: none directly
- Language behavior: per-locale editing and publication
- Indexable/public: protected, not indexable

### `/admin/products`

- Purpose: manage products
- Target user intent: create/edit catalog entries, keep availability accurate, manage optional public pricing, and attach public documents
- Main content blocks:
  - product list
  - filters
  - publish/availability badges
  - locale completeness indicators
- Required data dependencies:
  - products
  - product translations
  - categories
  - manufacturers
- SEO importance: none directly
- Language behavior: per-locale editing
- Indexable/public: protected, not indexable

### `/admin/products/{id}`

- Purpose: edit a single product
- Target user intent: manage product content, images, specs, documents, pricing display, SEO, and inquiry context
- Main content blocks:
  - core data
  - locale tabs
  - product specs
  - images
  - documents
  - SEO
  - preview/publish
- Required data dependencies:
  - product
  - product translations
  - product images
  - product specs
  - product documents
  - category and manufacturer relations
- SEO importance: none directly
- Language behavior: per-locale translation and publish
- Indexable/public: protected, not indexable

### `/admin/categories`

- Purpose: manage the multi-level category tree
- Target user intent: maintain taxonomy and category landing pages
- Main content blocks:
  - category tree/list
  - parent-child relationships
  - order/featured flags
  - publish state
  - locale completeness
- Required data dependencies:
  - categories
  - category translations
  - hierarchy metadata
  - product counts
- SEO importance: none directly
- Language behavior: per-locale content
- Indexable/public: protected, not indexable

### `/admin/categories/{id}`

- Purpose: edit a single category node
- Target user intent: maintain hierarchy, SEO hub content, and related product positioning
- Main content blocks:
  - base settings
  - parent selection
  - locale tabs
  - SEO
  - optional featured products selection
  - preview/publish
- Required data dependencies:
  - category
  - category translations
  - related products
  - parent/child relationships
- SEO importance: none directly
- Language behavior: per-locale translation and slug path
- Indexable/public: protected, not indexable

### `/admin/manufacturers`

- Purpose: manage manufacturer entities
- Target user intent: keep producer/brand data and linked products accurate
- Main content blocks:
  - manufacturer list
  - status and completeness
  - product counts
- Required data dependencies:
  - manufacturers
  - manufacturer translations
  - related product counts
- SEO importance: none directly
- Language behavior: per-locale content
- Indexable/public: protected, not indexable

### `/admin/manufacturers/{id}`

- Purpose: edit a single manufacturer
- Target user intent: manage producer/brand profile, locale content, and related product presentation
- Main content blocks:
  - core identity
  - locale tabs
  - related products
  - SEO
  - preview/publish
- Required data dependencies:
  - manufacturer
  - manufacturer translations
  - linked products
- SEO importance: none directly
- Language behavior: per-locale translation and publishing
- Indexable/public: protected, not indexable

### `/admin/media`

- Purpose: upload and manage reusable images/files
- Target user intent: assign safe, optimized media to content and product documents
- Main content blocks:
  - media grid/list
  - metadata
  - usage references
  - upload/replace actions
- Required data dependencies:
  - media
  - entity usage references
- SEO importance: indirect only
- Language behavior: mostly shared assets with optional title/alt guidance
- Indexable/public: protected, not indexable

### `/admin/inquiries`

- Purpose: review, triage, and close contact requests stored in the website database
- Target user intent: handle inbound B2B demand efficiently without requiring a third-party service
- Main content blocks:
  - inquiry list
  - status filters
  - source context
  - notes
- Required data dependencies:
  - contact requests
  - product/manufacturer/page references
- SEO importance: none
- Language behavior: store request locale and display source page locale
- Indexable/public: protected, not indexable

### `/admin/settings`

- Purpose: manage site-wide operational settings
- Target user intent: keep navigation, contact details, locale flags, and defaults accurate
- Main content blocks:
  - contact settings
  - locale settings
  - navigation/footer config
  - social links
  - search-console and verification settings
- Required data dependencies:
  - site settings
  - site setting translations
- SEO importance: indirect but important
- Language behavior: mix of global settings and translatable settings
- Indexable/public: protected, not indexable

### `/admin/seo`

- Purpose: central overview for metadata health and indexation safety
- Target user intent: detect weak content and missing SEO fields before publication
- Main content blocks:
  - missing metadata report
  - missing slug/path report
  - locale publication mismatches
  - sitemap preview
  - redirect management backlog
- Required data dependencies:
  - all publishable entities
  - metadata fields
  - redirect rules
- SEO importance: operationally critical
- Language behavior: locale-specific status reporting
- Indexable/public: protected, not indexable

## IA conclusion

The public IA should stay narrow and strong:

- home
- about
- products
- categories
- manufacturers
- contact

The admin IA should stay structured and operational:

- no arbitrary page builder
- no sprawling settings maze
- no hidden publish states

That balance is appropriate for an SEO-oriented B2B catalog MVP.
