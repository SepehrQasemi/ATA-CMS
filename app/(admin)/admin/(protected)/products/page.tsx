import Link from "next/link";

import { AdminPageHeader } from "@/components/admin/page-header";
import { AdminSectionCard } from "@/components/admin/section-card";
import { AdminStatusBadge } from "@/components/admin/status-badge";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/db";
import { appLocales } from "@/lib/i18n/config";

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    include: {
      category: true,
      manufacturer: true,
      translations: true,
      images: true,
    },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  });

  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow="Products"
        title="Catalog product management"
        description="Manage category/manufacturer relations, availability, informational pricing, localized content, imagery, specs, and product documents."
        action={
          <Button asChild>
            <Link href="/admin/products/new">Create product</Link>
          </Button>
        }
      />

      <AdminSectionCard
        title="Product library"
        description="Products stay inquiry-led. If no public price exists, localized contact-for-pricing copy must cover the fallback."
      >
        {products.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-line text-muted">
                <tr>
                  <th className="px-4 py-3 font-semibold">Product</th>
                  <th className="px-4 py-3 font-semibold">Availability</th>
                  <th className="px-4 py-3 font-semibold">Relations</th>
                  {appLocales.map((locale) => (
                    <th key={locale} className="px-4 py-3 font-semibold uppercase">
                      {locale}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className="border-b border-line/60 last:border-b-0">
                    <td className="px-4 py-4 align-top">
                      <Link
                        href={`/admin/products/${product.id}`}
                        className="break-all font-semibold transition hover:text-brand"
                      >
                        {product.sku ?? product.id}
                      </Link>
                      <div className="mt-1 text-xs text-muted">
                        {product.images.length} images attached
                      </div>
                    </td>
                    <td className="space-y-2 px-4 py-4 align-top">
                      <AdminStatusBadge
                        kind="availability"
                        status={product.availabilityStatus}
                      />
                      <div>
                        <AdminStatusBadge kind="publish" status={product.publishStatus} />
                      </div>
                    </td>
                    <td className="px-4 py-4 align-top text-xs leading-5 text-muted">
                      <div className="break-words">Category: {product.category.code}</div>
                      <div className="break-words">
                        Manufacturer: {product.manufacturer.code}
                      </div>
                      <div>
                        Price:{" "}
                        {product.publicPriceAmount
                          ? `${product.publicPriceAmount.toString()} ${product.publicPriceCurrency ?? ""}`
                          : "Contact fallback"}
                      </div>
                    </td>
                    {appLocales.map((locale) => {
                      const translation = product.translations.find(
                        (item) => item.localeCode === locale,
                      );

                      return (
                        <td key={locale} className="px-4 py-4 align-top">
                          {translation ? (
                            <div className="space-y-2">
                              <AdminStatusBadge
                                kind="publish"
                                status={translation.publishStatus}
                              />
                              <div className="text-xs leading-5 text-muted">
                                <div className="break-words">{translation.name}</div>
                                <div className="break-all">{translation.slug}</div>
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
        ) : (
          <div className="rounded-3xl border border-dashed border-line bg-[#fffafa] px-5 py-4 text-sm leading-7 text-muted">
            No products exist yet. Create the first product to begin the catalog.
          </div>
        )}
      </AdminSectionCard>
    </div>
  );
}
