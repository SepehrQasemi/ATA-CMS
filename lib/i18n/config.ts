export const appLocales = ["en", "fr", "fa"] as const;
export const publicLocales = ["en", "fr"] as const;
export const defaultPublicLocale = "en" as const;

export type AppLocale = (typeof appLocales)[number];
export type PublicLocale = (typeof publicLocales)[number];
export type LocaleDirection = "ltr" | "rtl";

const localeDirectionMap: Record<AppLocale, LocaleDirection> = {
  en: "ltr",
  fr: "ltr",
  fa: "rtl",
};

export function isAppLocale(value: string): value is AppLocale {
  return appLocales.includes(value as AppLocale);
}

export function isPublicLocale(value: string): value is PublicLocale {
  return publicLocales.includes(value as PublicLocale);
}

export function getLocaleDirection(locale: AppLocale): LocaleDirection {
  return localeDirectionMap[locale];
}
