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
      <SiteHeader locale={locale} />
      <main>{children}</main>
      <SiteFooter locale={locale} />
    </div>
  );
}
