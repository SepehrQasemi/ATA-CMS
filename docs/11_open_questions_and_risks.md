# Open Questions And Risks

## Remaining open questions needing human input

These questions no longer affect the core architecture. They matter for launch content, operational readiness, or final visual polish.

### 1. What exact categories, products, and manufacturers will exist at launch?

Why it matters:
- initial content entry
- featured home sections
- realistic QA coverage

Blocking level:
- medium for launch content
- low for build start

### 2. Which products, if any, should display a public price in MVP?

Why it matters:
- CMS entry rules
- currency/unit policy
- product-page messaging

Related details still needing confirmation:
- default currency
- whether prices are shown per unit, per kg, per ton, or another business unit
- whether price last-verified dates should be shown publicly

Blocking level:
- low for build start
- medium for final content readiness

### 3. Which product documents will actually be available at launch?

Why it matters:
- content entry workload
- product-page layout density
- public downloads value

Examples:
- datasheets
- catalogs
- certificates
- brochures

Blocking level:
- low for build start
- medium for launch completeness if downloads are promised publicly

### 4. Who owns inquiry handling operationally, and what is the expected response workflow?

Why it matters:
- admin process
- contact details in content
- internal response expectations

Still to clarify:
- primary mailbox/contact owner
- response SLA expectation
- whether inquiries need manual assignment conventions

Blocking level:
- medium for launch operations
- low for build start

### 5. What final favicon and social-sharing asset set should represent the public site?

Resolved already:
- website logo: existing ATA logo
- public company name: Abadis Tejarat Arka
- short brand: ATA

Still open:
- favicon pack design
- default social share image artwork

Blocking level:
- low

### 6. Which legal/supporting pages are mandatory at launch?

Likely candidates:
- privacy
- legal/imprint
- optional cookie notice depending on final analytics choices

Blocking level:
- low for build start
- medium for production launch

## Risks

## Risk: thin catalog content

- Description: technically complete entity pages may still be too weak for SEO or credibility
- Impact: poor search performance and weak user trust
- Mitigation: enforce publication minimums and content requirements before launch

## Risk: multilingual leakage

- Description: incomplete translations or dormant Persian content could leak publicly
- Impact: SEO issues and low-quality user experience
- Mitigation: two-layer publish gating and no public fallback rendering

## Risk: hierarchy complexity handled poorly

- Description: category hierarchy introduces more routing and editorial complexity than flat categories
- Impact: broken breadcrumbs, duplicate pages, or confusing category paths
- Mitigation: centralize path generation, validate parent-child rules, and test hierarchy editing early

## Risk: manufacturer ambiguity reappearing during implementation

- Description: manufacturer may later be confused with CRM supplier/company concepts
- Impact: schema and integration confusion
- Mitigation: keep manufacturer explicitly scoped to producer/brand and document any later CRM mapping separately

## Risk: CMS complexity creep

- Description: requests for more flexibility could turn the CMS into a page-builder or PIM
- Impact: slower implementation and higher maintenance
- Mitigation: keep MVP structured and add only proven future needs

## Risk: home page underinvestment

- Description: teams often spend energy on data and neglect the home page
- Impact: weak first impression and weak conversion
- Mitigation: treat the home page as a first-class deliverable with explicit content and CTA requirements

## Risk: optional pricing miscommunicated as ecommerce

- Description: public prices may be interpreted as online purchasing if the UI is careless
- Impact: user confusion and commercial mismatch
- Mitigation: keep inquiry CTAs primary, avoid retail UI patterns, and use explicit informational-pricing copy

## Current assessment

The major specification questions are now resolved.

The remaining questions are operational or content-specific rather than architectural. They do not block the build phase if the team accepts the documented defaults.

The most important items to answer before final launch are:
- launch catalog inventory
- public pricing policy
- available product documents
- inquiry handling ownership
- required legal/supporting pages
