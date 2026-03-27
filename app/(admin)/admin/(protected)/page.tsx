import Link from "next/link";

import { AdminPageHeader } from "@/components/admin/page-header";
import { AdminSectionCard } from "@/components/admin/section-card";
import { AdminStatusBadge } from "@/components/admin/status-badge";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/db";

export default async function AdminDashboardPage() {
  const [pages, products, categories, manufacturers, media, inquiries, locales] =
    await Promise.all([
      prisma.page.count(),
      prisma.product.count(),
      prisma.category.count(),
      prisma.manufacturer.count(),
      prisma.media.count(),
      prisma.contactRequest.findMany({
        include: { product: true, manufacturer: true },
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
      prisma.locale.findMany({
        include: {
          _count: {
            select: {
              pageTranslations: true,
              categoryTranslations: true,
              manufacturerTranslations: true,
              productTranslations: true,
            },
          },
        },
        orderBy: { sortOrder: "asc" },
      }),
    ]);

  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow="Dashboard"
        title="ATA-CMS dashboard"
        description="Operational overview for catalog content, locale posture, publishing readiness, and the latest inquiry queue."
        action={
          <Button asChild>
            <Link href="/admin/products/new">Create product</Link>
          </Button>
        }
      />

      <div className="grid gap-5 xl:grid-cols-5">
        {[
          { label: "Pages", value: pages, href: "/admin/pages" },
          { label: "Products", value: products, href: "/admin/products" },
          { label: "Categories", value: categories, href: "/admin/categories" },
          { label: "Manufacturers", value: manufacturers, href: "/admin/manufacturers" },
          { label: "Media", value: media, href: "/admin/media" },
        ].map((card) => (
          <AdminSectionCard key={card.label} title={card.label}>
            <div className="space-y-3">
              <p className="text-4xl font-semibold tracking-[-0.04em]">{card.value}</p>
              <Link href={card.href} className="text-sm font-semibold text-brand">
                Open {card.label.toLowerCase()}
              </Link>
            </div>
          </AdminSectionCard>
        ))}
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
        <AdminSectionCard
          title="Recent inquiries"
          description="Stored directly in the application database, no paid service required for the MVP workflow."
        >
          <div className="space-y-4">
            {inquiries.map((inquiry) => (
              <div
                key={inquiry.id}
                className="rounded-3xl border border-line bg-white p-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold">{inquiry.contactName}</p>
                    <p className="text-sm text-muted">{inquiry.email}</p>
                  </div>
                  <AdminStatusBadge kind="inquiry" status={inquiry.status} />
                </div>
                <p className="mt-3 text-sm leading-6 text-muted">
                  {inquiry.companyName ?? "No company"} ·{" "}
                  {inquiry.product?.id ?? inquiry.manufacturer?.id ?? "General inquiry"}
                </p>
                <p className="mt-3 text-sm leading-6">{inquiry.message}</p>
              </div>
            ))}
          </div>
        </AdminSectionCard>

        <AdminSectionCard
          title="Locale coverage"
          description="English and French stay public. Persian remains editable in admin but must not become public in MVP."
        >
          <div className="space-y-4">
            {locales.map((locale) => (
              <div
                key={locale.code}
                className="rounded-3xl border border-line bg-white p-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold">{locale.label}</p>
                    <p className="text-sm text-muted">
                      {locale.direction.toUpperCase()} · {locale.nativeLabel ?? locale.label}
                    </p>
                  </div>
                  <AdminStatusBadge
                    kind="locale"
                    status={locale.visibilityStatus}
                  />
                </div>
                <div className="mt-4 grid gap-3 text-xs text-muted md:grid-cols-2">
                  <div>Page translations: {locale._count.pageTranslations}</div>
                  <div>Category translations: {locale._count.categoryTranslations}</div>
                  <div>Manufacturer translations: {locale._count.manufacturerTranslations}</div>
                  <div>Product translations: {locale._count.productTranslations}</div>
                </div>
              </div>
            ))}
          </div>
        </AdminSectionCard>
      </div>
    </div>
  );
}
