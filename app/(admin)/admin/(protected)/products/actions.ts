"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { prisma } from "@/lib/db";
import { hasPricingFallback } from "@/lib/domain/pricing";
import { getProductPublicationIssues } from "@/lib/domain/publication";
import { appLocales } from "@/lib/i18n/config";
import {
  toBoolean,
  toInteger,
  toNullableDateString,
  toNullableNumber,
  toNullableString,
  toRequiredString,
} from "@/lib/admin/utils";
import { productFormSchema } from "@/lib/validation/cms";

function getRedirectTarget(id: string | null, search: string) {
  return id && id !== "new"
    ? `/admin/products/${id}${search}`
    : `/admin/products/new${search}`;
}

function parseSpecRows(localeCode: (typeof appLocales)[number], rawValue: string) {
  return rawValue
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line, index) => {
      const [label = "", value = "", unit = "", highlight = "false"] = line
        .split("|")
        .map((item) => item.trim());

      return {
        localeCode,
        label,
        value,
        unit: unit || null,
        sortOrder: index,
        isHighlight: highlight === "true",
      };
    });
}

export async function saveProductAction(formData: FormData) {
  const id = toNullableString(formData.get("id"));
  const imageIds = formData
    .getAll("imageIds")
    .map((value) => (typeof value === "string" ? value.trim() : ""))
    .filter(Boolean);

  const documentSlots = [0, 1, 2]
    .map((index) => {
      const mediaId = toNullableString(formData.get(`documentMediaId_${index}`));

      if (!mediaId) {
        return null;
      }

      return {
        mediaId,
        documentType: toRequiredString(formData.get(`documentType_${index}`)),
        isPublic: toBoolean(formData.get(`documentPublic_${index}`)),
        sortOrder: index,
        internalNotes: toNullableString(formData.get(`documentInternalNotes_${index}`)),
        translations: appLocales.map((locale) => ({
          localeCode: locale,
          label: toNullableString(formData.get(`documentLabel_${index}_${locale}`)),
          description: toNullableString(
            formData.get(`documentDescription_${index}_${locale}`),
          ),
          publishStatus: toRequiredString(
            formData.get(`documentStatus_${index}_${locale}`),
          ),
        })),
      };
    })
    .filter(Boolean);

  const rawInput = {
    id,
    sku: toNullableString(formData.get("sku")),
    categoryId: toRequiredString(formData.get("categoryId")),
    manufacturerId: toRequiredString(formData.get("manufacturerId")),
    availabilityStatus: toRequiredString(formData.get("availabilityStatus")),
    publicPriceAmount: toNullableNumber(formData.get("publicPriceAmount")),
    publicPriceCurrency: toNullableString(formData.get("publicPriceCurrency")),
    publicPriceUnitLabel: toNullableString(formData.get("publicPriceUnitLabel")),
    priceLastVerifiedAt: toNullableDateString(formData.get("priceLastVerifiedAt")),
    isFeatured: toBoolean(formData.get("isFeatured")),
    primaryImageMediaId:
      toNullableString(formData.get("primaryImageMediaId")) ?? imageIds[0] ?? null,
    publishStatus: toRequiredString(formData.get("publishStatus")),
    sortOrder: toInteger(formData.get("sortOrder")),
    internalNotes: toNullableString(formData.get("internalNotes")),
    translations: appLocales.map((locale) => ({
      localeCode: locale,
      name: toRequiredString(formData.get(`name_${locale}`)),
      slug: toRequiredString(formData.get(`slug_${locale}`)),
      shortDescription: toRequiredString(formData.get(`shortDescription_${locale}`)),
      longDescription: toNullableString(formData.get(`longDescription_${locale}`)),
      availabilityNote: toNullableString(formData.get(`availabilityNote_${locale}`)),
      contactForPricingMessage: toNullableString(
        formData.get(`contactForPricingMessage_${locale}`),
      ),
      seoTitle: toNullableString(formData.get(`seoTitle_${locale}`)),
      seoDescription: toNullableString(formData.get(`seoDescription_${locale}`)),
      metaKeywords: toNullableString(formData.get(`metaKeywords_${locale}`)),
      publishStatus: toRequiredString(formData.get(`translationStatus_${locale}`)),
    })),
    images: imageIds.map((mediaId, index) => ({
      mediaId,
      sortOrder: index,
      isPrimary:
        (toNullableString(formData.get("primaryImageMediaId")) ?? imageIds[0] ?? null) ===
        mediaId,
      altHint: null,
    })),
    specs: appLocales.flatMap((locale) =>
      parseSpecRows(locale, toRequiredString(formData.get(`specs_${locale}`))),
    ),
    documents: documentSlots,
  };

  const parsed = productFormSchema.safeParse(rawInput);

  if (!parsed.success) {
    const issue = parsed.error.issues[0]?.message ?? "Product validation failed.";
    redirect(getRedirectTarget(id, `?error=${encodeURIComponent(issue)}`));
  }

  if (parsed.data.publicPriceAmount !== null && !parsed.data.publicPriceCurrency) {
    redirect(
      getRedirectTarget(
        id,
        `?error=${encodeURIComponent("Currency is required when a public price is set.")}`,
      ),
    );
  }

  const localeVisibility = new Map(
    (
      await prisma.locale.findMany({
        select: { code: true, visibilityStatus: true },
      })
    ).map((locale) => [locale.code, locale.visibilityStatus]),
  );

  const settings = await prisma.siteSettings.findFirst({
    include: { translations: true },
  });
  const settingMessages = new Map(
    (settings?.translations ?? []).map((translation) => [
      translation.localeCode,
      translation.defaultContactForPricingMessage,
    ]),
  );

  const translationRows = [];

  for (const translation of parsed.data.translations) {
    if (translation.localeCode === "fa" && translation.publishStatus === "published") {
      redirect(
        getRedirectTarget(
          id,
          `?error=${encodeURIComponent("Persian cannot be published publicly in MVP.")}`,
        ),
      );
    }

    const duplicateWhere = {
      localeCode: translation.localeCode,
      slug: translation.slug,
      ...(parsed.data.id && parsed.data.id !== "new"
        ? { NOT: { productId: parsed.data.id } }
        : {}),
    };

    const duplicate = await prisma.productTranslation.findFirst({
      where: duplicateWhere,
      select: { id: true },
    });

    if (duplicate) {
      redirect(
        getRedirectTarget(
          id,
          `?error=${encodeURIComponent(
            `${translation.localeCode.toUpperCase()} slug must be unique.`,
          )}`,
        ),
      );
    }

    const issues =
      translation.publishStatus === "published"
        ? getProductPublicationIssues({
            baseStatus: parsed.data.publishStatus,
            translationStatus: translation.publishStatus,
            localeVisibility:
              localeVisibility.get(translation.localeCode) ?? "internal_only",
            isComplete: true,
            hasCategory: Boolean(parsed.data.categoryId),
            hasManufacturer: Boolean(parsed.data.manufacturerId),
            hasImage: parsed.data.images.length > 0,
            hasPricingFallback: hasPricingFallback({
              locale: translation.localeCode,
              amount: parsed.data.publicPriceAmount,
              currency: parsed.data.publicPriceCurrency,
              unitLabel: parsed.data.publicPriceUnitLabel,
              message:
                translation.contactForPricingMessage ??
                settingMessages.get(translation.localeCode) ??
                null,
            }),
            slug: translation.slug,
            summary: translation.shortDescription,
            seoTitle: translation.seoTitle,
            seoDescription: translation.seoDescription,
          })
        : [];

    if (issues.length > 0) {
      redirect(
        getRedirectTarget(
          id,
          `?error=${encodeURIComponent(
            `${translation.localeCode.toUpperCase()}: ${issues.join(" ")}`,
          )}`,
        ),
      );
    }

    translationRows.push(translation);
  }

  for (const document of parsed.data.documents) {
    if (
      document.translations.some(
        (translation) => translation.publishStatus === "published" && !translation.label,
      )
    ) {
      redirect(
        getRedirectTarget(
          id,
          `?error=${encodeURIComponent(
            "Public document rows need a localized label for each published locale.",
          )}`,
        ),
      );
    }
  }

  const payload = {
    sku: parsed.data.sku,
    categoryId: parsed.data.categoryId,
    manufacturerId: parsed.data.manufacturerId,
    availabilityStatus: parsed.data.availabilityStatus,
    publicPriceAmount: parsed.data.publicPriceAmount,
    publicPriceCurrency: parsed.data.publicPriceCurrency,
    publicPriceUnitLabel: parsed.data.publicPriceUnitLabel,
    priceLastVerifiedAt: parsed.data.priceLastVerifiedAt,
    isFeatured: parsed.data.isFeatured,
    primaryImageMediaId: parsed.data.primaryImageMediaId,
    publishStatus: parsed.data.publishStatus,
    sortOrder: parsed.data.sortOrder,
    internalNotes: parsed.data.internalNotes,
  };

  const record =
    parsed.data.id && parsed.data.id !== "new"
      ? await prisma.product.update({
          where: { id: parsed.data.id },
          data: {
            ...payload,
            translations: {
              deleteMany: {},
              create: translationRows,
            },
            images: {
              deleteMany: {},
              create: parsed.data.images,
            },
            specs: {
              deleteMany: {},
              create: parsed.data.specs,
            },
          },
        })
      : await prisma.product.create({
          data: {
            ...payload,
            translations: {
              create: translationRows,
            },
            images: {
              create: parsed.data.images,
            },
            specs: {
              create: parsed.data.specs,
            },
          },
        });

  await prisma.productDocument.deleteMany({
    where: { productId: record.id },
  });

  for (const document of parsed.data.documents) {
    await prisma.productDocument.create({
      data: {
        productId: record.id,
        mediaId: document.mediaId,
        documentType: document.documentType,
        isPublic: document.isPublic,
        sortOrder: document.sortOrder,
        internalNotes: document.internalNotes,
        translations: {
          createMany: {
            data: document.translations.map((translation) => ({
              localeCode: translation.localeCode,
              label: translation.label ?? "",
              description: translation.description,
              publishStatus: translation.publishStatus,
            })),
          },
        },
      },
    });
  }

  revalidatePath("/admin");
  revalidatePath("/admin/products");
  revalidatePath(`/admin/products/${record.id}`);
  redirect(`/admin/products/${record.id}?saved=1`);
}
