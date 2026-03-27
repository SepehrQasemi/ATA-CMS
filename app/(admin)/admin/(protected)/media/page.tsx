import Link from "next/link";

import { AdminPageHeader } from "@/components/admin/page-header";
import { AdminSectionCard } from "@/components/admin/section-card";
import { AdminStatusBadge } from "@/components/admin/status-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { prisma } from "@/lib/db";

import { saveMediaAction } from "./actions";

const selectClassName =
  "focus-ring flex h-11 w-full rounded-2xl border border-line bg-white px-4 py-2 text-sm shadow-sm outline-none";

type MediaPageProps = {
  searchParams: Promise<{ edit?: string; error?: string; saved?: string }>;
};

export default async function AdminMediaPage({ searchParams }: MediaPageProps) {
  const query = await searchParams;
  const [mediaItems, selected] = await Promise.all([
    prisma.media.findMany({
      orderBy: [{ kind: "asc" }, { title: "asc" }],
      include: {
        _count: {
          select: {
            productImages: true,
            productDocuments: true,
            productsAsPrimary: true,
            categoriesAsHero: true,
            manufacturersAsLogo: true,
            pagesAsHero: true,
          },
        },
      },
    }),
    query.edit
      ? prisma.media.findUnique({
          where: { id: query.edit },
        })
      : null,
  ]);

  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow="Media"
        title="Shared media and documents"
        description="Register local-safe image and document assets, inspect usage, and maintain clear titles and MIME types."
      />

      {query.error ? (
        <div className="rounded-3xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
          {decodeURIComponent(query.error)}
        </div>
      ) : null}
      {query.saved ? (
        <div className="rounded-3xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm text-emerald-700">
          Media saved successfully.
        </div>
      ) : null}

      <div className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
        <AdminSectionCard
          title={selected ? "Edit media record" : "Register media"}
          description="The MVP uses local/public URLs and database-managed metadata, not a paid DAM or storage dependency."
        >
          <form action={saveMediaAction} className="grid gap-4 md:grid-cols-2">
            <input type="hidden" name="id" value={selected?.id ?? ""} />
            <div>
              <Label htmlFor="kind">Kind</Label>
              <select
                id="kind"
                name="kind"
                defaultValue={selected?.kind ?? "image"}
                className={selectClassName}
              >
                <option value="image">Image</option>
                <option value="document">Document</option>
              </select>
            </div>
            <div>
              <Label htmlFor="storageKey">Storage key</Label>
              <Input
                id="storageKey"
                name="storageKey"
                defaultValue={selected?.storageKey ?? ""}
              />
            </div>
            <div>
              <Label htmlFor="publicUrl">Public URL</Label>
              <Input
                id="publicUrl"
                name="publicUrl"
                defaultValue={selected?.publicUrl ?? ""}
              />
            </div>
            <div>
              <Label htmlFor="mimeType">MIME type</Label>
              <Input
                id="mimeType"
                name="mimeType"
                defaultValue={selected?.mimeType ?? ""}
              />
            </div>
            <div>
              <Label htmlFor="title">Title</Label>
              <Input id="title" name="title" defaultValue={selected?.title ?? ""} />
            </div>
            <div>
              <Label htmlFor="originalFilename">Original filename</Label>
              <Input
                id="originalFilename"
                name="originalFilename"
                defaultValue={selected?.originalFilename ?? ""}
              />
            </div>
            <div>
              <Label htmlFor="width">Width</Label>
              <Input
                id="width"
                name="width"
                type="number"
                min={0}
                defaultValue={selected?.width ?? ""}
              />
            </div>
            <div>
              <Label htmlFor="height">Height</Label>
              <Input
                id="height"
                name="height"
                type="number"
                min={0}
                defaultValue={selected?.height ?? ""}
              />
            </div>
            <div>
              <Label htmlFor="bytes">Bytes</Label>
              <Input
                id="bytes"
                name="bytes"
                type="number"
                min={0}
                defaultValue={selected?.bytes ?? ""}
              />
            </div>
            <div className="flex items-end gap-3">
              <Button type="submit">{selected ? "Update media" : "Save media"}</Button>
              {selected ? (
                <Button asChild variant="secondary">
                  <Link href="/admin/media">Clear</Link>
                </Button>
              ) : null}
            </div>
          </form>
        </AdminSectionCard>

        <AdminSectionCard
          title="Media inventory"
          description="Usage counts show where each asset is currently attached across the catalog and CMS."
        >
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-line text-muted">
                <tr>
                  <th className="px-4 py-3 font-semibold">Asset</th>
                  <th className="px-4 py-3 font-semibold">Type</th>
                  <th className="px-4 py-3 font-semibold">Usage</th>
                </tr>
              </thead>
              <tbody>
                {mediaItems.map((item) => (
                  <tr key={item.id} className="border-b border-line/60 last:border-b-0">
                    <td className="px-4 py-4">
                      <div className="font-semibold">{item.title ?? item.storageKey}</div>
                      <div className="text-xs text-muted">{item.publicUrl ?? item.storageKey}</div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="space-y-2">
                        <AdminStatusBadge
                          kind="locale"
                          status={item.kind === "image" ? "public" : "internal_only"}
                        />
                        <div className="text-xs text-muted">{item.mimeType}</div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-xs leading-5 text-muted">
                      <div>Product images: {item._count.productImages}</div>
                      <div>Product docs: {item._count.productDocuments}</div>
                      <div>Primary product images: {item._count.productsAsPrimary}</div>
                      <div>
                        CMS usage:{" "}
                        {item._count.categoriesAsHero +
                          item._count.manufacturersAsLogo +
                          item._count.pagesAsHero}
                      </div>
                      <div className="mt-2">
                        <Button asChild size="sm" variant="secondary">
                          <Link href={`/admin/media?edit=${item.id}`}>Edit</Link>
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </AdminSectionCard>
      </div>
    </div>
  );
}
