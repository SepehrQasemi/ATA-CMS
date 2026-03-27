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
import { hasPricingFallback } from "@/lib/domain/pricing";
import { getProductPublicationIssues } from "@/lib/domain/publication";
import { appLocales } from "@/lib/i18n/config";
import { getLocaleLabel } from "@/lib/admin/utils";

import { saveProductAction } from "../actions";

const selectClassName =
  "focus-ring flex h-11 w-full rounded-2xl border border-line bg-white px-4 py-2 text-sm shadow-sm outline-none";

type AdminProductDetailProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string; saved?: string }>;
};

export default async function AdminProductDetail({
  params,
  searchParams,
}: AdminProductDetailProps) {
  const [{ id }, query] = await Promise.all([params, searchParams]);
  const product =
    id === "new"
      ? null
      : await prisma.product.findUnique({
          where: { id },
          include: {
            translations: true,
            images: true,
            specs: true,
            documents: {
              include: { translations: true },
              orderBy: { sortOrder: "asc" },
            },
          },
        });

  if (!product && id !== "new") {
    notFound();
  }

  const [
    categories,
    manufacturers,
    imageMedia,
    documentMedia,
    locales,
    settingsTranslations,
  ] = await Promise.all([
    prisma.category.findMany({ orderBy: { code: "asc" }, select: { id: true, code: true } }),
    prisma.manufacturer.findMany({
      orderBy: { code: "asc" },
      select: { id: true, code: true },
    }),
    prisma.media.findMany({
      where: { kind: "image" },
      orderBy: { title: "asc" },
      select: { id: true, title: true, storageKey: true },
    }),
    prisma.media.findMany({
      where: { kind: "document" },
      orderBy: { title: "asc" },
      select: { id: true, title: true, storageKey: true },
    }),
    prisma.locale.findMany({
      orderBy: { sortOrder: "asc" },
      select: { code: true, visibilityStatus: true },
    }),
    prisma.siteSettingTranslation.findMany({
      select: { localeCode: true, defaultContactForPricingMessage: true },
    }),
  ]);

  const localeVisibility = new Map(
    locales.map((locale) => [locale.code, locale.visibilityStatus]),
  );
  const sitePricingFallback = new Map(
    settingsTranslations.map((translation) => [
      translation.localeCode,
      translation.defaultContactForPricingMessage,
    ]),
  );
  const translationLookup = new Map(
    (product?.translations ?? []).map((translation) => [translation.localeCode, translation]),
  );
  const specText = new Map(
    appLocales.map((locale) => [
      locale,
      (product?.specs ?? [])
        .filter((spec) => spec.localeCode === locale)
        .sort((left, right) => left.sortOrder - right.sortOrder)
        .map(
          (spec) =>
            `${spec.label}|${spec.value}|${spec.unit ?? ""}|${spec.isHighlight ? "true" : "false"}`,
        )
        .join("\n"),
    ]),
  );
  const documentSlots = Array.from({ length: 3 }, (_, index) => {
    const document = product?.documents[index];
    const translationsByLocale = new Map(
      (document?.translations ?? []).map((translation) => [
        translation.localeCode,
        translation,
      ]),
    );

    return {
      mediaId: document?.mediaId ?? "",
      documentType: document?.documentType ?? "datasheet",
      isPublic: document?.isPublic ?? false,
      internalNotes: document?.internalNotes ?? "",
      translations: appLocales.map((locale) => ({
        localeCode: locale,
        label: translationsByLocale.get(locale)?.label ?? "",
        description: translationsByLocale.get(locale)?.description ?? "",
        publishStatus:
          translationsByLocale.get(locale)?.publishStatus ??
          (locale === "fa" ? "review" : "draft"),
      })),
    };
  });

  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow="Products"
        title={product ? `Edit ${product.sku ?? product.id}` : "Create product"}
        description="Products carry the strictest publication rules: relations, images, metadata, availability, and pricing fallback all need to stay consistent."
        action={
          <Button asChild variant="secondary">
            <Link href="/admin/products">Back to products</Link>
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
          Product saved successfully.
        </div>
      ) : null}

      <form action={saveProductAction} className="space-y-6">
        <input type="hidden" name="id" value={product?.id ?? "new"} />

        <AdminSectionCard
          title="Base configuration"
          description="Core product truth lives here: taxonomy, manufacturer, availability, pricing posture, and shared media."
        >
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            <div>
              <Label htmlFor="sku">SKU</Label>
              <Input id="sku" name="sku" defaultValue={product?.sku ?? ""} />
            </div>
            <div>
              <Label htmlFor="categoryId">Category</Label>
              <select
                id="categoryId"
                name="categoryId"
                defaultValue={product?.categoryId ?? ""}
                className={selectClassName}
              >
                <option value="">Select category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.code}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="manufacturerId">Manufacturer</Label>
              <select
                id="manufacturerId"
                name="manufacturerId"
                defaultValue={product?.manufacturerId ?? ""}
                className={selectClassName}
              >
                <option value="">Select manufacturer</option>
                {manufacturers.map((manufacturer) => (
                  <option key={manufacturer.id} value={manufacturer.id}>
                    {manufacturer.code}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="availabilityStatus">Availability</Label>
              <select
                id="availabilityStatus"
                name="availabilityStatus"
                defaultValue={product?.availabilityStatus ?? "in_stock"}
                className={selectClassName}
              >
                <option value="in_stock">In stock</option>
                <option value="available_on_request">Available on request</option>
                <option value="out_of_stock">Out of stock</option>
                <option value="discontinued">Discontinued</option>
              </select>
            </div>
            <div>
              <Label htmlFor="publicPriceAmount">Public price amount</Label>
              <Input
                id="publicPriceAmount"
                name="publicPriceAmount"
                type="number"
                step="0.01"
                min={0}
                defaultValue={product?.publicPriceAmount?.toString() ?? ""}
              />
            </div>
            <div>
              <Label htmlFor="publicPriceCurrency">Currency</Label>
              <Input
                id="publicPriceCurrency"
                name="publicPriceCurrency"
                defaultValue={product?.publicPriceCurrency ?? ""}
                placeholder="USD"
              />
            </div>
            <div>
              <Label htmlFor="publicPriceUnitLabel">Unit label</Label>
              <Input
                id="publicPriceUnitLabel"
                name="publicPriceUnitLabel"
                defaultValue={product?.publicPriceUnitLabel ?? ""}
                placeholder="kg"
              />
            </div>
            <div>
              <Label htmlFor="priceLastVerifiedAt">Price verified</Label>
              <Input
                id="priceLastVerifiedAt"
                name="priceLastVerifiedAt"
                type="date"
                defaultValue={
                  product?.priceLastVerifiedAt
                    ? product.priceLastVerifiedAt.toISOString().slice(0, 10)
                    : ""
                }
              />
            </div>
            <div>
              <Label htmlFor="sortOrder">Sort order</Label>
              <Input
                id="sortOrder"
                name="sortOrder"
                type="number"
                min={0}
                defaultValue={product?.sortOrder ?? 0}
              />
            </div>
            <div>
              <Label htmlFor="publishStatus">Base publish status</Label>
              <select
                id="publishStatus"
                name="publishStatus"
                defaultValue={product?.publishStatus ?? "draft"}
                className={selectClassName}
              >
                <option value="draft">Draft</option>
                <option value="review">Review</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            </div>
            <label className="flex items-center gap-3 rounded-2xl border border-line bg-white px-4 py-3 text-sm font-semibold">
              <input
                type="checkbox"
                name="isFeatured"
                defaultChecked={product?.isFeatured ?? false}
                className="h-4 w-4 accent-[var(--brand)]"
              />
              Featured product
            </label>
            <div className="md:col-span-2 xl:col-span-4">
              <Label htmlFor="internalNotes">Internal notes</Label>
              <Textarea
                id="internalNotes"
                name="internalNotes"
                defaultValue={product?.internalNotes ?? ""}
                className="min-h-28"
              />
            </div>
          </div>
        </AdminSectionCard>

        <AdminSectionCard
          title="Images"
          description="Select one or more images, then set the primary image used by the public detail page."
        >
          <div className="grid gap-5 lg:grid-cols-2">
            <div>
              <Label htmlFor="imageIds">Attached images</Label>
              <select
                id="imageIds"
                name="imageIds"
                multiple
                defaultValue={product?.images.map((image) => image.mediaId) ?? []}
                className="focus-ring min-h-56 w-full rounded-3xl border border-line bg-white px-4 py-3 text-sm shadow-sm outline-none"
              >
                {imageMedia.map((media) => (
                  <option key={media.id} value={media.id}>
                    {media.title ?? media.storageKey}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-4">
              <div>
                <Label htmlFor="primaryImageMediaId">Primary image</Label>
                <select
                  id="primaryImageMediaId"
                  name="primaryImageMediaId"
                  defaultValue={product?.primaryImageMediaId ?? ""}
                  className={selectClassName}
                >
                  <option value="">Use first attached image</option>
                  {imageMedia.map((media) => (
                    <option key={media.id} value={media.id}>
                      {media.title ?? media.storageKey}
                    </option>
                  ))}
                </select>
              </div>
              <p className="text-sm leading-6 text-muted">
                Hold Ctrl or Cmd to select multiple images. Publication requires at
                least one image.
              </p>
            </div>
          </div>
        </AdminSectionCard>

        <AdminSectionCard
          title="Locale content"
          description="Each locale owns its own slug, descriptions, and pricing fallback message. Persian stays editable but non-public."
        >
          <LocaleTabs
            tabs={appLocales.map((locale) => {
              const translation = translationLookup.get(locale) ?? {
                localeCode: locale,
                name: "",
                slug: "",
                shortDescription: "",
                longDescription: "",
                availabilityNote: "",
                contactForPricingMessage: "",
                seoTitle: "",
                seoDescription: "",
                metaKeywords: "",
                publishStatus: locale === "fa" ? "review" : "draft",
              };

              const issues =
                translation.publishStatus === "published"
                  ? getProductPublicationIssues({
                      baseStatus: product?.publishStatus ?? "draft",
                      translationStatus: translation.publishStatus,
                      localeVisibility:
                        localeVisibility.get(locale) ?? "internal_only",
                      isComplete: true,
                      hasCategory: Boolean(product?.categoryId ?? true),
                      hasManufacturer: Boolean(product?.manufacturerId ?? true),
                      hasImage: (product?.images.length ?? 0) > 0,
                      hasPricingFallback: hasPricingFallback({
                        locale,
                        amount: product?.publicPriceAmount
                          ? Number(product.publicPriceAmount)
                          : null,
                        currency: product?.publicPriceCurrency ?? null,
                        unitLabel: product?.publicPriceUnitLabel ?? null,
                        message:
                          translation.contactForPricingMessage ??
                          sitePricingFallback.get(locale) ??
                          null,
                      }),
                      slug: translation.slug,
                      summary: translation.shortDescription,
                      seoTitle: translation.seoTitle,
                      seoDescription: translation.seoDescription,
                    })
                  : [];

              return {
                code: locale,
                label: `${locale.toUpperCase()} · ${getLocaleLabel(locale)}`,
                description:
                  locale === "fa"
                    ? "Editable only for the future Persian rollout."
                    : "Public locales need complete metadata, an image, and either a public price or a contact fallback.",
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
                        <Label htmlFor={`availabilityNote_${locale}`}>
                          Availability note
                        </Label>
                        <Textarea
                          id={`availabilityNote_${locale}`}
                          name={`availabilityNote_${locale}`}
                          defaultValue={translation.availabilityNote ?? ""}
                          className="min-h-24"
                        />
                      </div>
                      <div>
                        <Label htmlFor={`contactForPricingMessage_${locale}`}>
                          Contact-for-pricing message
                        </Label>
                        <Textarea
                          id={`contactForPricingMessage_${locale}`}
                          name={`contactForPricingMessage_${locale}`}
                          defaultValue={translation.contactForPricingMessage ?? ""}
                          className="min-h-24"
                        />
                      </div>
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
                          className="min-h-24"
                        />
                      </div>
                      <div>
                        <Label htmlFor={`metaKeywords_${locale}`}>Meta keywords</Label>
                        <Input
                          id={`metaKeywords_${locale}`}
                          name={`metaKeywords_${locale}`}
                          defaultValue={translation.metaKeywords ?? ""}
                        />
                      </div>
                    </div>
                    <div className="lg:col-span-2">
                      <Label htmlFor={`longDescription_${locale}`}>Long description</Label>
                      <Textarea
                        id={`longDescription_${locale}`}
                        name={`longDescription_${locale}`}
                        defaultValue={translation.longDescription ?? ""}
                        className="min-h-56"
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

        <AdminSectionCard
          title="Specifications"
          description="One spec per line using the format label|value|unit|highlight. Use true or false for the highlight flag."
        >
          <div className="grid gap-5 lg:grid-cols-3">
            {appLocales.map((locale) => (
              <div key={locale}>
                <Label htmlFor={`specs_${locale}`}>
                  {locale.toUpperCase()} specifications
                </Label>
                <Textarea
                  id={`specs_${locale}`}
                  name={`specs_${locale}`}
                  defaultValue={specText.get(locale) ?? ""}
                  className="min-h-56 font-mono text-xs"
                />
              </div>
            ))}
          </div>
        </AdminSectionCard>

        <AdminSectionCard
          title="Product documents"
          description="Attach up to three document rows in the MVP foundation. Public documents need localized labels for every published locale."
        >
          <div className="grid gap-5 xl:grid-cols-3">
            {documentSlots.map((slot, index) => (
              <div
                key={`document-slot-${index}`}
                className="space-y-4 rounded-3xl border border-line bg-white p-4"
              >
                <p className="text-sm font-semibold">Document slot {index + 1}</p>
                <div>
                  <Label htmlFor={`documentMediaId_${index}`}>Document media</Label>
                  <select
                    id={`documentMediaId_${index}`}
                    name={`documentMediaId_${index}`}
                    defaultValue={slot.mediaId}
                    className={selectClassName}
                  >
                    <option value="">No document</option>
                    {documentMedia.map((media) => (
                      <option key={media.id} value={media.id}>
                        {media.title ?? media.storageKey}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label htmlFor={`documentType_${index}`}>Document type</Label>
                  <select
                    id={`documentType_${index}`}
                    name={`documentType_${index}`}
                    defaultValue={slot.documentType}
                    className={selectClassName}
                  >
                    <option value="datasheet">Datasheet</option>
                    <option value="catalog">Catalog</option>
                    <option value="certificate">Certificate</option>
                    <option value="brochure">Brochure</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <label className="flex items-center gap-3 rounded-2xl border border-line bg-[#fff8f8] px-4 py-3 text-sm font-semibold">
                  <input
                    type="checkbox"
                    name={`documentPublic_${index}`}
                    defaultChecked={slot.isPublic}
                    className="h-4 w-4 accent-[var(--brand)]"
                  />
                  Public document
                </label>
                <div>
                  <Label htmlFor={`documentInternalNotes_${index}`}>
                    Internal notes
                  </Label>
                  <Textarea
                    id={`documentInternalNotes_${index}`}
                    name={`documentInternalNotes_${index}`}
                    defaultValue={slot.internalNotes}
                    className="min-h-24"
                  />
                </div>
                {slot.translations.map((translation) => (
                  <div
                    key={`${index}-${translation.localeCode}`}
                    className="space-y-3 rounded-2xl border border-line/70 bg-[#fffafa] p-3"
                  >
                    <p className="text-xs font-semibold uppercase tracking-[0.08em] text-muted">
                      {translation.localeCode}
                    </p>
                    <Input
                      name={`documentLabel_${index}_${translation.localeCode}`}
                      defaultValue={translation.label}
                      placeholder="Label"
                    />
                    <Textarea
                      name={`documentDescription_${index}_${translation.localeCode}`}
                      defaultValue={translation.description}
                      placeholder="Description"
                      className="min-h-20"
                    />
                    <select
                      name={`documentStatus_${index}_${translation.localeCode}`}
                      defaultValue={translation.publishStatus}
                      className={selectClassName}
                    >
                      <option value="draft">Draft</option>
                      <option value="review">Review</option>
                      <option value="published">Published</option>
                      <option value="archived">Archived</option>
                    </select>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </AdminSectionCard>

        <div className="flex flex-wrap gap-3">
          <Button type="submit">Save product</Button>
          <Button asChild variant="secondary">
            <Link href="/admin/products">Cancel</Link>
          </Button>
        </div>
      </form>
    </div>
  );
}
