import Link from "next/link";
import { notFound } from "next/navigation";

import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { CategoryCard } from "@/components/site/category-card";
import { ProductCard } from "@/components/site/product-card";
import { Button } from "@/components/ui/button";
import { resolvePricingMessage } from "@/lib/domain/pricing";
import type { PublicLocale } from "@/lib/i18n/config";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { getCategoryDetailData, getSiteChrome } from "@/lib/public/queries";
import { getCategoryAlternatePathnames } from "@/lib/public/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: PublicLocale; slug: string[] }>;
}) {
  const { locale, slug } = await params;
  const data = await getCategoryDetailData(locale, slug.join("/"));

  if (!data) {
    return {};
  }

  const alternates = await getCategoryAlternatePathnames(data.category.id);

  return buildPageMetadata({
    title: data.category.translation.seoTitle ?? data.category.translation.name,
    description:
      data.category.translation.seoDescription ??
      data.category.translation.shortDescription ??
      "",
    alternates,
    locale,
    pathname: `/${locale}/categories/${slug.join("/")}`,
  });
}

export default async function CategoryDetailPage({
  params,
}: {
  params: Promise<{ locale: PublicLocale; slug: string[] }>;
}) {
  const { locale, slug } = await params;
  const [data, settings] = await Promise.all([
    getCategoryDetailData(locale, slug.join("/")),
    getSiteChrome(locale),
  ]);

  if (!data) {
    notFound();
  }

  return (
    <section className="section-shell">
      <div className="content-shell space-y-10">
        <Breadcrumbs
          items={[
            { href: `/${locale}`, label: "Home" },
            {
              href: `/${locale}/categories`,
              label: locale === "fr" ? "Categories" : "Categories",
            },
            { label: data.category.translation.name },
          ]}
        />

        <div className="space-y-4">
          <p className="eyebrow">{data.category.translation.name}</p>
          <h1 className="text-5xl font-semibold tracking-[-0.04em]">
            {data.category.translation.name}
          </h1>
          <p className="max-w-3xl text-lg leading-8 text-muted">
            {data.category.translation.shortDescription}
          </p>
          <p className="max-w-4xl text-base leading-8 text-muted">
            {data.category.translation.body}
          </p>
        </div>

        {data.category.children.length > 0 ? (
          <div className="space-y-6">
            <h2 className="text-3xl font-semibold tracking-[-0.03em]">
              {locale === "fr" ? "Sous-categories" : "Subcategories"}
            </h2>
            <div className="grid gap-5 lg:grid-cols-2">
              {data.category.children.map((child) => (
                <CategoryCard
                  key={child.id}
                  locale={locale}
                  name={child.translation?.name ?? child.code}
                  path={child.translation?.fullSlugPathCache ?? ""}
                  description={child.translation?.shortDescription ?? null}
                />
              ))}
            </div>
          </div>
        ) : null}

        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h2 className="text-3xl font-semibold tracking-[-0.03em]">
              {locale === "fr" ? "Produits de cette categorie" : "Products in this category"}
            </h2>
            <Button asChild variant="secondary">
              <Link href={`/${locale}/contact`}>
                {locale === "fr" ? "Parler a ATA" : "Talk to ATA"}
              </Link>
            </Button>
          </div>
          <div className="grid gap-5 lg:grid-cols-2 xl:grid-cols-3">
            {data.category.products.map((product) => (
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
                  message: settings.translation?.defaultContactForPricingMessage ?? "",
                })}
                imageUrl={product.primaryImage?.publicUrl}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
