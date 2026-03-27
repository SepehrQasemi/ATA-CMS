import Link from "next/link";

import { getTranslations } from "next-intl/server";

import { BrandLogo } from "@/components/brand/brand-logo";
import { LocaleSwitcher } from "@/components/layout/locale-switcher";
import { Button } from "@/components/ui/button";
import type { PublicLocale } from "@/lib/i18n/config";

type SiteHeaderProps = {
  locale: PublicLocale;
};

export async function SiteHeader({ locale }: SiteHeaderProps) {
  const nav = await getTranslations("nav");
  const items = [
    { href: `/${locale}/about`, label: nav("about") },
    { href: `/${locale}/products`, label: nav("products") },
    { href: `/${locale}/categories`, label: nav("categories") },
    { href: `/${locale}/manufacturers`, label: nav("manufacturers") },
    { href: `/${locale}/contact`, label: nav("contact") },
  ];

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
          <LocaleSwitcher currentLocale={locale} />
          <Button asChild className="hidden sm:inline-flex">
            <Link href={`/${locale}/contact`}>{nav("inquiry")}</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
