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
import { getManufacturerPublicationIssues } from "@/lib/domain/publication";
import { appLocales } from "@/lib/i18n/config";
import { getLocaleLabel } from "@/lib/admin/utils";

import { saveManufacturerAction } from "../actions";

const selectClassName =
  "focus-ring flex h-11 w-full rounded-2xl border border-line bg-white px-4 py-2 text-sm shadow-sm outline-none";

type AdminManufacturerDetailProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string; saved?: string }>;
};

export default async function AdminManufacturerDetail({
  params,
  searchParams,
}: AdminManufacturerDetailProps) {
  const [{ id }, query] = await Promise.all([params, searchParams]);
  const manufacturer =
    id === "new"
      ? null
      : await prisma.manufacturer.findUnique({
          where: { id },
          include: { translations: true, products: true },
        });

  if (!manufacturer && id !== "new") {
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
    (manufacturer?.translations ?? []).map((translation) => [
      translation.localeCode,
      translation,
    ]),
  );

  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow="Manufacturers"
        title={manufacturer ? `Edit ${manufacturer.code}` : "Create manufacturer"}
        description="Manufacturer pages need real value: localized summary, body, SEO, and at least one related product before publication."
        action={
          <Button asChild variant="secondary">
            <Link href="/admin/manufacturers">Back to manufacturers</Link>
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
          Manufacturer saved successfully.
        </div>
      ) : null}

      <form action={saveManufacturerAction} className="space-y-6">
        <input type="hidden" name="id" value={manufacturer?.id ?? "new"} />

        <AdminSectionCard
          title="Base configuration"
          description="Base fields define producer identity, imagery, and publication state shared across locales."
        >
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            <div>
              <Label htmlFor="code">Internal code</Label>
              <Input id="code" name="code" defaultValue={manufacturer?.code ?? ""} />
            </div>
            <div>
              <Label htmlFor="originCountry">Origin country</Label>
              <Input
                id="originCountry"
                name="originCountry"
                defaultValue={manufacturer?.originCountry ?? ""}
              />
            </div>
            <div>
              <Label htmlFor="websiteUrl">Website</Label>
              <Input
                id="websiteUrl"
                name="websiteUrl"
                defaultValue={manufacturer?.websiteUrl ?? ""}
              />
            </div>
            <div>
              <Label htmlFor="sortOrder">Sort order</Label>
              <Input
                id="sortOrder"
                name="sortOrder"
                type="number"
                min={0}
                defaultValue={manufacturer?.sortOrder ?? 0}
              />
            </div>
            <div>
              <Label htmlFor="publishStatus">Base publish status</Label>
              <select
                id="publishStatus"
                name="publishStatus"
                defaultValue={manufacturer?.publishStatus ?? "draft"}
                className={selectClassName}
              >
                <option value="draft">Draft</option>
                <option value="review">Review</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            </div>
            <div>
              <Label htmlFor="logoMediaId">Logo image</Label>
              <select
                id="logoMediaId"
                name="logoMediaId"
                defaultValue={manufacturer?.logoMediaId ?? ""}
                className={selectClassName}
              >
                <option value="">No logo media</option>
                {imageMedia.map((media) => (
                  <option key={media.id} value={media.id}>
                    {media.title ?? media.storageKey}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="heroMediaId">Hero image</Label>
              <select
                id="heroMediaId"
                name="heroMediaId"
                defaultValue={manufacturer?.heroMediaId ?? ""}
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
                defaultChecked={manufacturer?.isFeatured ?? false}
                className="h-4 w-4 accent-[var(--brand)]"
              />
              Featured manufacturer
            </label>
          </div>
        </AdminSectionCard>

        <AdminSectionCard
          title="Locale content"
          description="Each locale owns its own slug and manufacturer profile. Persian remains internal-only until a future launch."
        >
          <LocaleTabs
            tabs={appLocales.map((locale) => {
              const translation = translationLookup.get(locale) ?? {
                localeCode: locale,
                name: "",
                slug: "",
                summary: "",
                body: "",
                seoTitle: "",
                seoDescription: "",
                certificationsText: "",
                publishStatus: locale === "fa" ? "review" : "draft",
              };

              const issues =
                translation.publishStatus === "published"
                  ? getManufacturerPublicationIssues({
                      baseStatus: manufacturer?.publishStatus ?? "draft",
                      translationStatus: translation.publishStatus,
                      localeVisibility:
                        localeVisibility.get(locale) ?? "internal_only",
                      isComplete: true,
                      slug: translation.slug,
                      summary: translation.summary,
                      body: translation.body,
                      seoTitle: translation.seoTitle,
                      seoDescription: translation.seoDescription,
                      hasPublishedProducts: (manufacturer?.products.length ?? 0) > 0,
                    })
                  : [];

              return {
                code: locale,
                label: `${locale.toUpperCase()} · ${getLocaleLabel(locale)}`,
                description:
                  locale === "fa"
                    ? "Editable only for the future Persian rollout."
                    : "Public manufacturer profiles should not be thin or metadata-incomplete.",
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
                        <Label htmlFor={`certificationsText_${locale}`}>
                          Certifications
                        </Label>
                        <Input
                          id={`certificationsText_${locale}`}
                          name={`certificationsText_${locale}`}
                          defaultValue={translation.certificationsText ?? ""}
                        />
                      </div>
                      <div>
                        <Label htmlFor={`body_${locale}`}>Body</Label>
                        <Textarea
                          id={`body_${locale}`}
                          name={`body_${locale}`}
                          defaultValue={translation.body ?? ""}
                          className="min-h-44"
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
          <Button type="submit">Save manufacturer</Button>
          <Button asChild variant="secondary">
            <Link href="/admin/manufacturers">Cancel</Link>
          </Button>
        </div>
      </form>
    </div>
  );
}
