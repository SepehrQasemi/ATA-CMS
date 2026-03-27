import type { PublicLocale } from "@/lib/i18n/config";
import { sanitizeHref } from "@/lib/safe-url";

export type SiteAddress = {
  city?: string;
  country?: string;
  line1?: string;
  line2?: string;
  postalCode?: string;
  region?: string;
};

export type SiteNavigationItem = {
  group?: string;
  label?: Partial<Record<PublicLocale, string>>;
  pageKey?: string;
};

type SiteSocialLink = {
  href: string;
  label: string;
};

function parseJson<T>(raw: string | null | undefined, fallback: T): T {
  if (!raw) {
    return fallback;
  }

  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function parseSiteAddress(raw: string | null | undefined): SiteAddress | null {
  const address = parseJson<SiteAddress | null>(raw, null);

  if (!address) {
    return null;
  }

  return Object.values(address).some(Boolean) ? address : null;
}

export function formatSiteAddressLines(raw: string | null | undefined): string[] {
  const address = parseSiteAddress(raw);

  if (!address) {
    return [];
  }

  const locality = [address.postalCode, address.city].filter(Boolean).join(" ");
  const regionLine = [locality, address.region].filter(Boolean).join(", ");

  return [address.line1, address.line2, regionLine, address.country].filter(
    Boolean,
  ) as string[];
}

export function parseSiteNavigation(
  raw: string | null | undefined,
): SiteNavigationItem[] {
  return parseJson<SiteNavigationItem[]>(raw, []);
}

function formatSocialLabel(key: string) {
  switch (key) {
    case "linkedin":
      return "LinkedIn";
    case "whatsapp":
      return "WhatsApp";
    default:
      return key.charAt(0).toUpperCase() + key.slice(1);
  }
}

export function parseSocialLinks(
  raw: string | null | undefined,
): SiteSocialLink[] {
  const socialMap = parseJson<Record<string, string>>(raw, {});

  return Object.entries(socialMap)
    .map(([key, href]) => ({
      href: sanitizeHref(href),
      label: formatSocialLabel(key),
    }))
    .filter((item): item is SiteSocialLink => Boolean(item.href));
}
