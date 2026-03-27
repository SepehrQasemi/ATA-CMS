import { buildPageMetadata } from "@/lib/seo/metadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string[] }>;
}) {
  const { locale, slug } = await params;
  const path = slug.join("/");

  return buildPageMetadata({
    title: `Category ${path}`,
    description: "Foundation route for hierarchy-aware category pages.",
    pathname: `/${locale}/categories/${path}`,
  });
}

export default async function CategoryDetailSkeleton({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;

  return (
    <section className="section-shell">
      <div className="content-shell surface-panel p-8">
        <p className="eyebrow">Category Detail Skeleton</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-[-0.03em]">
          {slug.join(" / ")}
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-muted">
          Multi-level category routing is scaffolded and ready for the translated
          slug-path model defined in the documentation package.
        </p>
      </div>
    </section>
  );
}
