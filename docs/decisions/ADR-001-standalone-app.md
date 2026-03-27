# ADR-001: Standalone Website Application

## Status

Accepted for build preparation

## Decision

Build the website as a standalone application rather than embedding it into ATA-CRM.

## Rationale

- public SEO and performance concerns differ from CRM operational concerns
- multilingual publishing needs a different model from CRM workflow data
- security boundaries are cleaner
- deployment risk stays lower

## Consequence

Future integration remains possible, but will be explicit and controlled.
