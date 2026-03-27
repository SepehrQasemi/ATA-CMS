import Link from "next/link";

import { BrandLogo } from "@/components/brand/brand-logo";
import type { PublicLocale } from "@/lib/i18n/config";
import { getSiteChrome } from "@/lib/public/queries";
import {
  formatSiteAddressLines,
  parseSiteNavigation,
  parseSocialLinks,
} from "@/lib/site-settings";

type SiteFooterProps = {
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

export async function SiteFooter({ locale }: SiteFooterProps) {
  const settings = await getSiteChrome(locale);
  const navigation = parseSiteNavigation(settings.footerNavigationJson);
  const links = navigation
    .map((item) => {
      if (!item.pageKey) {
        return null;
      }

      const href = resolvePageHref(locale, item.pageKey);

      if (!href) {
        return null;
      }

      return {
        href,
        label:
          item.pageKey === "about"
            ? locale === "fr"
              ? "A propos"
              : "About"
            : item.pageKey === "products_index"
              ? locale === "fr"
                ? "Produits"
                : "Products"
              : item.pageKey === "categories_index"
                ? "Categories"
                : item.pageKey === "manufacturers_index"
                  ? locale === "fr"
                    ? "Fabricants"
                    : "Manufacturers"
                  : "Contact",
      };
    })
    .filter(Boolean) as Array<{ href: string; label: string }>;
  const addressLines = formatSiteAddressLines(settings.addressJson);
  const socialLinks = parseSocialLinks(settings.socialLinksJson);

  return (
    <footer className="border-t border-white/55 bg-white/70">
      <div className="content-shell section-shell grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-5">
          <BrandLogo href={`/${locale}`} />
          <p className="max-w-xl text-sm leading-7 text-muted">
            {settings.translation?.footerCompanyBlurb}
          </p>
          <div className="space-y-1 text-sm text-muted">
            <a
              className="focus-ring inline-flex rounded-full"
              href={`mailto:${settings.contactEmail}`}
            >
              {settings.contactEmail}
            </a>
            {settings.phone ? (
              <a
                className="focus-ring inline-flex rounded-full"
                href={`tel:${settings.phone}`}
              >
                {settings.phone}
              </a>
            ) : null}
            {addressLines.map((line) => (
              <p key={line}>{line}</p>
            ))}
            <div className="flex flex-wrap gap-3 pt-2">
              {socialLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  className="focus-ring rounded-full border border-line/80 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.08em] hover:bg-[#fff1f1]"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </div>
        <div className="grid gap-8 sm:grid-cols-2">
          <div className="space-y-4">
            <h2 className="text-sm font-semibold uppercase tracking-[0.08em] text-brand-strong">
              Discover
            </h2>
            <div className="space-y-3 text-sm text-muted">
              {links.map((link) => (
                <Link key={link.href} href={link.href}>
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <h2 className="text-sm font-semibold uppercase tracking-[0.08em] text-brand-strong">
              MVP
            </h2>
            <div className="space-y-3 text-sm leading-7 text-muted">
              <p>
                {locale === "fr"
                  ? "Anglais et francais sont publics. Le persan reste interne et non indexable en MVP."
                  : "English and French are public. Persian remains internal-only and non-indexable in MVP."}
              </p>
              <p>
                {locale === "fr"
                  ? "Les prix publics sont purement informatifs. Sans prix, la page bascule vers une demande de contact."
                  : "Public pricing is informational only. Missing prices fall back to contact-led inquiry."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
