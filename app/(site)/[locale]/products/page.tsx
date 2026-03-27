import { notFound } from "next/navigation";

import { ProductCard } from "@/components/site/product-card";
import type { PublicLocale } from "@/lib/i18n/config";
import { resolvePricingMessage } from "@/lib/domain/pricing";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { getProductsIndexData, getSiteChrome } from "@/lib/public/queries";
import { getPageAlternatePathnames } from "@/lib/public/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: PublicLocale }>;
}) {
  const { locale } = await params;
  const data = await getProductsIndexData(locale);

  if (!data.page) {
    return {};
  }

  const alternates = await getPageAlternatePathnames(data.page.id, false);

  return buildPageMetadata({
    title: data.page.translation.seoTitle ?? data.page.translation.title,
    description:
      data.page.translation.seoDescription ?? data.page.translation.summary ?? "",
    alternates,
    locale,
    pathname: `/${locale}/products`,
  });
}

export default async function ProductsIndexPage({
  params,
}: {
  params: Promise<{ locale: PublicLocale }>;
}) {
  const { locale } = await params;
  const [data, settings] = await Promise.all([
    getProductsIndexData(locale),
    getSiteChrome(locale),
  ]);

  if (!data.page) {
    notFound();
  }

  return (
    <section className="section-shell">
      <div className="content-shell space-y-10">
        <div className="space-y-4">
          <p className="eyebrow">{data.page.translation.title}</p>
          <h1 className="text-5xl font-semibold tracking-[-0.04em]">
            {data.page.translation.seoTitle ?? data.page.translation.title}
          </h1>
          <p className="max-w-3xl text-lg leading-8 text-muted">
            {data.page.translation.summary}
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-2 xl:grid-cols-3">
          {data.products.map((product) => (
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
                  settings.translation?.defaultContactForPricingMessage ??
                  "",
              })}
              imageUrl={product.primaryImage?.publicUrl}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
