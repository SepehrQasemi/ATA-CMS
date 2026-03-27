import { notFound } from "next/navigation";

import { Card } from "@/components/ui/card";
import type { PublicLocale } from "@/lib/i18n/config";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { getPublicPage, getSiteChrome } from "@/lib/public/queries";
import { getPageAlternatePathnames } from "@/lib/public/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: PublicLocale }>;
}) {
  const { locale } = await params;
  const page = await getPublicPage(locale, "about");

  if (!page) {
    return {};
  }

  const alternates = await getPageAlternatePathnames(page.id, false);

  return buildPageMetadata({
    title: page.translation.seoTitle ?? page.translation.title,
    description: page.translation.seoDescription ?? page.translation.summary ?? "",
    alternates,
    locale,
    pathname: `/${locale}/about`,
  });
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: PublicLocale }>;
}) {
  const { locale } = await params;
  const [page, settings] = await Promise.all([
    getPublicPage(locale, "about"),
    getSiteChrome(locale),
  ]);

  if (!page) {
    notFound();
  }

  const valuePoints =
    locale === "fr"
      ? [
          "ATA organise la decouverte produit autour des categories, fabricants et demandes.",
          "Le site reste volontairement non transactionnel et oriente relation commerciale.",
          "Les contenus publics sont separes des workflows admin pour publier en securite.",
        ]
      : [
          "ATA structures discovery around products, categories, manufacturers, and inquiry context.",
          "The public site stays intentionally non-transactional and B2B-oriented.",
          "Editorial safety comes from explicit base and locale publication states.",
        ];

  return (
    <section className="section-shell">
      <div className="content-shell space-y-10">
        <div className="space-y-4">
          <p className="eyebrow">{page.translation.title}</p>
          <h1 className="max-w-4xl text-5xl font-semibold tracking-[-0.04em]">
            {settings.translation?.siteName}
          </h1>
          <p className="max-w-3xl text-lg leading-8 text-muted">
            {page.translation.summary}
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
          <Card className="p-8">
            <h2 className="text-2xl font-semibold">
              {locale === "fr" ? "Positionnement" : "Positioning"}
            </h2>
            <p className="mt-4 text-base leading-8 text-muted">
              {page.translation.seoDescription}
            </p>
            <p className="mt-6 text-base leading-8 text-muted">
              {settings.translation?.contactIntro}
            </p>
          </Card>
          <div className="grid gap-4">
            {valuePoints.map((item) => (
              <Card key={item} className="p-6">
                <p className="text-sm leading-7">{item}</p>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
