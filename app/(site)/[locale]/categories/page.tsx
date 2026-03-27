import { notFound } from "next/navigation";

import { CategoryCard } from "@/components/site/category-card";
import { Card } from "@/components/ui/card";
import type { PublicLocale } from "@/lib/i18n/config";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { getCategoriesIndexData } from "@/lib/public/queries";
import { getPageAlternatePathnames } from "@/lib/public/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: PublicLocale }>;
}) {
  const { locale } = await params;
  const data = await getCategoriesIndexData(locale);

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
    pathname: `/${locale}/categories`,
  });
}

function renderTree(
  locale: PublicLocale,
  nodes: Array<{
    id: string;
    name: string;
    children: Array<unknown>;
    translation:
      | { fullSlugPathCache?: string | null; shortDescription?: string | null }
      | undefined;
  }>,
) {
  return (
    <div className="grid gap-5">
      {nodes.map((node) => (
        <div key={node.id} className="space-y-4">
          <CategoryCard
            locale={locale}
            name={node.name}
            path={node.translation?.fullSlugPathCache ?? ""}
            description={node.translation?.shortDescription ?? null}
          />
          {node.children.length > 0 ? (
            <div className="pl-6">
              {renderTree(locale, node.children as typeof nodes)}
            </div>
          ) : null}
        </div>
      ))}
    </div>
  );
}

export default async function CategoriesIndexPage({
  params,
}: {
  params: Promise<{ locale: PublicLocale }>;
}) {
  const { locale } = await params;
  const data = await getCategoriesIndexData(locale);

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
        <Card className="p-8">{renderTree(locale, data.categoryTree)}</Card>
      </div>
    </section>
  );
}
