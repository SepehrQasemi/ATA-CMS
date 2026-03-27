import Link from "next/link";
import { notFound } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CategoryCard } from "@/components/site/category-card";
import { ManufacturerCard } from "@/components/site/manufacturer-card";
import { ProductCard } from "@/components/site/product-card";
import { resolvePricingMessage } from "@/lib/domain/pricing";
import type { PublicLocale } from "@/lib/i18n/config";
import {
  getDefaultPricingFallbackMessage,
  getDisplayText,
} from "@/lib/public/content";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { getHomeData } from "@/lib/public/queries";
import { getPageAlternatePathnames } from "@/lib/public/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: PublicLocale }>;
}) {
  const { locale } = await params;
  const data = await getHomeData(locale);

  if (!data.page) {
    return {};
  }

  const alternates = await getPageAlternatePathnames(data.page.id, true);

  return buildPageMetadata({
    title: data.page.translation.seoTitle ?? data.page.translation.title,
    description:
      data.page.translation.seoDescription ??
      data.settings.translation?.defaultMetaDescription ??
      "",
    alternates,
    locale,
    pathname: `/${locale}`,
  });
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: PublicLocale }>;
}) {
  const { locale } = await params;
  const data = await getHomeData(locale);

  if (!data.page) {
    notFound();
  }

  const trustPoints =
    locale === "fr"
      ? [
          "Catalogues structures par categorie et fabricant",
          "Demandes stockees dans la base du site",
          "Prix publics informatifs, sans workflow ecommerce",
        ]
      : [
          "Structured discovery across products, categories, and manufacturers",
          "Inquiry records stored in the website database",
          "Informational public pricing without ecommerce complexity",
        ];

  return (
    <>
      <section className="section-shell">
        <div className="content-shell hero-grid items-stretch">
          <div className="reveal-rise space-y-8">
            <Badge variant="muted">Abadis Tejarat Arka</Badge>
            <div className="space-y-5">
              <h1 className="max-w-4xl text-balance text-5xl font-semibold leading-[0.98] tracking-[-0.05em] sm:text-6xl">
                {getDisplayText(
                  data.page.translation.heroHeading ?? data.settings.translation?.siteTagline,
                  locale === "fr"
                    ? "Sourcing fabricant pour conversations B2B serieuses"
                    : "Manufacturer-aware sourcing for serious B2B buying teams",
                )}
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-muted">
                {getDisplayText(
                  data.page.translation.summary,
                  locale === "fr"
                    ? "Le site public structure produits, categories et fabricants pour des demandes B2B claires."
                    : "The public site structures products, categories, and manufacturers for clear B2B inquiries.",
                )}
              </p>
            </div>
            <div className="flex flex-wrap gap-4">
              <Button asChild size="lg">
                <Link href={`/${locale}/products`}>
                  {locale === "fr" ? "Explorer les produits" : "Explore products"}
                </Link>
              </Button>
              <Button asChild size="lg" variant="secondary">
                <Link href={`/${locale}/contact`}>
                  {locale === "fr" ? "Demander un devis" : "Request an inquiry"}
                </Link>
              </Button>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {trustPoints.map((point) => (
                <Card key={point} className="interactive-panel p-5">
                  <p className="text-sm font-semibold leading-6">{point}</p>
                </Card>
              ))}
            </div>
          </div>
          <Card className="brand-ring reveal-rise reveal-delay-1 overflow-hidden p-8">
            <div className="space-y-6 rounded-[1.6rem] bg-gradient-to-br from-[#4d0f22] to-[#1c060c] p-8 text-white shadow-[0_22px_55px_rgba(43,8,19,0.24)]">
              <div className="eyebrow border-white/10 bg-white/10 text-white/75">ATA</div>
              <div className="space-y-3">
                <h2 className="text-3xl font-semibold tracking-[-0.03em]">
                  {getDisplayText(
                    data.settings.translation?.siteTagline,
                    locale === "fr"
                      ? "Structure catalogue et demandes B2B"
                      : "Structured catalog and B2B inquiry flow",
                  )}
                </h2>
                <p className="text-sm leading-7 text-white/76">
                  {locale === "fr"
                    ? "Le site relie contenus produit, profils fabricants et demandes B2B dans une structure claire."
                    : "The site brings product content, manufacturer credibility, and inquiry workflows into one clear B2B structure."}
                </p>
              </div>
              <div className="grid gap-4">
                <div className="rounded-3xl border border-white/10 bg-white/8 p-4">
                  <p className="text-xs uppercase tracking-[0.1em] text-white/55">
                    {locale === "fr" ? "Categories en avant" : "Featured categories"}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2 text-sm">
                    {data.featuredCategories.length > 0 ? (
                      data.featuredCategories.map((category) => (
                        <span
                          key={category.id}
                          className="rounded-full border border-white/10 bg-white/10 px-3 py-2"
                        >
                          {category.translation?.name}
                        </span>
                      ))
                    ) : (
                      <span className="rounded-full border border-white/10 bg-white/10 px-3 py-2">
                        {locale === "fr" ? "Selection en preparation" : "Selection in progress"}
                      </span>
                    )}
                  </div>
                </div>
                <div className="rounded-3xl border border-white/10 bg-white/8 p-4">
                  <p className="text-xs uppercase tracking-[0.1em] text-white/55">
                    {locale === "fr" ? "Fabricants en avant" : "Featured manufacturers"}
                  </p>
                  <div className="mt-3 space-y-2 text-sm text-white/84">
                    {data.featuredManufacturers.length > 0 ? (
                      data.featuredManufacturers.map((manufacturer) => (
                        <p key={manufacturer.id}>{manufacturer.translation?.name}</p>
                      ))
                    ) : (
                      <p>{locale === "fr" ? "Profils a venir" : "Profiles coming soon"}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      <section className="section-shell pt-0">
        <div className="content-shell space-y-10">
          <div className="space-y-3">
            <p className="eyebrow">
              {locale === "fr" ? "Categories" : "Categories"}
            </p>
            <h2 className="text-3xl font-semibold tracking-[-0.03em]">
              {locale === "fr"
                ? "Des points d entree clairs pour un catalogue B2B"
                : "Clear category entry points for a B2B catalog"}
            </h2>
          </div>
          {data.featuredCategories.length > 0 ? (
            <div className="grid gap-5 lg:grid-cols-2">
              {data.featuredCategories.map((category) => (
                <CategoryCard
                  key={category.id}
                  locale={locale}
                  name={category.translation?.name ?? category.code}
                  path={category.translation?.fullSlugPathCache ?? ""}
                  description={category.translation?.shortDescription}
                />
              ))}
            </div>
          ) : (
            <Card className="p-6 text-sm leading-7 text-muted">
              {locale === "fr"
                ? "Les categories mises en avant seront ajoutees ici."
                : "Featured categories will be added here."}
            </Card>
          )}
        </div>
      </section>

      <section className="section-shell pt-0">
        <div className="content-shell space-y-10">
          <div className="space-y-3">
            <p className="eyebrow">{locale === "fr" ? "Produits" : "Products"}</p>
            <h2 className="text-3xl font-semibold tracking-[-0.03em]">
              {locale === "fr"
                ? "Pages produit riches, informatives et orientees demande"
                : "Product pages built for inquiry-led buying decisions"}
            </h2>
          </div>
          {data.featuredProducts.length > 0 ? (
            <div className="grid gap-5 lg:grid-cols-2 xl:grid-cols-4">
              {data.featuredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  locale={locale}
                  slug={product.translation.slug}
                  name={product.translation.name}
                  shortDescription={product.translation.shortDescription}
                  manufacturerName={product.manufacturerTranslation?.name}
                  availabilityStatus={product.availabilityStatus}
                  priceLabel={resolvePricingMessage({
                    locale,
                    amount: product.publicPriceAmount ? Number(product.publicPriceAmount) : null,
                    currency: product.publicPriceCurrency,
                    unitLabel: product.publicPriceUnitLabel,
                    message:
                      product.translation.contactForPricingMessage ??
                      data.settings.translation?.defaultContactForPricingMessage ??
                      getDefaultPricingFallbackMessage(locale),
                  })}
                  imageUrl={product.primaryImage?.publicUrl}
                />
              ))}
            </div>
          ) : (
            <Card className="p-6 text-sm leading-7 text-muted">
              {locale === "fr"
                ? "Les produits mis en avant seront publies ici."
                : "Featured products will be published here."}
            </Card>
          )}
        </div>
      </section>

      <section className="section-shell pt-0">
        <div className="content-shell space-y-10">
          <div className="space-y-3">
            <p className="eyebrow">
              {locale === "fr" ? "Fabricants" : "Manufacturers"}
            </p>
            <h2 className="text-3xl font-semibold tracking-[-0.03em]">
              {locale === "fr"
                ? "Des profils fabricants utiles, pas de simples libelles"
                : "Manufacturer profiles that add trust, not just labels"}
            </h2>
          </div>
          {data.featuredManufacturers.length > 0 ? (
            <div className="grid gap-5 lg:grid-cols-3">
              {data.featuredManufacturers.map((manufacturer) => (
                <ManufacturerCard
                  key={manufacturer.id}
                  locale={locale}
                  slug={manufacturer.translation?.slug ?? ""}
                  name={manufacturer.translation?.name ?? manufacturer.code}
                  summary={manufacturer.translation?.summary ?? ""}
                  productCount={manufacturer._count.products}
                  logoUrl={manufacturer.logoMedia?.publicUrl}
                />
              ))}
            </div>
          ) : (
            <Card className="p-6 text-sm leading-7 text-muted">
              {locale === "fr"
                ? "Les profils fabricants mis en avant seront ajoutes ici."
                : "Featured manufacturer profiles will be added here."}
            </Card>
          )}
        </div>
      </section>

      <section className="pb-16">
        <div className="content-shell surface-panel reveal-rise reveal-delay-2 px-8 py-10">
          <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
            <div className="space-y-3">
              <p className="eyebrow">
                {locale === "fr" ? "Demande B2B" : "B2B inquiry"}
              </p>
              <h2 className="text-3xl font-semibold tracking-[-0.03em]">
                {locale === "fr"
                  ? "Besoin d un prix, d un delai ou d une fiche technique ?"
                  : "Need pricing, lead time, or supporting documents?"}
              </h2>
              <p className="max-w-2xl text-base leading-7 text-muted">
                {getDisplayText(
                  data.settings.translation?.contactIntro,
                  locale === "fr"
                    ? "Expliquez votre besoin produit, prix ou documentation pour recevoir une reponse B2B."
                    : "Explain your product, pricing, or documentation need to receive a B2B response.",
                )}
              </p>
            </div>
            <Button asChild size="lg">
              <Link href={`/${locale}/contact`}>
                {locale === "fr" ? "Contacter ATA" : "Contact ATA"}
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
