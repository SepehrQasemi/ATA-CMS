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
    title: locale === "fr" ? "À propos" : "About",
    description:
      locale === "fr"
        ? "Présentation de la fondation du site public ATA."
        : "Overview of the ATA public site foundation.",
    pathname: `/${locale}/about`,
  });
}

export default async function AboutPage() {
  const about = await getTranslations("pages.about");

  return (
    <section className="section-shell">
      <div className="content-shell space-y-8">
        <div className="space-y-4">
          <p className="eyebrow">{about("eyebrow")}</p>
          <h1 className="text-4xl font-semibold tracking-[-0.03em]">{about("title")}</h1>
          <p className="max-w-3xl text-lg leading-8 text-muted">{about("body")}</p>
        </div>
        <Card className="p-8 text-sm leading-7 text-muted">{about("note")}</Card>
      </div>
    </section>
  );
}
