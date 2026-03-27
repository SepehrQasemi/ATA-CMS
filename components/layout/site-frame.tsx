import type { ReactNode } from "react";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import type { PublicLocale } from "@/lib/i18n/config";

type SiteFrameProps = {
  children: ReactNode;
  locale: PublicLocale;
};

export async function SiteFrame({ children, locale }: SiteFrameProps) {
  return (
    <div className="min-h-screen">
      <a
        href="#main-content"
        className="focus-ring sr-only absolute left-4 top-4 z-50 rounded-full bg-white px-4 py-2 text-sm font-semibold shadow-sm focus:not-sr-only"
      >
        {locale === "fr" ? "Aller au contenu" : "Skip to content"}
      </a>
      <SiteHeader locale={locale} />
      <main id="main-content">{children}</main>
      <SiteFooter locale={locale} />
    </div>
  );
}
