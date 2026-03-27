import Link from "next/link";

import { AdminPageHeader } from "@/components/admin/page-header";
import { AdminSectionCard } from "@/components/admin/section-card";
import { AdminStatusBadge } from "@/components/admin/status-badge";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/db";
import { appLocales } from "@/lib/i18n/config";

export default async function AdminPagesPage() {
  const pages = await prisma.page.findMany({
    include: {
      translations: {
        orderBy: { localeCode: "asc" },
      },
    },
    orderBy: { pageKey: "asc" },
  });

  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow="Pages"
        title="System page management"
        description="Edit reserved public pages, track locale publication, and keep structured content blocks complete before publish."
        action={
          <Button asChild>
            <Link href="/admin/pages/new">Create page</Link>
          </Button>
        }
      />

      <AdminSectionCard
        title="Page inventory"
        description="System pages are modeled once and localized through translation rows. Persian stays editable but non-public."
      >
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-line text-muted">
              <tr>
                <th className="px-4 py-3 font-semibold">Page</th>
                <th className="px-4 py-3 font-semibold">Base status</th>
                {appLocales.map((locale) => (
                  <th key={locale} className="px-4 py-3 font-semibold uppercase">
                    {locale}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pages.map((page) => (
                <tr key={page.id} className="border-b border-line/60 last:border-b-0">
                  <td className="px-4 py-4">
                    <Link
                      href={`/admin/pages/${page.id}`}
                      className="font-semibold transition hover:text-brand"
                    >
                      {page.pageKey}
                    </Link>
                  </td>
                  <td className="px-4 py-4">
                    <AdminStatusBadge kind="publish" status={page.publishStatus} />
                  </td>
                  {appLocales.map((locale) => {
                    const translation = page.translations.find(
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
                              <div>{translation.title}</div>
                              <div>{translation.slug ?? "No slug"}</div>
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
