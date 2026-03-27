import { getTranslations } from "next-intl/server";

import { Card } from "@/components/ui/card";
import { buildPageMetadata } from "@/lib/seo/metadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return buildPageMetadata({
    title: locale === "fr" ? "Catégories" : "Categories",
    description:
      locale === "fr"
        ? "Fondation de navigation hiérarchique pour les catégories ATA."
        : "Hierarchy-ready category navigation foundation for ATA.",
    pathname: `/${locale}/categories`,
  });
}

export default async function CategoriesIndexPage() {
  const page = await getTranslations("pages.categories");

  return (
    <section className="section-shell">
      <div className="content-shell space-y-8">
        <div className="space-y-4">
          <p className="eyebrow">{page("eyebrow")}</p>
          <h1 className="text-4xl font-semibold tracking-[-0.03em]">{page("title")}</h1>
          <p className="max-w-3xl text-lg leading-8 text-muted">{page("body")}</p>
        </div>
        <Card className="p-8 text-sm leading-7 text-muted">{page("note")}</Card>
      </div>
    </section>
  );
}
