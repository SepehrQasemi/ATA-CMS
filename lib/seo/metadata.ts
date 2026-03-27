import type { Metadata } from "next";

import { buildAbsoluteUrl, getDefaultMetaTitle } from "@/lib/seo/site";

export function buildPageMetadata(options: {
  title: string;
  description: string;
  pathname: string;
}): Metadata {
  const canonical = buildAbsoluteUrl(options.pathname);

  return {
    title: getDefaultMetaTitle(options.title),
    description: options.description,
    alternates: {
      canonical,
    },
    openGraph: {
      title: getDefaultMetaTitle(options.title),
      description: options.description,
      url: canonical,
      siteName: "Abadis Tejarat Arka",
      locale: "en_US",
      type: "website",
    },
  };
}
