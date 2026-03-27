import Link from "next/link";

import { getTranslations } from "next-intl/server";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { siteConfig } from "@/lib/site-config";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return buildPageMetadata({
    title: locale === "fr" ? "Accueil" : "Home",
    description:
      locale === "fr"
        ? "Fondation publique multilingue pour le catalogue B2B d'Abadis Tejarat Arka."
        : "Multilingual public foundation for the Abadis Tejarat Arka B2B catalog.",
    pathname: `/${locale}`,
  });
}

const featuredItems = {
  categories: [
    "Food additives",
    "Processing ingredients",
    "Industrial compounds",
  ],
  manufacturers: ["Arka Process", "Nordic Sourcing Labs", "Meridian Brands"],
};

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const home = await getTranslations("home");
  const nav = await getTranslations("nav");
  const trustPoints = home.raw("trustPoints") as string[];

  return (
    <>
      <section className="section-shell">
        <div className="content-shell hero-grid">
          <div className="space-y-8">
            <Badge variant="muted">{home("eyebrow")}</Badge>
            <div className="space-y-5">
              <h1 className="max-w-3xl text-balance text-5xl font-semibold leading-[1.02] tracking-[-0.04em] sm:text-6xl">
                {home("title")}
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-muted">
                {home("description")}
              </p>
            </div>
            <div className="flex flex-wrap gap-4">
              <Button asChild size="lg">
                <Link href={`/${locale}/contact`}>{nav("inquiry")}</Link>
              </Button>
              <Button asChild variant="secondary" size="lg">
                <Link href={`/${locale}/products`}>{nav("products")}</Link>
              </Button>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {trustPoints.map((point) => (
                <Card key={point} className="p-5">
                  <p className="text-sm font-semibold leading-6">{point}</p>
                </Card>
              ))}
            </div>
          </div>
          <Card className="brand-ring overflow-hidden p-8">
            <div className="space-y-8 rounded-[1.4rem] bg-gradient-to-br from-[#4d0f22] to-[#2b0813] p-8 text-white shadow-[0_20px_45px_rgba(43,8,19,0.22)]">
              <div className="eyebrow border-white/20 bg-white/8 text-white/80">
                {siteConfig.shortName}
              </div>
              <div className="space-y-4">
                <h2 className="text-3xl font-semibold leading-tight">
                  {home("heroPanelTitle")}
                </h2>
                <p className="text-sm leading-7 text-white/76">
                  {home("heroPanelBody")}
                </p>
              </div>
              <div className="grid gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.1em] text-white/55">
                    {home("featuredCategories")}
                  </p>
                  <ul className="mt-3 flex flex-wrap gap-2 text-sm">
                    {featuredItems.categories.map((item) => (
                      <li
                        key={item}
                        className="rounded-full border border-white/12 bg-white/10 px-3 py-2"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.1em] text-white/55">
                    {home("featuredManufacturers")}
                  </p>
                  <ul className="mt-3 space-y-2 text-sm text-white/84">
                    {featuredItems.manufacturers.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>
      <section className="pb-16">
        <div className="content-shell surface-panel px-8 py-10">
          <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
            <div className="space-y-3">
              <p className="eyebrow">{home("foundationLabel")}</p>
              <h2 className="text-3xl font-semibold tracking-[-0.03em]">
                {home("foundationTitle")}
              </h2>
              <p className="max-w-2xl text-base leading-7 text-muted">
                {home("foundationBody")}
              </p>
            </div>
            <Button asChild variant="secondary">
              <Link href="/admin/login">Admin CMS</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
