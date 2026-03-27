import type { AppLocale, PublicLocale } from "@/lib/i18n/config";

export async function getLocaleMessages(locale: PublicLocale) {
  switch (locale) {
    case "en":
      return (await import("@/messages/en.json")).default;
    case "fr":
      return (await import("@/messages/fr.json")).default;
  }
}

export async function getInternalLocaleMessages(locale: AppLocale) {
  switch (locale) {
    case "fa":
      return (await import("@/messages/fa.json")).default;
    case "en":
      return (await import("@/messages/en.json")).default;
    case "fr":
      return (await import("@/messages/fr.json")).default;
  }
}
