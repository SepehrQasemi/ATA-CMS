import type { LocaleVisibilityStatus } from "@prisma/client";

import type { AppLocale } from "@/lib/i18n/config";

export type LocaleConfigurationInput = {
  code: AppLocale;
  isDefaultPublic: boolean;
  visibilityStatus: LocaleVisibilityStatus;
};

export function getLocaleConfigurationIssues(
  locales: LocaleConfigurationInput[],
) {
  const issues: string[] = [];
  const defaultPublicLocales = locales.filter((locale) => locale.isDefaultPublic);

  if (defaultPublicLocales.length !== 1) {
    issues.push("Exactly one default public locale is required.");
  }

  const defaultPublicLocale = defaultPublicLocales[0];

  if (defaultPublicLocale && defaultPublicLocale.visibilityStatus !== "public") {
    issues.push("The default public locale must have public visibility.");
  }

  if (defaultPublicLocale?.code !== "en") {
    issues.push("English must remain the default public locale for MVP.");
  }

  const persianLocale = locales.find((locale) => locale.code === "fa");

  if (persianLocale?.visibilityStatus === "public") {
    issues.push("Persian cannot be public in MVP.");
  }

  const publicLocales = locales.filter((locale) => locale.visibilityStatus === "public");

  if (publicLocales.length === 0) {
    issues.push("At least one public locale is required.");
  }

  return issues;
}
