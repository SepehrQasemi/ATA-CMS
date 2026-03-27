import Link from "next/link";

import { AdminPageHeader } from "@/components/admin/page-header";
import { AdminSectionCard } from "@/components/admin/section-card";
import { AdminStatusBadge } from "@/components/admin/status-badge";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/db";
import { appLocales } from "@/lib/i18n/config";

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    include: { translations: true, parent: true, _count: { select: { products: true } } },
    orderBy: [{ depth: "asc" }, { sortOrder: "asc" }, { code: "asc" }],
  });

  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow="Categories"
        title="Hierarchy-aware taxonomy management"
        description="Manage multi-level categories, localized slug paths, featured states, and landing content quality before publication."
        action={
          <Button asChild>
            <Link href="/admin/categories/new">Create category</Link>
          </Button>
        }
      />

      <AdminSectionCard
        title="Category tree"
        description="Categories act as public landing pages as well as taxonomy nodes. Parent-child structure is part of MVP from day one."
      >
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-line text-muted">
              <tr>
                <th className="px-4 py-3 font-semibold">Category</th>
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
              {categories.map((category) => (
                <tr key={category.id} className="border-b border-line/60 last:border-b-0">
                  <td className="px-4 py-4">
                    <Link
                      href={`/admin/categories/${category.id}`}
                      className="font-semibold transition hover:text-brand"
                    >
                      {"- ".repeat(category.depth)}
                      {category.code}
                    </Link>
                    <div className="mt-1 text-xs text-muted">
                      Parent: {category.parent?.code ?? "Root"}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <AdminStatusBadge kind="publish" status={category.publishStatus} />
                  </td>
                  <td className="px-4 py-4 text-muted">{category._count.products}</td>
                  {appLocales.map((locale) => {
                    const translation = category.translations.find(
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
                              <div>{translation.fullSlugPathCache ?? "No path"}</div>
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
