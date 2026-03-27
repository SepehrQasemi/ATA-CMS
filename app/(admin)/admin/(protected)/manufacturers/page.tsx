import Link from "next/link";

import { AdminPageHeader } from "@/components/admin/page-header";
import { AdminSectionCard } from "@/components/admin/section-card";
import { AdminStatusBadge } from "@/components/admin/status-badge";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/db";
import { appLocales } from "@/lib/i18n/config";

export default async function AdminManufacturersPage() {
  const manufacturers = await prisma.manufacturer.findMany({
    include: {
      translations: true,
      _count: { select: { products: true } },
    },
    orderBy: [{ sortOrder: "asc" }, { code: "asc" }],
  });

  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow="Manufacturers"
        title="Producer and brand profiles"
        description="Manufacturers represent the main producer or brand only. Keep profile pages credible, localized, and tied to real products."
        action={
          <Button asChild>
            <Link href="/admin/manufacturers/new">Create manufacturer</Link>
          </Button>
        }
      />

      <AdminSectionCard
        title="Manufacturer library"
        description="Each manufacturer profile should have meaningful body content and related products before publication."
      >
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-line text-muted">
              <tr>
                <th className="px-4 py-3 font-semibold">Manufacturer</th>
                <th className="px-4 py-3 font-semibold">Base status</th>
                <th className="px-4 py-3 font-semibold">Products</th>
                {appLocales.map((locale) => (
                  <th key={locale} className="px-4 py-3 font-semibold uppercase">
                    {locale}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {manufacturers.map((manufacturer) => (
                <tr
                  key={manufacturer.id}
                  className="border-b border-line/60 last:border-b-0"
                >
                  <td className="px-4 py-4">
                    <Link
                      href={`/admin/manufacturers/${manufacturer.id}`}
                      className="font-semibold transition hover:text-brand"
                    >
                      {manufacturer.code}
                    </Link>
                    <div className="mt-1 text-xs text-muted">
                      {manufacturer.originCountry ?? "No origin country"}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <AdminStatusBadge
                      kind="publish"
                      status={manufacturer.publishStatus}
                    />
                  </td>
                  <td className="px-4 py-4 text-muted">
                    {manufacturer._count.products}
                  </td>
                  {appLocales.map((locale) => {
                    const translation = manufacturer.translations.find(
                      (item) => item.localeCode === locale,
                    );

                    return (
                      <td key={locale} className="px-4 py-4">
                        {translation ? (
                          <div className="space-y-2">
                            <AdminStatusBadge
                              kind="publish"
                              status={translation.publishStatus}
                            />
                            <div className="text-xs leading-5 text-muted">
                              <div>{translation.name}</div>
                              <div>{translation.slug}</div>
                            </div>
                          </div>
                        ) : (
                          <span className="text-xs text-muted">Missing</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </AdminSectionCard>
    </div>
  );
}
