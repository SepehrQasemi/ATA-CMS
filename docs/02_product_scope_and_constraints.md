# Product Scope And Constraints

## Scope summary

The new website is a multilingual B2B trading-company website for `Abadis Tejarat Arka`, with `ATA` as the approved short brand label in compact UI areas. Its job is to publish company information, products, categories, and manufacturers, then capture informational inquiries.

It must behave like a serious public catalog, not like a transactional storefront and not like an internal CRM.

## Hard business constraints

### Commercial model

- No cart
- No checkout
- No payment flow
- No online ordering
- No customer account area in MVP
- No transactional stock reservation

### Product-domain rules

- Category structure must support multiple hierarchy levels from the start
- Every product belongs to exactly one category node in MVP
- Every product belongs to exactly one manufacturer / producer in MVP
- Manufacturers are first-class entities with their own public pages
- Manufacturer detail pages must list related published products
- Product availability is informational only
- In MVP, `manufacturer` means the main product producer/brand only
- Do not model supplier, partner, distributor, or reseller concepts in MVP

### Supported availability statuses

- `in_stock`
- `available_on_request`
- `out_of_stock`
- `discontinued`

### Availability messaging constraint

The site must explicitly support the case where a product is not currently in stock but can still be sourced after contact.

This means:
- availability UI cannot be binary
- inquiry copy must adapt to availability state
- `available_on_request` must be treated as a real commercial state, not a workaround

### Inquiry model

- Inquiries are contact requests, not orders
- Contact forms can be general or product/manufacturer-linked
- Submitted inquiries should carry context about the source page and selected entity
- The public UI must avoid language that implies immediate purchase or guaranteed availability
- Inquiries must be stored in the database and reviewed inside a dedicated admin section
- Email notifications are optional and non-core for MVP

### Pricing model

- Products may optionally display a public price
- If no public price is configured, the product page must show a contact-for-pricing message
- Public pricing remains informational and does not imply transactional purchase

### Product files/documents

- Products must support attached files/documents
- Product files may be exposed publicly when content exists and is marked for public use

## MVP functional scope

### Public-facing MVP

- Home page
- About page
- Products index
- Categories index
- Category detail pages
- Product detail pages
- Manufacturers index
- Manufacturer detail pages
- Contact page

### CMS/admin MVP

- Dashboard
- Pages
- Products
- Categories
- Manufacturers
- Media
- Inquiries
- Settings
- SEO controls

## Explicit non-goals for MVP

- Ecommerce
- Quotation engine
- CRM embedding
- Real-time stock sync
- Customer portal
- Advanced distributor network management
- Marketplace features
- Blog/content-hub system unless explicitly added later
- Full DAM/PIM platform behavior

## User-intent scope

### Public intents the site must support well

- Understand who ATA is
- Browse product families quickly
- Evaluate whether a product is relevant
- See who manufactures or produces a product
- See a public price when ATA intentionally exposes one
- Understand when pricing requires direct contact
- Discover related products from a manufacturer
- Contact ATA with enough context for follow-up

### Internal intents the CMS must support well

- Add and publish a product without developer help
- Manage per-locale content and slugs safely
- Prevent incomplete translations from leaking public
- Keep metadata and social previews controlled
- Review and respond to inquiries with source context

## Home page constraint

The home page is a strategic page and must not be treated as a temporary stub.

It must support:
- brand positioning
- trust building
- category discovery
- featured products
- featured manufacturers
- inquiry CTA flow
- SEO-relevant content blocks

## SEO constraints

- Localized routes and slugs must be first-class, not retrofitted later
- Draft and incomplete content must never leak into sitemap, hreflang, or public indexing
- Product/category/manufacturer pages need minimum content thresholds before publication
- Canonicals and locale alternates must be systematic, not hand-managed ad hoc

## Multilingual constraints

- Locales: `en`, `fr`, `fa`
- Public at launch: `en`, `fr`
- Architected but non-public: `fa`
- Future Persian support must be RTL-aware
- Locale publication must be controlled per translation
- Missing translations must not silently fall back to another locale on public entity pages

## Editorial constraints

- Editors should manage structured fields, not arbitrary HTML-heavy layouts
- Home page sections should be configurable, but within a controlled schema
- Products, categories, and manufacturers should use predictable form-based entry
- SEO fields should be editable but validated against minimum content rules
- Product pricing and product documents should be managed through explicit fields, not hidden ad hoc content

## Architecture constraints

- Must remain a standalone app for now
- Must not depend on ATA-CRM runtime availability
- Must still leave room for future integration
- Must stay operationally lighter than adopting a separate enterprise CMS product
- Must avoid paid-service dependencies for core MVP functionality

## Brand constraint

The website must reuse ATA-CRM brand evidence where it is reliable:
- logo
- primary palette
- broad visual character

It must not:
- invent a disconnected identity
- copy the CRM dashboard layout as the public website
- reuse known inconsistent assets like the current generic favicon

## Practical implications for the build phase

- Choose a structured content model over a flexible page-builder
- Treat translation completeness as a publish-time gate
- Model manufacturer as a real entity now, not an afterthought
- Model categories as hierarchical from the first schema version
- Support optional public pricing without ecommerce behavior
- Support product documents in the base content model
- Build public and admin in one codebase, but with separate route areas and security boundaries
- Prioritize product, category, manufacturer, and inquiry flows before optional expansion pages
