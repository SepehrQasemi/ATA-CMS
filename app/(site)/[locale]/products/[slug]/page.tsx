import { buildPageMetadata } from "@/lib/seo/metadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;

  return buildPageMetadata({
    title: `Product ${slug}`,
    description: "Foundation route for locale-aware product detail pages.",
    pathname: `/${locale}/products/${slug}`,
  });
}

export default async function ProductDetailSkeleton({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return (
    <section className="section-shell">
      <div className="content-shell surface-panel p-8">
        <p className="eyebrow">Product Detail Skeleton</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-[-0.03em]">{slug}</h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-muted">
          This route is in place for the locale-aware product detail experience and
          will be backed by the CMS domain model in the next phase.
        </p>
      </div>
    </section>
  );
}
