import Link from "next/link";

import { getTranslations } from "next-intl/server";

import { BrandLogo } from "@/components/brand/brand-logo";
import type { PublicLocale } from "@/lib/i18n/config";
import { siteConfig } from "@/lib/site-config";

type SiteFooterProps = {
  locale: PublicLocale;
};

export async function SiteFooter({ locale }: SiteFooterProps) {
  const footer = await getTranslations("footer");
  const nav = await getTranslations("nav");

  return (
    <footer className="border-t border-white/55 bg-white/70">
      <div className="content-shell section-shell grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-5">
          <BrandLogo href={`/${locale}`} />
          <p className="max-w-xl text-sm leading-7 text-muted">
            {footer("companyBlurb")}
          </p>
          <div className="space-y-1 text-sm text-muted">
            <p>{siteConfig.publicContactEmail}</p>
            <p>{siteConfig.publicPhone}</p>
            <p>{siteConfig.publicAddress}</p>
          </div>
        </div>
        <div className="grid gap-8 sm:grid-cols-2">
          <div className="space-y-4">
            <h2 className="text-sm font-semibold uppercase tracking-[0.08em] text-brand-strong">
              {footer("discover")}
            </h2>
            <div className="space-y-3 text-sm text-muted">
              <Link href={`/${locale}/about`}>{nav("about")}</Link>
              <Link href={`/${locale}/products`}>{nav("products")}</Link>
              <Link href={`/${locale}/manufacturers`}>{nav("manufacturers")}</Link>
              <Link href={`/${locale}/contact`}>{nav("contact")}</Link>
            </div>
          </div>
          <div className="space-y-4">
            <h2 className="text-sm font-semibold uppercase tracking-[0.08em] text-brand-strong">
              {footer("status")}
            </h2>
            <div className="space-y-3 text-sm leading-7 text-muted">
              <p>{footer("localePolicy")}</p>
              <p>{footer("pricingPolicy")}</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
