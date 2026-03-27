# Brand Audit From ATA-CRM

## Reference source used

- Repository URL: `https://github.com/SepehrQasemi/ATA-CRM.git`
- Local inspected clone: `C:\dev\ATA-CRM`
- Audited commit: `3932cec1b0ebe05be0717ad97f0888422413cf70`
- Last commit at audit time: `2026-03-12 Clean professor-only artifacts and temp files (#22)`

## Files inspected for brand and design signals

- `web/public/ata-logo.svg`
- `web/app/favicon.ico`
- `web/app/globals.css`
- `web/app/layout.tsx`
- `web/components/brand-logo.tsx`
- `web/components/app-shell.tsx`
- `web/components/public-landing.tsx`
- `web/components/notification-bell.tsx`
- `web/components/page-tip.tsx`
- `web/components/pagination-controls.tsx`
- `web/app/login/page.tsx`
- `web/components/language-switcher.tsx`
- `web/components/locale-provider.tsx`
- `web/lib/i18n.ts`

## Directly observed facts

## Final decisions applied on top of the audit

- Official public website/company name: `Abadis Tejarat Arka`
- Approved short brand for compact UI areas: `ATA`
- Approved website logo: reuse the existing ATA logo
- Public website brand name must not be `ATA CRM`
- MVP primary font: `Manrope`
- No secondary display font for MVP unless later justified with evidence

### Brand naming observed in ATA-CRM

- Product name used in UI: `ATA CRM`
- Expanded company/system name shown under the logo: `Abadis Tejarat Arka`
- The CRM metadata description positions the business as a `CRM platform for food products and additives sales teams`

### Logo assets

- Primary observed logo asset: `web/public/ata-logo.svg`
- The logo is an oval red emblem with white `ATA` lettering
- The SVG uses:
  - filled red ellipse `#f01616`
  - white inner stroke
  - outer red stroke
  - wordmark text rendered in `Arial Black, Arial, sans-serif`
- The logo component always loads this SVG through `BrandLogo`

### Favicon assets

- `web/app/favicon.ico` exists
- The favicon does not visually match the ATA logo
- It appears to be a generic default-style triangular icon rather than an ATA-branded favicon
- This is a concrete brand inconsistency

### Color palette actually used

The strongest reusable palette is defined in `web/app/globals.css`:

| Role | Value | Observation |
| --- | --- | --- |
| Background | `#fff5f5` | warm blush page background |
| Panel | `#ffffff` | white cards and surfaces |
| Text | `#151515` | main text color |
| Muted | `#5f5963` | secondary copy |
| Brand primary | `#e41414` | main CTA and active state red |
| Brand dark | `#b51010` | hover/darker red |
| Accent dark | `#171717` | dark neutral accent |
| Border/line | `#efcdcd` | pink-tinted border color |
| Danger | `#cc2350` | destructive/action danger color |
| Success/ok | `#2a8f60` | positive status color |

Additional hard-coded recurring colors:

- Sidebar gradient: `#4d0f22` to `#2b0813`
- Light red surfaces: `#fff2f2`, `#fff3f3`, `#ffe8e8`, `#ffdede`
- Pink border accents: `#f1b2b2`, `#efb6b6`, `#e58f8f`, `#f2b9b9`
- Sidebar active border accent: `#ffb3c8`
- Pale sidebar text: `#f5dce5`

### CSS variables / design tokens

Observed token layer is hand-authored CSS custom properties rather than a formal token system:

```css
--bg
--panel
--text
--muted
--brand
--brand-2
--accent
--line
--danger
--ok
--radius
--radius-sm
--space
--space-lg
--shadow
```

There is no Tailwind config file defining branded theme tokens. The repo uses Tailwind v4 as a dependency, but the visible UI language is primarily custom CSS in `globals.css`.

### Typography choices

Observed in CSS:
- `font-family: "Manrope", "Space Grotesk", "Segoe UI", Tahoma, sans-serif;`

Observed in logo SVG:
- `Arial Black, Arial, sans-serif`

Important limitation from the audit:
- No `next/font` usage was found
- No hosted font import was found
- This means Manrope and Space Grotesk are stated as intended typography, but not actually guaranteed to load in production from this codebase alone

Final MVP decision:
- treat `Manrope` as the only approved primary font
- do not introduce `Space Grotesk` as a secondary display font in MVP

### Shape, spacing, and shadow patterns

Observed reusable UI patterns:

- Base radius token: `14px`
- Small radius token: `10px`
- Larger auth/nav/hero corners often use `18px` to `20px`
- Main shadow: `0 14px 34px rgba(96, 18, 18, 0.1)`
- Cards and panels usually use:
  - white background
  - pink-tinted border
  - medium-large radius
  - soft shadow
- Buttons use `10px` radius
- Tab/pill controls use `999px` radius
- Common panel padding: `14px` to `16px`
- Common hero/auth padding: `24px`

### UI component language

Observed style language:

- light UI with warm, slightly tinted backgrounds
- strong red primary actions
- rounded cards and soft shadows
- pill tabs for workspace subnavigation
- dense but readable operational layout
- dark plum sidebar reserved for the authenticated app shell
- subtle gradient and radial background treatment rather than flat white everywhere

### Iconography conventions

Observed icon usage is inconsistent:

- inline SVG icons for utility controls such as password visibility and notifications
- emoji icons in the unused public landing feature cards
- no evidence of a consistent icon library such as Lucide, Heroicons, or Font Awesome

### Visual tone

Observed tone:

- operational and professional rather than decorative
- warm and slightly bold rather than cold corporate blue SaaS
- more practical than luxurious
- more dashboard-oriented than editorial

### Light/dark system

- No actual light/dark theme system was found
- The product is a light UI with one dark sidebar treatment
- No toggle, theme context, or alternate dark token set was found

### Semantic color roles

Yes, but only at a basic level.

Observed semantic roles:
- `brand`
- `brand-2`
- `danger`
- `ok`
- `muted`
- `line`
- `panel`
- `bg`

### Public-facing design assets

Observed reusable brand asset:
- `web/public/ata-logo.svg`

Observed non-brand or starter assets still present:
- `web/public/file.svg`
- `web/public/globe.svg`
- `web/public/next.svg`
- `web/public/vercel.svg`
- `web/public/window.svg`

These appear to be generic starter or placeholder assets and should not be reused for the new website brand system.

### Multilingual / RTL precedent

- Locales present in the codebase: `en`, `fr`, `fa`
- Public language switcher only exposes `en` and `fr`
- `fa` is preserved in the dictionary but explicitly normalized back to `en`
- `RTL` helper styles exist in CSS, but runtime `isRtlLocale()` currently always returns `false`
- This means Persian support exists as dormant architecture, not live public product behavior

## Inferred design guidance for the new website

These points are not explicitly codified as a brand manual, but they are strongly supported by the observed implementation.

### What should be reused

- ATA oval logo shape and red brand mark
- primary red as the dominant CTA color
- warm off-white / blush-tinted background family
- dark plum as a supporting accent, not the main public-page background
- rounded cards with soft shadows
- restrained gradients and radial accents
- practical, compact information density rather than oversized luxury layouts

### How the website should adapt the CRM brand

- Reuse the palette and logo, but shift from dashboard composition to editorial marketing composition
- Keep the warm/red/plum brand identity
- Use cleaner public-site section rhythm, larger visual breathing room, and stronger image/content hierarchy
- Avoid copying the CRM sidebar layout, workspace subtabs, or dense application shell directly into the public site

### Typography decision for the website

- Use `Manrope` only in MVP
- Keep typography simple and consistent
- Do not infer a second display font into the MVP brand system

## Missing or unknown items

- No formal brand guideline document was found
- No favicon aligned with the ATA logo was found
- No official typography loading strategy was found
- No official illustration or photography system was found
- No formal spacing scale documentation was found outside CSS values
- No component library token documentation was found
- No brand voice or marketing copy guide was found
- No public website reference designs were found in active use

## Brand inconsistencies and cleanup notes

### Confirmed inconsistencies

- Favicon is not ATA-branded
- Public landing component exists but is not actually wired into the root route
- Default starter assets remain in `public/`
- Some colors are tokenized while many others are hard-coded, so the design system is only partially normalized
- Iconography is mixed between inline SVG utilities and emoji feature icons

### Why this matters for the new website

- The website should inherit the brand, not the accidental leftovers
- The build phase should normalize colors into clearer semantic tokens
- The website should adopt a single icon system
- The favicon should be replaced with a true ATA favicon set

## Reuse recommendations for the website build phase

### Reuse directly

- `ata-logo.svg` as the starting brand mark
- `Abadis Tejarat Arka` as the public company name
- `ATA` as the short compact brand label
- primary red family
- blush background family
- rounded white card language
- dark plum as a secondary accent

### Reuse with adaptation

- Manrope as the cleaned-up website typography implementation
- subtle radial/gradient backgrounds
- soft-shadow panel treatment
- pill-like badges and chips for availability/category states

### Do not reuse directly

- CRM sidebar layout
- dashboard workspace tabs as a public navigation pattern
- generic favicon
- default starter assets
- emoji-based feature icons

## Brand conclusion

ATA-CRM provides enough real evidence to define a credible starting brand system for the new website:

- logo direction is clear
- primary palette is clear
- broad visual temperature is clear
- surface treatment is clear

What is not clear enough to treat as settled brand truth:

- favicon system
- public marketing imagery style
- formal editorial tone guide

That is sufficient for the build phase, as long as those unknowns stay documented and are not silently invented.
