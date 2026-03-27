# ADR-002: Locale-Prefixed Public Routing

## Status

Accepted for build preparation

## Decision

Use locale-prefixed public routes such as `/en/...` and `/fr/...`. Keep `/` as a redirect to `/en`.

## Rationale

- best fit for hreflang and canonical management
- safest SEO structure
- clean separation between locales

## Consequence

Every public translation needs its own slug. Missing translations do not fall back publicly.
