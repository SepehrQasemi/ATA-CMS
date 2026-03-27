import Link from "next/link";
import { notFound } from "next/navigation";

import { AdminPageHeader } from "@/components/admin/page-header";
import { LocaleTabs } from "@/components/admin/locale-tabs";
import { AdminSectionCard } from "@/components/admin/section-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { prisma } from "@/lib/db";
import { getCategoryPublicationIssues } from "@/lib/domain/publication";
import { appLocales } from "@/lib/i18n/config";
import { getLocaleLabel } from "@/lib/admin/utils";

import { saveCategoryAction } from "../actions";

const selectClassName =
  "focus-ring flex h-11 w-full rounded-2xl border border-line bg-white px-4 py-2 text-sm shadow-sm outline-none";

type AdminCategoryDetailProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string; saved?: string }>;
};

export default async function AdminCategoryDetail({
  params,
  searchParams,
}: AdminCategoryDetailProps) {
  const [{ id }, query] = await Promise.all([params, searchParams]);
  const category =
    id === "new"
      ? null
      : await prisma.category.findUnique({
          where: { id },
          include: { translations: true, products: true },
        });

  if (!category && id !== "new") {
    notFound();
  }

  const categoryWhere = id === "new" ? {} : { id: { not: id } };

  const [categories, imageMedia, locales] = await Promise.all([
    prisma.category.findMany({
      where: categoryWhere,
      orderBy: [{ depth: "asc" }, { sortOrder: "asc" }],
      select: { id: true, code: true, depth: true },
    }),
    prisma.media.findMany({
      where: { kind: "image" },
      orderBy: { title: "asc" },
      select: { id: true, title: true, storageKey: true },
    }),
    prisma.locale.findMany({
      orderBy: { sortOrder: "asc" },
      select: { code: true, visibilityStatus: true },
    }),
  ]);

  const localeVisibility = new Map(
    locales.map((locale) => [locale.code, locale.visibilityStatus]),
  );
  const translationLookup = new Map(
    (category?.translations ?? []).map((translation) => [translation.localeCode, translation]),
  );

  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow="Categories"
        title={category ? `Edit ${category.code}` : "Create category"}
        description="Keep hierarchy clean, localized paths unique, and landing content strong enough for publication."
        action={
          <Button asChild variant="secondary">
            <Link href="/admin/categories">Back to categories</Link>
          </Button>
        }
      />

      {query.error ? (
        <div className="rounded-3xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
          {decodeURIComponent(query.error)}
        </div>
      ) : null}
      {query.saved ? (
        <div className="rounded-3xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm text-emerald-700">
          Category saved successfully.
        </div>
      ) : null}

      <form action={saveCategoryAction} className="space-y-6">
        <input type="hidden" name="id" value={category?.id ?? "new"} />

        <AdminSectionCard
          title="Base configuration"
          description="Base fields define hierarchy, featured state, and publish posture for the shared category node."
        >
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            <div>
              <Label htmlFor="code">Internal code</Label>
              <Input id="code" name="code" defaultValue={category?.code ?? ""} />
            </div>
            <div>
              <Label htmlFor="parentId">Parent category</Label>
              <select
                id="parentId"
                name="parentId"
                defaultValue={category?.parentId ?? ""}
                className={selectClassName}
              >
                <option value="">Root category</option>
                {categories.map((item) => (
                  <option key={item.id} value={item.id}>
                    {"- ".repeat(item.depth)}
                    {item.code}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="sortOrder">Sort order</Label>
              <Input
                id="sortOrder"
                name="sortOrder"
                type="number"
                min={0}
                defaultValue={category?.sortOrder ?? 0}
              />
            </div>
            <div>
              <Label htmlFor="publishStatus">Base publish status</Label>
              <select
                id="publishStatus"
                name="publishStatus"
                defaultValue={category?.publishStatus ?? "draft"}
                className={selectClassName}
              >
                <option value="draft">Draft</option>
                <option value="review">Review</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            </div>
            <div>
              <Label htmlFor="heroMediaId">Hero image</Label>
              <select
                id="heroMediaId"
                name="heroMediaId"
                defaultValue={category?.heroMediaId ?? ""}
                className={selectClassName}
              >
                <option value="">No hero media</option>
                {imageMedia.map((media) => (
                  <option key={media.id} value={media.id}>
                    {media.title ?? media.storageKey}
                  </option>
                ))}
              </select>
            </div>
            <label className="flex items-center gap-3 rounded-2xl border border-line bg-white px-4 py-3 text-sm font-semibold">
              <input
                type="checkbox"
                name="isFeatured"
                defaultChecked={category?.isFeatured ?? false}
                className="h-4 w-4 accent-[var(--brand)]"
              />
              Featured category
            </label>
          </div>
        </AdminSectionCard>

        <AdminSectionCard
          title="Locale content"
          description="Each locale owns its category copy and path segment. Persian remains editable but cannot become public in MVP."
        >
          <LocaleTabs
            tabs={appLocales.map((locale) => {
              const translation = translationLookup.get(locale) ?? {
                localeCode: locale,
                name: "",
                slugSegment: "",
                shortDescription: "",
                body: "",
                seoTitle: "",
                seoDescription: "",
                fullSlugPathCache: "",
                publishStatus: locale === "fa" ? "review" : "draft",
              };

              const fullSlugPathCache = translation.fullSlugPathCache || translation.slugSegment;
              const issues =
                translation.publishStatus === "published"
                  ? getCategoryPublicationIssues({
                      baseStatus: category?.publishStatus ?? "draft",
                      translationStatus: translation.publishStatus,
                      localeVisibility:
                        localeVisibility.get(locale) ?? "internal_only",
                      isComplete: true,
                      fullSlugPath: fullSlugPathCache,
                      shortDescription: translation.shortDescription,
                      body: translation.body,
                      seoTitle: translation.seoTitle,
                      seoDescription: translation.seoDescription,
                      hasPublishedProducts: (category?.products.length ?? 0) > 0,
                    })
                  : [];

              return {
                code: locale,
                label: `${locale.toUpperCase()} · ${getLocaleLabel(locale)}`,
                description:
                  locale === "fa"
                    ? "Editable only for future rollout."
                    : "Localized category landing pages must stay descriptive and metadata-complete.",
                content: (
                  <div className="grid gap-5 lg:grid-cols-2">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor={`name_${locale}`}>Name</Label>
                        <Input
                          id={`name_${locale}`}
                          name={`name_${locale}`}
                          defaultValue={translation.name ?? ""}
                        />
                      </div>
                      <div>
                        <Label htmlFor={`slugSegment_${locale}`}>Slug segment</Label>
                        <Input
                          id={`slugSegment_${locale}`}
                          name={`slugSegment_${locale}`}
                          defaultValue={translation.slugSegment ?? ""}
                        />
                      </div>
                      <div>
                        <Label htmlFor={`shortDescription_${locale}`}>
                          Short description
                        </Label>
                        <Textarea
                          id={`shortDescription_${locale}`}
                          name={`shortDescription_${locale}`}
                          defaultValue={translation.shortDescription ?? ""}
                          className="min-h-28"
                        />
                      </div>
                      <div>
                        <Label htmlFor={`translationStatus_${locale}`}>
                          Translation status
                        </Label>
                        <select
                          id={`translationStatus_${locale}`}
                          name={`translationStatus_${locale}`}
                          defaultValue={translation.publishStatus}
                          className={selectClassName}
                        >
                          <option value="draft">Draft</option>
                          <option value="review">Review</option>
                          <option value="published">Published</option>
                          <option value="archived">Archived</option>
                        </select>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor={`seoTitle_${locale}`}>SEO title</Label>
                        <Input
                          id={`seoTitle_${locale}`}
                          name={`seoTitle_${locale}`}
                          defaultValue={translation.seoTitle ?? ""}
                        />
                      </div>
                      <div>
                        <Label htmlFor={`seoDescription_${locale}`}>
                          SEO description
                        </Label>
                        <Textarea
                          id={`seoDescription_${locale}`}
                          name={`seoDescription_${locale}`}
                          defaultValue={translation.seoDescription ?? ""}
                          className="min-h-28"
                        />
                      </div>
                      <div>
                        <Label htmlFor={`body_${locale}`}>Body</Label>
                        <Textarea
                          id={`body_${locale}`}
                          name={`body_${locale}`}
                          defaultValue={translation.body ?? ""}
                          className="min-h-48"
                        />
                      </div>
                    </div>
                    {issues.length > 0 ? (
                      <div className="lg:col-span-2 rounded-3xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
                        <p className="font-semibold">Publish blockers</p>
                        <ul className="mt-2 list-disc space-y-1 pl-5">
                          {issues.map((issue) => (
                            <li key={issue}>{issue}</li>
                          ))}
                        </ul>
                      </div>
                    ) : null}
                  </div>
                ),
              };
            })}
          />
        </AdminSectionCard>

        <div className="flex flex-wrap gap-3">
          <Button type="submit">Save category</Button>
          <Button asChild variant="secondary">
            <Link href="/admin/categories">Cancel</Link>
          </Button>
        </div>
      </form>
    </div>
  );
}
