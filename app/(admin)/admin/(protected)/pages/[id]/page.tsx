import Link from "next/link";
import { notFound } from "next/navigation";

import { AdminPageHeader } from "@/components/admin/page-header";
import { LocaleTabs } from "@/components/admin/locale-tabs";
import { AdminSectionCard } from "@/components/admin/section-card";
import { AdminStatusBadge } from "@/components/admin/status-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { prisma } from "@/lib/db";
import { getPagePublicationIssues } from "@/lib/domain/publication";
import { appLocales } from "@/lib/i18n/config";
import { getLocaleLabel } from "@/lib/admin/utils";

import { savePageAction } from "../actions";

const selectClassName =
  "focus-ring flex h-11 w-full rounded-2xl border border-line bg-white px-4 py-2 text-sm shadow-sm outline-none";

const pageKeyOptions = [
  "home",
  "about",
  "products_index",
  "categories_index",
  "manufacturers_index",
  "contact",
  "privacy",
  "legal",
] as const;

type AdminPageDetailProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string; saved?: string }>;
};

export default async function AdminPageDetail({
  params,
  searchParams,
}: AdminPageDetailProps) {
  const [{ id }, query] = await Promise.all([params, searchParams]);
  const page =
    id === "new"
      ? null
      : await prisma.page.findUnique({
          where: { id },
          include: { translations: true },
        });

  if (!page && id !== "new") {
    notFound();
  }

  const [locales, imageMedia] = await Promise.all([
    prisma.locale.findMany({
      orderBy: { sortOrder: "asc" },
      select: { code: true, visibilityStatus: true },
    }),
    prisma.media.findMany({
      where: { kind: "image" },
      orderBy: { title: "asc" },
      select: { id: true, title: true, storageKey: true },
    }),
  ]);

  const localeVisibility = new Map(
    locales.map((locale) => [locale.code, locale.visibilityStatus]),
  );
  const translationLookup = new Map(
    (page?.translations ?? []).map((translation) => [translation.localeCode, translation]),
  );

  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow="Pages"
        title={page ? `Edit ${page.pageKey}` : "Create page"}
        description="Structured pages stay on reserved keys, localized content, and SEO fields. Publish gating only passes complete public locales."
        action={
          <Button asChild variant="secondary">
            <Link href="/admin/pages">Back to pages</Link>
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
          Page saved successfully.
        </div>
      ) : null}

      <form action={savePageAction} className="space-y-6">
        <input type="hidden" name="id" value={page?.id ?? "new"} />

        <AdminSectionCard
          title="Base configuration"
          description="Base state controls system identity. Translation state controls what can actually go public."
        >
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            <div>
              <Label htmlFor="pageKey">Page key</Label>
              <select
                id="pageKey"
                name="pageKey"
                defaultValue={page?.pageKey ?? "privacy"}
                className={selectClassName}
              >
                {pageKeyOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="publishStatus">Base publish status</Label>
              <select
                id="publishStatus"
                name="publishStatus"
                defaultValue={page?.publishStatus ?? "draft"}
                className={selectClassName}
              >
                <option value="draft">Draft</option>
                <option value="review">Review</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            </div>
            <div>
              <Label htmlFor="templateVariant">Template variant</Label>
              <Input
                id="templateVariant"
                name="templateVariant"
                defaultValue={page?.templateVariant ?? ""}
                placeholder="default"
              />
            </div>
            <div>
              <Label htmlFor="navigationGroup">Navigation group</Label>
              <Input
                id="navigationGroup"
                name="navigationGroup"
                defaultValue={page?.navigationGroup ?? ""}
                placeholder="company"
              />
            </div>
            <div>
              <Label htmlFor="heroMediaId">Hero image</Label>
              <select
                id="heroMediaId"
                name="heroMediaId"
                defaultValue={page?.heroMediaId ?? ""}
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
                name="showInNavigation"
                defaultChecked={page?.showInNavigation ?? false}
                className="h-4 w-4 accent-[var(--brand)]"
              />
              Show in navigation
            </label>
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold text-muted">Current status</span>
              <AdminStatusBadge
                kind="publish"
                status={page?.publishStatus ?? "draft"}
              />
            </div>
          </div>
        </AdminSectionCard>

        <AdminSectionCard
          title="Locale content"
          description="Each locale owns its own title, slug, structured content, and metadata. Persian can be edited but not published publicly."
        >
          <LocaleTabs
            tabs={appLocales.map((locale) => {
              const translation = translationLookup.get(locale) ?? {
                localeCode: locale,
                title: "",
                slug: "",
                summary: "",
                contentBlocksJson: JSON.stringify([{ type: "intro" }], null, 2),
                heroHeading: "",
                seoTitle: "",
                seoDescription: "",
                ogTitle: "",
                ogDescription: "",
                publishStatus: locale === "fa" ? "review" : "draft",
              };

              const parsedBlocks =
                typeof translation.contentBlocksJson === "string" &&
                translation.contentBlocksJson.trim().startsWith("[");
              const issues =
                translation.publishStatus === "published"
                  ? getPagePublicationIssues({
                      baseStatus: page?.publishStatus ?? "draft",
                      translationStatus: translation.publishStatus,
                      localeVisibility:
                        localeVisibility.get(locale) ?? "internal_only",
                      isComplete: true,
                      title: translation.title,
                      slugRequired: (page?.pageKey ?? "privacy") !== "home",
                      slug: translation.slug,
                      hasRequiredSections:
                        parsedBlocks && translation.contentBlocksJson !== "[]",
                      seoTitle: translation.seoTitle,
                      seoDescription: translation.seoDescription,
                    })
                  : [];

              return {
                code: locale,
                label: `${locale.toUpperCase()} · ${getLocaleLabel(locale)}`,
                description:
                  locale === "fa"
                    ? "Editable for future rollout only. Do not set Persian public in MVP."
                    : "Public locale. Missing SEO or structured content blocks publication.",
                content: (
                  <div className="grid gap-5 lg:grid-cols-2">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor={`title_${locale}`}>Title</Label>
                        <Input
                          id={`title_${locale}`}
                          name={`title_${locale}`}
                          defaultValue={translation.title ?? ""}
                        />
                      </div>
                      <div>
                        <Label htmlFor={`slug_${locale}`}>Slug</Label>
                        <Input
                          id={`slug_${locale}`}
                          name={`slug_${locale}`}
                          defaultValue={translation.slug ?? ""}
                        />
                      </div>
                      <div>
                        <Label htmlFor={`summary_${locale}`}>Summary</Label>
                        <Textarea
                          id={`summary_${locale}`}
                          name={`summary_${locale}`}
                          defaultValue={translation.summary ?? ""}
                          className="min-h-28"
                        />
                      </div>
                      <div>
                        <Label htmlFor={`heroHeading_${locale}`}>Hero heading</Label>
                        <Input
                          id={`heroHeading_${locale}`}
                          name={`heroHeading_${locale}`}
                          defaultValue={translation.heroHeading ?? ""}
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
                        <Label htmlFor={`ogTitle_${locale}`}>OG title</Label>
                        <Input
                          id={`ogTitle_${locale}`}
                          name={`ogTitle_${locale}`}
                          defaultValue={translation.ogTitle ?? ""}
                        />
                      </div>
                      <div>
                        <Label htmlFor={`ogDescription_${locale}`}>
                          OG description
                        </Label>
                        <Textarea
                          id={`ogDescription_${locale}`}
                          name={`ogDescription_${locale}`}
                          defaultValue={translation.ogDescription ?? ""}
                          className="min-h-24"
                        />
                      </div>
                    </div>
                    <div className="lg:col-span-2">
                      <Label htmlFor={`contentBlocksJson_${locale}`}>
                        Structured content blocks JSON
                      </Label>
                      <Textarea
                        id={`contentBlocksJson_${locale}`}
                        name={`contentBlocksJson_${locale}`}
                        defaultValue={translation.contentBlocksJson ?? "[]"}
                        className="min-h-52 font-mono text-xs"
                      />
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
          <Button type="submit">Save page</Button>
          <Button asChild variant="secondary">
            <Link href="/admin/pages">Cancel</Link>
          </Button>
        </div>
      </form>
    </div>
  );
}
