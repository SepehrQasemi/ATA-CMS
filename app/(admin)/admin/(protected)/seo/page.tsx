import { AdminPageHeader } from "@/components/admin/page-header";
import { AdminSectionCard } from "@/components/admin/section-card";
import { AdminStatusBadge } from "@/components/admin/status-badge";
import { prisma } from "@/lib/db";
import { appLocales } from "@/lib/i18n/config";

export default async function AdminSeoPage() {
  const [pageTranslations, categoryTranslations, manufacturerTranslations, productTranslations] =
    await Promise.all([
      prisma.pageTranslation.findMany({
        where: { publishStatus: "published" },
        select: { id: true, localeCode: true, title: true, seoTitle: true, seoDescription: true },
      }),
      prisma.categoryTranslation.findMany({
        where: { publishStatus: "published" },
        select: { id: true, localeCode: true, name: true, seoTitle: true, seoDescription: true },
      }),
      prisma.manufacturerTranslation.findMany({
        where: { publishStatus: "published" },
        select: { id: true, localeCode: true, name: true, seoTitle: true, seoDescription: true },
      }),
      prisma.productTranslation.findMany({
        where: { publishStatus: "published" },
        select: { id: true, localeCode: true, name: true, seoTitle: true, seoDescription: true },
      }),
    ]);

  const collections = [
    { label: "Pages", items: pageTranslations },
    { label: "Categories", items: categoryTranslations },
    { label: "Manufacturers", items: manufacturerTranslations },
    { label: "Products", items: productTranslations },
  ];

  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow="SEO"
        title="Metadata and publication diagnostics"
        description="Published translations should not miss titles or descriptions. This page surfaces the obvious blockers before Phase 4 turns them into routing and sitemap rules."
      />

      <div className="grid gap-5 xl:grid-cols-2">
        {collections.map((collection) => {
          const missing = collection.items.filter(
            (item) => !item.seoTitle || !item.seoDescription,
          );

          return (
            <AdminSectionCard
              key={collection.label}
              title={collection.label}
              description={`${collection.items.length} published translations currently tracked.`}
            >
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <AdminStatusBadge
                    kind="publish"
                    status={missing.length === 0 ? "published" : "review"}
                  />
                  <span className="text-sm text-muted">
                    Missing metadata rows: {missing.length}
                  </span>
                </div>
                <div className="space-y-3">
                  {missing.length > 0 ? (
                    missing.slice(0, 8).map((item) => (
                      <div
                        key={item.id}
                        className="rounded-2xl border border-line bg-white p-4 text-sm"
                      >
                        <p className="font-semibold">
                          {"title" in item ? item.title : item.name}
                        </p>
                        <p className="text-muted">
                          Locale: {item.localeCode.toUpperCase()}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted">
                      No published translations are missing their core metadata fields.
                    </p>
                  )}
                </div>
              </div>
            </AdminSectionCard>
          );
        })}
      </div>

      <AdminSectionCard
        title="Locale publication posture"
        description="Phase 4 will turn this into canonical, hreflang, robots, and sitemap behavior."
      >
        <div className="grid gap-4 md:grid-cols-3">
          {appLocales.map((locale) => (
            <div key={locale} className="rounded-3xl border border-line bg-white p-4">
              <p className="font-semibold">{locale.toUpperCase()}</p>
              <p className="mt-2 text-sm text-muted">
                {locale === "fa"
                  ? "Modeled and editable, but not public or indexable in MVP."
                  : "Public locale with independent metadata ownership and no public fallback."}
              </p>
            </div>
          ))}
        </div>
      </AdminSectionCard>
    </div>
  );
}
