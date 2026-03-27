import Link from "next/link";

import { BrandLogo } from "@/components/brand/brand-logo";
import { LocaleSwitcher } from "@/components/layout/locale-switcher";
import { MobileNav } from "@/components/layout/mobile-nav";
import { Button } from "@/components/ui/button";
import type { PublicLocale } from "@/lib/i18n/config";
import { getSiteChrome } from "@/lib/public/queries";
import { parseSiteNavigation } from "@/lib/site-settings";

type SiteHeaderProps = {
  locale: PublicLocale;
};

function resolvePageHref(locale: PublicLocale, pageKey: string) {
  switch (pageKey) {
    case "about":
      return `/${locale}/about`;
    case "products_index":
      return `/${locale}/products`;
    case "categories_index":
      return `/${locale}/categories`;
    case "manufacturers_index":
      return `/${locale}/manufacturers`;
    case "contact":
      return `/${locale}/contact`;
    default:
      return null;
  }
}

export async function SiteHeader({ locale }: SiteHeaderProps) {
  const settings = await getSiteChrome(locale);
  const navigation = parseSiteNavigation(settings.mainNavigationJson);
  const items = navigation
    .map((item) => {
      const href = item.pageKey ? resolvePageHref(locale, item.pageKey) : null;

      if (!href) {
        return null;
      }

      return {
        href,
        label: item.label?.[locale] ?? item.pageKey,
      };
    })
    .filter(Boolean) as Array<{ href: string; label: string }>;
  const inquiryLabel = locale === "fr" ? "Demande" : "Inquiry";

  return (
    <header className="sticky top-0 z-20 border-b border-white/55 bg-background/85 backdrop-blur-xl">
      <div className="content-shell flex min-h-20 items-center justify-between gap-6 py-4">
        <BrandLogo href={`/${locale}`} />
        <nav className="hidden items-center gap-6 lg:flex">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="focus-ring text-sm font-medium text-foreground/78 transition-colors hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <MobileNav inquiryLabel={inquiryLabel} items={items} locale={locale} />
          <LocaleSwitcher currentLocale={locale} />
          <Button asChild className="hidden sm:inline-flex">
            <Link href={`/${locale}/contact`}>{inquiryLabel}</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
