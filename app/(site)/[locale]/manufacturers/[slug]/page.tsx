import { buildPageMetadata } from "@/lib/seo/metadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;

  return buildPageMetadata({
    title: `Manufacturer ${slug}`,
    description: "Foundation route for manufacturer profile pages.",
    pathname: `/${locale}/manufacturers/${slug}`,
  });
}

export default async function ManufacturerDetailSkeleton({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return (
    <section className="section-shell">
      <div className="content-shell surface-panel p-8">
        <p className="eyebrow">Manufacturer Detail Skeleton</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-[-0.03em]">{slug}</h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-muted">
          Manufacturer-aware routing is scaffolded and will connect to related
          product data in the next phase.
        </p>
      </div>
    </section>
  );
}
