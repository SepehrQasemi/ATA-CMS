import type { PublicLocale } from "@/lib/i18n/config";

export function hasDisplayText(value: string | null | undefined): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

export function getDisplayText(
  value: string | null | undefined,
  fallback = "",
) {
  return hasDisplayText(value) ? value.trim() : fallback;
}

export function getDefaultPricingFallbackMessage(locale: PublicLocale) {
  return locale === "fr"
    ? "Contactez ATA pour le prix."
    : "Contact ATA for pricing.";
}

export function getCatalogPath(
  locale: PublicLocale,
  section: "categories" | "manufacturers" | "products",
  slug: string | null | undefined,
) {
  const normalized = getDisplayText(slug);
  return normalized ? `/${locale}/${section}/${normalized}` : null;
}
