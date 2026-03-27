# Final Product Decisions

## Locked decisions from documentation closure pass

### Public branding

- official public company name: `Abadis Tejarat Arka`
- short brand for compact UI areas: `ATA`
- reuse the existing ATA logo as the website logo
- `ATA CRM` is not the public website brand name

### Typography

- MVP primary font: `Manrope`
- do not introduce a secondary display font for MVP unless clearly justified

### Locales

- supported locales in architecture: `en`, `fr`, `fa`
- public locales for MVP: `en`, `fr`
- default public locale for MVP: `en`
- Persian/Farsi is fully modeled but unpublished and non-indexed
- Persian remains editable/admin-manageable but not public

### Audience and tone

- primary audience: B2B companies and their representatives
- tone and CTA strategy must reflect a professional B2B informational catalog, not retail ecommerce

### Category structure

- categories support multiple hierarchy levels from the start

### Manufacturer meaning

- manufacturer means the main product producer/brand only in MVP
- supplier/partner/reseller concepts are not modeled in MVP

### Product availability

- availability is admin-defined and informational only
- supported statuses:
  - `in_stock`
  - `available_on_request`
  - `out_of_stock`
  - `discontinued`

### Pricing

- products may optionally display a public price
- if no public price is set, the product page must show a contact-for-pricing message

### Inquiry handling

- product/contact inquiries are stored in the database
- inquiries are visible in a dedicated admin section
- no paid third-party service is required for inquiry handling
- email notification infrastructure is optional and non-core for MVP

### Files / product documents

- the system must support attaching files/documents to products
- public exposure of files is supported when content is available

### Cost constraint

- MVP must avoid paid-service dependencies for core functionality

## Use of this document

This file exists to record the final decisions that are no longer open questions.

All architecture, CMS, UX, multilingual, SEO, and acceptance docs should remain consistent with this record.
