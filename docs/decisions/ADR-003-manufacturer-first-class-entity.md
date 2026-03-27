# ADR-003: Manufacturer As First-Class Catalog Entity

## Status

Accepted for build preparation

## Decision

Model manufacturers as first-class public entities with their own pages.

In MVP, `manufacturer` means the main product producer/brand only.

Explicitly excluded from MVP:
- supplier
- reseller
- distributor
- partner

## Rationale

- required by business rules
- important for product credibility and internal linking
- avoids overloading CRM supplier/company concepts
- keeps the public catalog terminology precise

## Consequence

Products must reference manufacturers directly, and manufacturer pages must list related products.
