# Acceptance Checklist For Build Phase

## Product and scope

- The implementation remains non-transactional
- No cart, checkout, payment, or online order flow exists
- Availability uses only the approved informational statuses
- Public pricing is optional and informational only
- Products without a public price show a contact-for-pricing message instead
- Product documents/files are supported in the product model

## Brand and design

- Official public company name is `Abadis Tejarat Arka`
- Compact brand usage uses `ATA`
- ATA logo is reused from the approved brand source
- Public website naming does not use `ATA CRM` as the brand
- Favicon is replaced with an ATA-branded favicon set
- Public UI reflects ATA palette and tone without copying the CRM dashboard layout
- `Manrope` is the single MVP font family unless a documented exception is approved
- One icon system is used consistently

## Public information architecture

- Home page exists and is not a placeholder
- About page exists
- Products index exists
- Categories index and hierarchy-aware detail pages exist
- Product detail pages exist
- Manufacturers index and detail pages exist
- Contact page exists

## CMS scope

- Admin dashboard exists
- Editors can manage pages
- Editors can manage home page sections
- Editors can manage products
- Editors can manage categories
- Editors can manage multi-level category hierarchy
- Editors can manage manufacturers
- Editors can manage media
- Editors can manage product documents
- Editors can review inquiries in a dedicated admin area
- Editors can manage settings and SEO controls

## Multilingual behavior

- Supported locales in architecture are `en`, `fr`, and `fa`
- Public locales are `en` and `fr`
- Default public locale is `en`
- Persian exists in the architecture, is editable in admin, and is not public
- Locale-prefixed public routing is implemented
- Locale-specific slugs are implemented
- Hierarchy-aware category slug paths are implemented
- Incomplete translations cannot publish accidentally
- Public pages do not fall back to another locale's content
- Persian remains non-indexed and absent from public sitemap/hreflang

## SEO foundation

- Canonicals are implemented per locale
- Hreflang is emitted only for valid public locale variants
- Sitemap excludes drafts and non-public locales
- Robots excludes admin and non-public surfaces
- Metadata is generated from CMS-managed fields
- Product/category/manufacturer pages meet minimum content thresholds before publication
- Product pricing metadata does not imply ecommerce when no online purchase flow exists
- Public document links follow the documented indexing rules

## Domain model

- Products belong to categories
- Categories support multiple hierarchy levels
- Products belong to manufacturers
- Manufacturer means the main producer/brand only
- Manufacturer pages list related products
- Product availability is modeled separately from publication status
- Inquiry records are stored in the database and capture source page and locale context
- Product documents are modeled and attachable

## Public UX

- Home page contains trust, discovery, and inquiry sections
- Home page tone is clearly B2B and professional
- Product pages clearly show availability and manufacturer context
- Product pages show either a public price or a contact-for-pricing message
- Category pages behave like real landing pages, not just filters
- Manufacturer pages reinforce sourcing credibility
- Contact flow is clear and professional

## Admin UX

- Base entity fields and locale fields are clearly separated
- Publish status is explicit
- Locale completeness is visible
- SEO fields are visible and validated
- Draft/review/published states are distinguishable
- Inquiry records are reviewable without third-party tooling

## Quality and operations

- Critical public routes render from managed data
- Critical admin forms save and validate correctly
- Inquiry submission works and persists to the database
- No paid service is required for core MVP operation
- Responsive behavior is verified on mobile and desktop
- Accessibility baseline is reviewed
- Logging/error handling is sufficient for MVP diagnostics

## Final launch readiness

- Required launch content is entered
- English and French launch pages are populated
- No public Persian pages are routable or indexable
- Known risks are documented and accepted or resolved
