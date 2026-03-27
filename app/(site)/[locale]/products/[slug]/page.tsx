import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ProductCard } from "@/components/site/product-card";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getAvailabilityLabel } from "@/lib/domain/availability";
import { resolvePricingMessage } from "@/lib/domain/pricing";
import type { PublicLocale } from "@/lib/i18n/config";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { getProductDetailData, getSiteChrome } from "@/lib/public/queries";
import { getProductAlternatePathnames } from "@/lib/public/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: PublicLocale; slug: string }>;
}) {
  const { locale, slug } = await params;
  const data = await getProductDetailData(locale, slug);

  if (!data) {
    return {};
  }

  const alternates = await getProductAlternatePathnames(data.product.id);

  return buildPageMetadata({
    title: data.product.translation.seoTitle ?? data.product.translation.name,
    description:
      data.product.translation.seoDescription ??
      data.product.translation.shortDescription,
    alternates,
    locale,
    pathname: `/${locale}/products/${slug}`,
  });
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ locale: PublicLocale; slug: string }>;
}) {
  const { locale, slug } = await params;
  const [data, settings] = await Promise.all([
    getProductDetailData(locale, slug),
    getSiteChrome(locale),
  ]);

  if (!data) {
    notFound();
  }

  const priceLabel = resolvePricingMessage({
    locale,
    amount: data.product.publicPriceAmount ? Number(data.product.publicPriceAmount) : null,
    currency: data.product.publicPriceCurrency,
    unitLabel: data.product.publicPriceUnitLabel,
    message:
      data.product.translation.contactForPricingMessage ??
      settings.translation?.defaultContactForPricingMessage ??
      "",
  });

  return (
    <section className="section-shell">
      <div className="content-shell space-y-10">
        <Breadcrumbs
          items={[
            { href: `/${locale}`, label: "Home" },
            { href: `/${locale}/products`, label: locale === "fr" ? "Produits" : "Products" },
            {
              href: `/${locale}/categories/${data.product.categoryTranslation?.fullSlugPathCache}`,
              label: data.product.categoryTranslation?.name ?? data.product.category.code,
            },
            { label: data.product.translation.name },
          ]}
        />

        <div className="grid gap-8 lg:grid-cols-[1fr_0.9fr]">
          <Card className="overflow-hidden">
            <div className="relative aspect-[4/3] bg-gradient-to-br from-[#fff0f0] to-white">
              {data.product.primaryImage?.publicUrl ? (
                <Image
                  src={data.product.primaryImage.publicUrl}
                  alt={data.product.translation.name}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              ) : null}
            </div>
          </Card>
          <div className="space-y-6">
            <div className="space-y-3">
              <Badge variant="muted">
                {data.product.manufacturerTranslation?.name}
              </Badge>
              <h1 className="text-5xl font-semibold tracking-[-0.04em]">
                {data.product.translation.name}
              </h1>
              <p className="text-lg leading-8 text-muted">
                {data.product.translation.shortDescription}
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Card className="p-5">
                <p className="text-xs uppercase tracking-[0.08em] text-muted">
                  {locale === "fr" ? "Disponibilite" : "Availability"}
                </p>
                <p className="mt-3 text-lg font-semibold">
                  {getAvailabilityLabel(locale, data.product.availabilityStatus)}
                </p>
                <p className="mt-2 text-sm leading-6 text-muted">
                  {data.product.translation.availabilityNote}
                </p>
              </Card>
              <Card className="p-5">
                <p className="text-xs uppercase tracking-[0.08em] text-muted">
                  {locale === "fr" ? "Prix" : "Pricing"}
                </p>
                <p className="mt-3 text-lg font-semibold">{priceLabel}</p>
                <p className="mt-2 text-sm leading-6 text-muted">
                  {locale === "fr"
                    ? "Aucun achat en ligne, uniquement une demande B2B."
                    : "Informational pricing only. No online purchase workflow."}
                </p>
              </Card>
            </div>
            <div className="flex flex-wrap gap-4">
              <Button asChild size="lg">
                <Link
                  href={`/${locale}/contact?product=${data.product.id}&manufacturer=${data.product.manufacturerId}`}
                >
                  {locale === "fr" ? "Demander ce produit" : "Inquire about this product"}
                </Link>
              </Button>
              <Button asChild variant="secondary" size="lg">
                <Link
                  href={`/${locale}/manufacturers/${data.product.manufacturerTranslation?.slug}`}
                >
                  {locale === "fr" ? "Voir le fabricant" : "View manufacturer"}
                </Link>
              </Button>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <Card className="p-8">
            <h2 className="text-2xl font-semibold">
              {locale === "fr" ? "Description detaillee" : "Detailed description"}
            </h2>
            <p className="mt-4 text-base leading-8 text-muted">
              {data.product.translation.longDescription}
            </p>
          </Card>
          <Card className="p-8">
            <h2 className="text-2xl font-semibold">
              {locale === "fr" ? "Specifications" : "Specifications"}
            </h2>
            <div className="mt-5 space-y-4">
              {data.product.specs.map((spec) => (
                <div
                  key={spec.id}
                  className="flex items-center justify-between gap-4 border-b border-line pb-3 last:border-b-0 last:pb-0"
                >
                  <span className="text-sm text-muted">{spec.label}</span>
                  <span className="text-sm font-semibold">
                    {spec.value}
                    {spec.unit ? ` ${spec.unit}` : ""}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {data.product.documents.length > 0 ? (
          <Card className="p-8">
            <h2 className="text-2xl font-semibold">
              {locale === "fr" ? "Documents" : "Documents"}
            </h2>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {data.product.documents.map((document) => (
                <a
                  key={document.id}
                  href={document.media.publicUrl ?? "#"}
                  className="rounded-3xl border border-line bg-white p-5"
                >
                  <p className="font-semibold">
                    {document.translation?.label ?? document.media.title}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-muted">
                    {document.translation?.description}
                  </p>
                </a>
              ))}
            </div>
          </Card>
        ) : null}

        <div className="space-y-6">
          <div className="space-y-2">
            <p className="eyebrow">
              {locale === "fr" ? "Produits lies" : "Related products"}
            </p>
            <h2 className="text-3xl font-semibold tracking-[-0.03em]">
              {locale === "fr"
                ? "Autres produits de cette categorie"
                : "More products from this category"}
            </h2>
          </div>
          <div className="grid gap-5 lg:grid-cols-3">
            {data.relatedProducts.map((product) => (
              <ProductCard
                key={product.id}
                locale={locale}
                slug={product.translation.slug}
                name={product.translation.name}
                shortDescription={product.translation.shortDescription}
                availabilityStatus={product.availabilityStatus}
                priceLabel=""
                imageUrl={product.primaryImage?.publicUrl}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
