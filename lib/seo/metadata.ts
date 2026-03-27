import type { Metadata } from "next";

import { buildAbsoluteUrl, getDefaultMetaTitle } from "@/lib/seo/site";
import type { PublicLocale } from "@/lib/i18n/config";

function getOpenGraphLocale(locale: PublicLocale) {
  return locale === "fr" ? "fr_FR" : "en_US";
}

export function buildPageMetadata(options: {
  alternates?: Partial<Record<PublicLocale, string>>;
  title: string;
  description: string;
  locale?: PublicLocale;
  pathname: string;
}): Metadata {
  const canonical = buildAbsoluteUrl(options.pathname);
  const locale = options.locale ?? "en";
  const firstAlternate = options.alternates
    ? Object.values(options.alternates)[0]
    : undefined;
  const alternateEntries = options.alternates
    ? Object.fromEntries(
        Object.entries(options.alternates).map(([key, value]) => [
          key,
          buildAbsoluteUrl(value),
        ]),
      )
    : undefined;

  return {
    title: getDefaultMetaTitle(options.title),
    description: options.description,
    alternates: {
      canonical,
      languages: alternateEntries
        ? {
            ...alternateEntries,
            "x-default": buildAbsoluteUrl(
              options.alternates?.en ?? firstAlternate ?? options.pathname,
            ),
          }
        : undefined,
    },
    openGraph: {
      title: getDefaultMetaTitle(options.title),
      description: options.description,
      url: canonical,
      siteName: "Abadis Tejarat Arka",
      locale: getOpenGraphLocale(locale),
      type: "website",
    },
  };
}
