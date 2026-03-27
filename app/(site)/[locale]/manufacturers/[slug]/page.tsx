import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { ProductCard } from "@/components/site/product-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { PublicLocale } from "@/lib/i18n/config";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { getManufacturerDetailData, getSiteChrome } from "@/lib/public/queries";
import { getManufacturerAlternatePathnames } from "@/lib/public/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: PublicLocale; slug: string }>;
}) {
  const { locale, slug } = await params;
  const data = await getManufacturerDetailData(locale, slug);

  if (!data) {
    return {};
  }

  const alternates = await getManufacturerAlternatePathnames(data.manufacturer.id);

  return buildPageMetadata({
    title: data.manufacturer.translation.seoTitle ?? data.manufacturer.translation.name,
    description:
      data.manufacturer.translation.seoDescription ??
      data.manufacturer.translation.summary ??
      "",
    alternates,
    locale,
    pathname: `/${locale}/manufacturers/${slug}`,
  });
}

export default async function ManufacturerDetailPage({
  params,
}: {
  params: Promise<{ locale: PublicLocale; slug: string }>;
}) {
  const { locale, slug } = await params;
  const [data, settings] = await Promise.all([
    getManufacturerDetailData(locale, slug),
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
              href: `/${locale}/manufacturers`,
              label: locale === "fr" ? "Fabricants" : "Manufacturers",
            },
            { label: data.manufacturer.translation.name },
          ]}
        />

        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <Card className="flex items-center justify-center overflow-hidden p-10">
            {data.manufacturer.logoMedia?.publicUrl ? (
              <Image
                src={data.manufacturer.logoMedia.publicUrl}
                alt={data.manufacturer.translation.name}
                width={220}
                height={128}
                className="max-h-32 w-auto object-contain"
              />
            ) : null}
          </Card>
          <div className="space-y-5">
            <Badge variant="muted">{data.manufacturer.originCountry ?? "Producer"}</Badge>
            <h1 className="text-5xl font-semibold tracking-[-0.04em]">
              {data.manufacturer.translation.name}
            </h1>
            <p className="text-lg leading-8 text-muted">
              {data.manufacturer.translation.summary}
            </p>
            <p className="text-base leading-8 text-muted">
              {data.manufacturer.translation.body}
            </p>
            <div className="flex flex-wrap gap-4">
              <Button asChild size="lg">
                <Link href={`/${locale}/contact?manufacturer=${data.manufacturer.id}`}>
                  {locale === "fr" ? "Contacter ATA" : "Contact ATA"}
                </Link>
              </Button>
              {data.manufacturer.websiteUrl ? (
                <Button asChild variant="secondary" size="lg">
                  <a href={data.manufacturer.websiteUrl} target="_blank">
                    {locale === "fr" ? "Site fabricant" : "Manufacturer website"}
                  </a>
                </Button>
              ) : null}
            </div>
          </div>
        </div>

        <Card className="p-8">
          <h2 className="text-2xl font-semibold">
            {locale === "fr" ? "Produits lies" : "Linked products"}
          </h2>
          <div className="mt-6 grid gap-5 lg:grid-cols-3">
            {data.manufacturer.products.map((product) => (
              <ProductCard
                key={product.id}
                locale={locale}
                slug={product.translation.slug}
                name={product.translation.name}
                shortDescription={product.translation.shortDescription}
                availabilityStatus={product.availabilityStatus}
                priceLabel={settings.translation?.defaultContactForPricingMessage ?? ""}
                imageUrl={product.primaryImage?.publicUrl}
              />
            ))}
          </div>
        </Card>
      </div>
    </section>
  );
}
