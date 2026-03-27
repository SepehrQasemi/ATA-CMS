import { publicLocales, type PublicLocale } from "@/lib/i18n/config";

export function normalizePublicLocale(value: string | null | undefined): PublicLocale {
  return publicLocales.includes(value as PublicLocale)
    ? (value as PublicLocale)
    : "en";
}

export function sanitizeInquiryRedirectPath(
  value: string | null | undefined,
  locale: PublicLocale,
) {
  const normalized = typeof value === "string" ? value.trim() : "";
  const fallback = `/${locale}/contact`;

  if (!normalized.startsWith("/") || normalized.startsWith("//")) {
    return fallback;
  }

  return normalized === fallback ? normalized : fallback;
}
