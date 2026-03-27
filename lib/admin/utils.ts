import type { Prisma } from "@prisma/client";

import { appLocales, type AppLocale } from "@/lib/i18n/config";

export function getLocaleLabel(locale: AppLocale) {
  switch (locale) {
    case "en":
      return "English";
    case "fr":
      return "French";
    case "fa":
      return "Persian";
  }
}

export function toNullableString(value: FormDataEntryValue | null) {
  if (typeof value !== "string") {
    return null;
  }

  const normalized = value.trim();
  return normalized.length > 0 ? normalized : null;
}

export function toRequiredString(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value.trim() : "";
}

export function toBoolean(value: FormDataEntryValue | null) {
  return value === "on" || value === "true" || value === "1";
}

export function toInteger(value: FormDataEntryValue | null) {
  const normalized = typeof value === "string" ? Number.parseInt(value, 10) : NaN;
  return Number.isFinite(normalized) ? normalized : 0;
}

export function toNullableNumber(value: FormDataEntryValue | null) {
  if (typeof value !== "string" || value.trim() === "") {
    return null;
  }

  const normalized = Number.parseFloat(value);
  return Number.isFinite(normalized) ? normalized : null;
}

export function toNullableDateString(value: FormDataEntryValue | null) {
  if (typeof value !== "string" || value.trim() === "") {
    return null;
  }

  return value;
}

export function parseJsonField<T>(value: FormDataEntryValue | null, fallback: T): T {
  if (typeof value !== "string" || value.trim() === "") {
    return fallback;
  }

  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

export function sortByLocale<T extends { localeCode: string }>(items: T[]) {
  return [...items].sort(
    (left, right) =>
      appLocales.indexOf(left.localeCode as AppLocale) -
      appLocales.indexOf(right.localeCode as AppLocale),
  );
}

export function mapTranslationsByLocale<T extends { localeCode: string }>(
  items: T[],
) {
  const lookup = new Map(items.map((item) => [item.localeCode, item]));
  return appLocales.map((locale) => lookup.get(locale) ?? null);
}

export function stringifyJson(value: Prisma.JsonValue | string | null | undefined) {
  if (typeof value === "string") {
    return value;
  }

  return JSON.stringify(value ?? {}, null, 2);
}
