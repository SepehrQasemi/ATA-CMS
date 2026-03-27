import { notFound } from "next/navigation";

import { ManufacturerCard } from "@/components/site/manufacturer-card";
import type { PublicLocale } from "@/lib/i18n/config";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { getManufacturersIndexData } from "@/lib/public/queries";
import { getPageAlternatePathnames } from "@/lib/public/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: PublicLocale }>;
}) {
  const { locale } = await params;
  const data = await getManufacturersIndexData(locale);

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
    pathname: `/${locale}/manufacturers`,
  });
}

export default async function ManufacturersIndexPage({
  params,
}: {
  params: Promise<{ locale: PublicLocale }>;
}) {
  const { locale } = await params;
  const data = await getManufacturersIndexData(locale);

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
          {data.manufacturers.map((manufacturer) => (
            <ManufacturerCard
              key={manufacturer.id}
              locale={locale}
              slug={manufacturer.translation.slug}
              name={manufacturer.translation.name}
              summary={manufacturer.translation.summary ?? ""}
              productCount={manufacturer._count.products}
              logoUrl={manufacturer.logoMedia?.publicUrl}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
