import { PublishStatus } from "@prisma/client";
import { notFound } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { prisma } from "@/lib/db";
import type { PublicLocale } from "@/lib/i18n/config";
import { getDisplayText } from "@/lib/public/content";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { getPublicPage, getSiteChrome } from "@/lib/public/queries";
import { getPageAlternatePathnames } from "@/lib/public/seo";
import { formatSiteAddressLines, parseSocialLinks } from "@/lib/site-settings";
import { INQUIRY_FIELD_LIMITS } from "@/lib/validation/inquiries";

import { submitInquiryAction } from "./actions";

type ContactPageProps = {
  params: Promise<{ locale: PublicLocale }>;
  searchParams: Promise<{
    error?: string;
    manufacturer?: string;
    product?: string;
    sent?: string;
  }>;
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: PublicLocale }>;
}) {
  const { locale } = await params;
  const page = await getPublicPage(locale, "contact");

  if (!page) {
    return {};
  }

  const alternates = await getPageAlternatePathnames(page.id, false);

  return buildPageMetadata({
    title: page.translation.seoTitle ?? page.translation.title,
    description:
      page.translation.seoDescription ?? page.translation.summary ?? "",
    alternates,
    locale,
    pathname: `/${locale}/contact`,
  });
}

export default async function ContactPage({
  params,
  searchParams,
}: ContactPageProps) {
  const [{ locale }, query] = await Promise.all([params, searchParams]);
  const [page, settings, product, manufacturer] = await Promise.all([
    getPublicPage(locale, "contact"),
    getSiteChrome(locale),
    query.product
      ? prisma.product.findFirst({
          where: {
            id: query.product,
            publishStatus: PublishStatus.published,
            translations: {
              some: {
                localeCode: locale,
                publishStatus: PublishStatus.published,
              },
            },
          },
          include: {
            translations: {
              where: {
                localeCode: locale,
                publishStatus: PublishStatus.published,
              },
              take: 1,
            },
          },
        })
      : null,
    query.manufacturer
      ? prisma.manufacturer.findFirst({
          where: {
            id: query.manufacturer,
            publishStatus: PublishStatus.published,
            translations: {
              some: {
                localeCode: locale,
                publishStatus: PublishStatus.published,
              },
            },
          },
          include: {
            translations: {
              where: {
                localeCode: locale,
                publishStatus: PublishStatus.published,
              },
              take: 1,
            },
          },
        })
      : null,
  ]);

  if (!page) {
    notFound();
  }

  const contextLabel =
    product?.translations[0]?.name ?? manufacturer?.translations[0]?.name ?? null;
  const addressLines = formatSiteAddressLines(settings.addressJson);
  const socialLinks = parseSocialLinks(settings.socialLinksJson);

  return (
    <section className="section-shell">
      <div className="content-shell space-y-10">
        <div className="space-y-4">
          <p className="eyebrow">{page.translation.title}</p>
          <h1 className="text-5xl font-semibold tracking-[-0.04em]">
            {page.translation.seoTitle ?? page.translation.title}
          </h1>
          <p className="max-w-3xl text-lg leading-8 text-muted">
            {getDisplayText(
              settings.translation?.contactIntro ?? page.translation.summary,
              locale === "fr"
                ? "Expliquez votre besoin produit, disponibilite ou documentation. ATA vous repondra depuis le CMS local."
                : "Explain your product, availability, or documentation need. ATA will respond from the local CMS workflow.",
            )}
          </p>
        </div>

        {query.error ? (
          <div
            aria-live="polite"
            className="rounded-3xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700"
          >
            {decodeURIComponent(query.error)}
          </div>
        ) : null}
        {query.sent ? (
          <div
            aria-live="polite"
            className="rounded-3xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm text-emerald-700"
          >
            {locale === "fr"
              ? "Votre demande a bien ete enregistree."
              : "Your inquiry has been stored successfully."}
          </div>
        ) : null}

        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <Card className="space-y-6 p-8">
            <div className="space-y-3">
              <Badge variant="muted">
                {locale === "fr" ? "Coordonnees" : "Contact details"}
              </Badge>
              <p className="text-2xl font-semibold">{settings.translation?.siteName}</p>
              <div className="space-y-2 text-sm leading-7 text-muted">
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
              </div>
            </div>
            <div className="rounded-3xl border border-line bg-[#fff8f8] p-5">
              <p className="text-xs uppercase tracking-[0.08em] text-muted">
                {locale === "fr" ? "Demandes courantes" : "Typical requests"}
              </p>
              <ul className="mt-3 space-y-2 text-sm leading-7 text-muted">
                <li>
                  {locale === "fr"
                    ? "Prix publics, delais, et disponibilite."
                    : "Public pricing, lead time, and availability."}
                </li>
                <li>
                  {locale === "fr"
                    ? "Documentation produit et pieces jointes."
                    : "Product documentation and attached files."}
                </li>
                <li>
                  {locale === "fr"
                    ? "Questions de sourcing fabricant."
                    : "Manufacturer-led sourcing questions."}
                </li>
              </ul>
              {socialLinks.length > 0 ? (
                <div className="mt-4 flex flex-wrap gap-3">
                  {socialLinks.map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      target="_blank"
                      rel="noreferrer"
                      className="focus-ring rounded-full border border-line bg-white px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.08em]"
                    >
                      {link.label}
                    </a>
                  ))}
                </div>
              ) : null}
            </div>
            {contextLabel ? (
              <div className="rounded-3xl border border-line bg-[#fff8f8] p-5">
                <p className="text-xs uppercase tracking-[0.08em] text-muted">
                  {locale === "fr" ? "Contexte de la demande" : "Inquiry context"}
                </p>
                <p className="mt-3 text-lg font-semibold">{contextLabel}</p>
              </div>
            ) : null}
          </Card>

          <Card className="p-8">
            <form action={submitInquiryAction} className="grid gap-5 md:grid-cols-2">
              <input type="hidden" name="redirectTo" value={`/${locale}/contact`} />
              <input type="hidden" name="sourceLocaleCode" value={locale} />
              <input type="hidden" name="sourcePageId" value={page.id} />
              <input type="hidden" name="productId" value={product?.id ?? ""} />
              <input type="hidden" name="manufacturerId" value={manufacturer?.id ?? ""} />
              <input
                type="hidden"
                name="requestType"
                value={product ? "pricing_request" : manufacturer ? "manufacturer_inquiry" : "general"}
              />

              <div>
                <Label htmlFor="contactName">
                  {locale === "fr" ? "Nom du contact" : "Contact name"}
                </Label>
                <Input
                  id="contactName"
                  name="contactName"
                  autoComplete="name"
                  maxLength={INQUIRY_FIELD_LIMITS.contactName}
                  required
                />
              </div>
              <div>
                <Label htmlFor="companyName">
                  {locale === "fr" ? "Societe" : "Company"}
                </Label>
                <Input
                  id="companyName"
                  name="companyName"
                  autoComplete="organization"
                  maxLength={INQUIRY_FIELD_LIMITS.companyName}
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  maxLength={INQUIRY_FIELD_LIMITS.email}
                  required
                />
              </div>
              <div>
                <Label htmlFor="phone">{locale === "fr" ? "Telephone" : "Phone"}</Label>
                <Input
                  id="phone"
                  name="phone"
                  autoComplete="tel"
                  maxLength={INQUIRY_FIELD_LIMITS.phone}
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="country">{locale === "fr" ? "Pays" : "Country"}</Label>
                <Input
                  id="country"
                  name="country"
                  autoComplete="country-name"
                  maxLength={INQUIRY_FIELD_LIMITS.country}
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="message">{locale === "fr" ? "Message" : "Message"}</Label>
                <Textarea
                  id="message"
                  name="message"
                  className="min-h-48"
                  maxLength={INQUIRY_FIELD_LIMITS.message}
                  required
                />
                <p className="mt-2 text-xs text-muted">
                  {locale === "fr"
                    ? `Maximum ${INQUIRY_FIELD_LIMITS.message} caracteres.`
                    : `Maximum ${INQUIRY_FIELD_LIMITS.message} characters.`}
                </p>
              </div>
              <label className="md:col-span-2 flex items-start gap-3 rounded-2xl border border-line bg-[#fff8f8] px-4 py-3 text-sm leading-6">
                <input
                  type="checkbox"
                  name="consentToContact"
                  className="mt-1 h-4 w-4 accent-[var(--brand)]"
                  required
                />
                <span>
                  {locale === "fr"
                    ? "J accepte d etre contacte au sujet de cette demande."
                    : "I agree to be contacted about this inquiry."}
                </span>
              </label>
              <div className="md:col-span-2">
                <Button type="submit" size="lg">
                  {locale === "fr" ? "Envoyer la demande" : "Send inquiry"}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </section>
  );
}
