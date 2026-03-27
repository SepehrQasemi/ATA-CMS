# Admin Information Architecture

## Main navigation

- Dashboard
- Pages
- Products
- Categories
- Manufacturers
- Media
- Inquiries
- Settings
- SEO

## Section intent

### Dashboard

- operational overview

### Pages

- static/system content management

### Products

- product base data, translation, specs, pricing, documents, media, SEO

### Categories

- hierarchy management plus category landing-page content

### Manufacturers

- producer/brand profiles and linked products

### Media

- shared assets and product documents

### Inquiries

- inbound contact queue stored in the app database

### Settings

- global site config, locale visibility, navigation/footer

### SEO

- metadata health and publication diagnostics

## Route shape recommendation

- `/admin`
- `/admin/pages`
- `/admin/pages/{id}`
- `/admin/products`
- `/admin/products/{id}`
- `/admin/categories`
- `/admin/categories/{id}`
- `/admin/manufacturers`
- `/admin/manufacturers/{id}`
- `/admin/media`
- `/admin/inquiries`
- `/admin/settings`
- `/admin/seo`

## Global admin UI expectations

- consistent page titles
- clear status badges
- locale tabs where relevant
- save, preview, and publish actions placed consistently
- hierarchy-aware breadcrumbs in category editing
