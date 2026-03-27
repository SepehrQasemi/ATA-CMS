# ATA Website Project Overview

## Core idea

ATA Website is a multilingual, SEO-ready, non-transactional B2B catalog website for the same company ecosystem as ATA-CRM. Its official public company name is `Abadis Tejarat Arka`, with `ATA` reserved as the short brand name for compact UI areas. It is meant to present the company credibly, explain what the business trades, publish strong product and manufacturer pages, and convert anonymous visitors into qualified contact or sourcing inquiries.

The website is not a storefront. It is a public-facing catalog and trust-building layer with an internal CMS.

## What the website is

- A standalone public website for company presentation, catalog browsing, and inquiry capture
- Public brand name: `Abadis Tejarat Arka`
- Compact brand label where space is tight: `ATA`
- A multilingual publishing system with public English and French from day one
- A structured catalog centered on products, hierarchical categories, and manufacturers
- A search-engine-friendly content surface with route, metadata, and publishing discipline built in from the start
- A lightweight internal CMS for editors to manage content and inquiries without needing a separate headless CMS product

## What the website is not

- Not ecommerce
- Not a cart, checkout, payment, or account-based ordering system
- Not a clone of ATA-CRM's internal dashboard
- Not a CRM replacement
- Not a custom page-builder platform
- Not a multi-tenant or white-label system

## Primary user types

### Public users

- Procurement teams, sourcing teams, and company representatives looking for products, categories, and manufacturers
- Potential B2B buyers who need to understand availability, pricing posture, and make a contact request
- Business stakeholders validating the company's credibility before initiating contact
- Search engine visitors landing directly on product, category, or manufacturer pages

### Internal users

- Marketing/editorial staff maintaining content and SEO metadata
- Commercial/internal staff reviewing inquiries and keeping availability messaging accurate
- Admin users managing settings, locales, media, and publishing states

## Business goals

- Present the company with a stronger public identity than a dashboard-style product site
- Publish reusable SEO landing surfaces for product and manufacturer discovery
- Reduce friction between "interested visitor" and "qualified inquiry"
- Make product availability understandable without implying online purchase
- Allow optional public pricing without turning product pages into ecommerce pages
- Keep editorial operations simple enough that content can be maintained continuously
- Keep the MVP viable without requiring paid services

## Content goals

- A strategically important home page with clear trust, value proposition, and CTA flow
- Rich product detail pages with structured product data, availability messaging, and inquiry paths
- Optional public product pricing when configured, with a contact-for-pricing fallback when not configured
- Product documents/files when content exists
- Category pages that function as indexable thematic hubs
- Manufacturer pages that reinforce sourcing credibility and cross-link to related products
- Simple CMS-managed static pages for company and contact content

## Relationship to ATA-CRM

The website and ATA-CRM belong to the same company ecosystem but serve different jobs.

ATA-CRM:
- internal operating tool
- lead, company, contact, task, and sales workflow system
- authenticated operational interface

ATA Website:
- public acquisition, trust, and catalog layer
- anonymous visitor experience
- editorial publishing system

Shared foundations:
- company identity
- brand logo and primary palette
- broad product-domain vocabulary
- future opportunity for data exchange

Public naming boundary:
- `ATA CRM` remains the internal CRM product name
- `Abadis Tejarat Arka` is the public website/company name
- `ATA` is the approved short brand form for compact UI placements

## Why this should be standalone now

- Public-site SEO constraints are different from CRM application concerns
- Public performance, cache strategy, and page rendering should not be coupled to internal CRM workflows
- The content model for multilingual publishing is different from CRM operational tables
- Security posture is cleaner when public catalog and admin scope are isolated from sales operations
- Build velocity improves when the website can evolve without dragging CRM deployment risk behind it

## Future integration possibilities

Integration should stay optional and explicit rather than implicit or database-coupled.

Recommended future integrations:
- push qualified website inquiries into ATA-CRM as leads
- sync shared manufacturer or product reference data through a controlled import/export job
- reuse approved media assets across both apps
- optionally align staff identity between CMS admin and CRM accounts later

Not recommended for MVP:
- shared database tables
- direct reads from CRM operational tables on public page requests
- shared monorepo deployment coupling unless the website proves too small to justify separation

## Product success criteria for the build phase

- Public English and French websites are launchable with locale-specific slugs and metadata
- Persian exists in the model and CMS but stays non-public
- Editors can manage home page, pages, products, hierarchical categories, manufacturers, media, product documents, inquiries, and SEO fields
- Every public entity has explicit publishing control per locale
- Product/manufacturer/category pages are strong enough to be indexable and useful
- Availability is clear, but no page misrepresents the site as transactional ecommerce
- Pricing, when shown, is clearly informational and optional

## Strategic position of the home page

The home page is a primary commercial asset, not a placeholder.

It must:
- communicate what ATA does within seconds
- establish trust through company positioning and sourcing credibility
- guide users toward products, categories, manufacturers, and contact paths
- support SEO without turning into a generic keyword dump

## Working assumptions used in this package

- Public locales at launch: `en`, `fr`
- Default public locale: `en`
- Architected but non-public locale: `fa`
- The later build will use a single Next.js application with both public site and protected admin
- The CMS will be structured and form-driven, not a block-everything page builder
- The website will reuse ATA-CRM brand primitives but should not visually mimic the CRM dashboard layout
- MVP should avoid paid-service requirements for core functionality
