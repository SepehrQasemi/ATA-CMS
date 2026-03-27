# UI/UX Specification

## Design objective

Create a public-facing website that clearly belongs to the ATA ecosystem, but feels like a trusted B2B catalog and company website rather than an internal SaaS dashboard.

Public naming rules:
- official public company name: `Abadis Tejarat Arka`
- short brand for compact UI areas: `ATA`
- `ATA CRM` is not the public website brand

## Core UI direction

### Reuse from ATA-CRM

- ATA red as the main action color
- warm off-white/blush surface family
- dark plum accent as a secondary tone
- rounded card language
- subtle gradients and radial background highlights
- practical, confident tone rather than sterile corporate minimalism
- existing ATA logo

### Do not copy literally from ATA-CRM

- fixed dark dashboard sidebar
- workspace subtabs as primary public navigation
- dense CRM table-first layouts
- emoji iconography
- generic CRM login/auth composition

## Recommended public visual language

- generous section spacing compared with the CRM
- stronger typography hierarchy without introducing a second display font in MVP
- image-backed hero zones where real assets exist
- restrained but noticeable brand accents
- section-based storytelling on the home page
- structured cards for category, product, and manufacturer discovery

## Typography direction

Final MVP typography decision:
- `Manrope` for body, headings, forms, and navigation
- no secondary display font in MVP unless later justified by a real brand need

Reason:
- simpler implementation
- cleaner multilingual consistency
- lower risk of visual drift away from the existing ATA tone

## Tone of UI copy

- professional
- direct
- clear
- sourcing-oriented
- trust-building
- explicitly B2B

Avoid:
- hype-heavy startup language
- vague innovation filler
- transactional retail phrasing like `buy now`
- consumer ecommerce urgency patterns

## Accessibility baseline

- semantic landmarks on every page
- visible focus states
- accessible contrast across red and blush surfaces
- full keyboard support for navigation and forms
- descriptive labels and error states on inquiry forms
- correct `lang` and future `dir` handling per locale
- alt text discipline for product and manufacturer imagery

## Responsive expectations

### Mobile

- home page sections must stack cleanly
- filters on product/category indexes should collapse into compact controls
- CTA buttons remain visible without overwhelming the layout
- inquiry form should stay short and usable

### Tablet

- category/product/manufacturer cards can move to 2-column grids
- nav can collapse to a menu drawer or compact header

### Desktop

- strong above-the-fold hierarchy on home
- persistent breadcrumbs and related-content sections on detail pages
- content should feel credible and spacious, not empty

## Key page specifications

## Home page

The home page is the most important page in the project.

### Goals

- explain who Abadis Tejarat Arka is
- show what ATA trades
- establish trust fast
- direct B2B visitors to products, categories, manufacturers, and contact

### Required section structure

1. Hero
2. Company positioning / who ATA serves
3. Featured categories
4. Featured products
5. Featured manufacturers
6. Company strengths / trust signals
7. Inquiry CTA band
8. Optional FAQ or support block
9. Footer

### CTA strategy

Primary CTA:
- contact or inquiry action

Secondary CTAs:
- browse products
- view categories
- explore manufacturers

### Visual hierarchy

- hero should lead with company/trading clarity, not empty slogan language
- category and product discovery must appear above weak corporate filler
- trust content should sit before the final CTA, not buried in the footer

## Products index

### Goals

- help visitors browse the catalog quickly
- support filtering without feeling like an internal tool
- route users into detail pages

### UX expectations

- clean grid or hybrid grid/list
- visible category/manufacturer context on cards
- availability visible but not dominant
- optional public price shown only when intentionally set
- otherwise product cards should keep the CTA inquiry-oriented
- strong breadcrumbs and page intro copy

## Category page

### Goals

- act as a real thematic landing page, not only a filter result
- introduce the category branch in human language
- list relevant products clearly
- support deeper subcategory navigation where relevant

### UX expectations

- category header with explanatory copy
- optional child-category links near the top
- strong product listing below
- related manufacturers if meaningful
- CTA to contact about category sourcing

## Product detail page

### Goals

- answer `what is this, who makes it, is it available, what does it cost if public, and what should I do next?`

### UX expectations

- product title and category context
- availability badge with clear sourcing message
- public price if available, otherwise a clear contact-for-pricing message
- product summary and detailed description
- key specs presented before overly long prose
- manufacturer block visible early
- public documents/download links if available
- inquiry CTA repeated after core content

## Manufacturers index

### Goals

- show ATA's producer/brand network as a credibility layer
- support browsing by manufacturer

### UX expectations

- simple, trustworthy listing
- logo or emblem if available
- summary text and product counts if useful
- terminology stays consistent with producer/brand, not supplier/reseller

## Manufacturer detail page

### Goals

- explain who the producer/brand is
- connect manufacturer credibility to actual catalog products

### UX expectations

- concise manufacturer profile
- origin and identity facts where appropriate
- product listing directly below the intro
- CTA for sourcing inquiry

## Contact page

### Goals

- reduce friction to inquiry
- make Abadis Tejarat Arka feel reachable and professional
- reinforce that the site is for B2B contact, not online checkout

### UX expectations

- clear intro
- compact but serious form
- contact details and response expectation
- privacy/consent note
- contextual product/manufacturer info when arriving from a detail page

## Admin dashboard

### Goals

- surface editorial work, not business intelligence overload

### Required dashboard widgets

- content counts by entity
- draft/review/published counts
- missing locale coverage alerts
- recent inquiries
- SEO health shortcuts

## Admin content forms

### Goals

- make structured editing easy
- reduce accidental publication mistakes
- expose locale-specific completeness clearly

### Form expectations

- base entity fields separate from locale fields
- locale tabs or segmented panels
- inline completeness indicators
- preview and publish controls
- lightweight validation feedback

## Reuse of ATA-CRM brand without cloning it

### Correct reuse

- reuse the palette
- reuse the logo
- reuse rounded surfaces and subtle gradients
- reuse the sense of practical seriousness
- keep the typography simple with a Manrope-only MVP system

### Incorrect reuse

- transplanting the dark sidebar layout to the public site
- making every page feel like a CRM module
- using admin table UI patterns as the main public browsing experience

## Supporting wireframes

Detailed text wireframes are documented separately:

- [`docs/wireframes/home.md`](/C:/dev/ATA_Website/docs/wireframes/home.md)
- [`docs/wireframes/products.md`](/C:/dev/ATA_Website/docs/wireframes/products.md)
- [`docs/wireframes/category.md`](/C:/dev/ATA_Website/docs/wireframes/category.md)
- [`docs/wireframes/product.md`](/C:/dev/ATA_Website/docs/wireframes/product.md)
- [`docs/wireframes/manufacturers.md`](/C:/dev/ATA_Website/docs/wireframes/manufacturers.md)
- [`docs/wireframes/manufacturer.md`](/C:/dev/ATA_Website/docs/wireframes/manufacturer.md)
- [`docs/wireframes/contact.md`](/C:/dev/ATA_Website/docs/wireframes/contact.md)
