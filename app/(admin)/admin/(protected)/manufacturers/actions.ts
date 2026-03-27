"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { prisma } from "@/lib/db";
import { getManufacturerPublicationIssues } from "@/lib/domain/publication";
import { appLocales } from "@/lib/i18n/config";
import {
  toBoolean,
  toInteger,
  toNullableString,
  toRequiredString,
} from "@/lib/admin/utils";
import { manufacturerFormSchema } from "@/lib/validation/cms";

function getRedirectTarget(id: string | null, search: string) {
  return id && id !== "new"
    ? `/admin/manufacturers/${id}${search}`
    : `/admin/manufacturers/new${search}`;
}

export async function saveManufacturerAction(formData: FormData) {
  const id = toNullableString(formData.get("id"));

  const rawInput = {
    id,
    code: toRequiredString(formData.get("code")),
    originCountry: toNullableString(formData.get("originCountry")),
    websiteUrl: toNullableString(formData.get("websiteUrl")),
    logoMediaId: toNullableString(formData.get("logoMediaId")),
    heroMediaId: toNullableString(formData.get("heroMediaId")),
    sortOrder: toInteger(formData.get("sortOrder")),
    isFeatured: toBoolean(formData.get("isFeatured")),
    publishStatus: toRequiredString(formData.get("publishStatus")),
    translations: appLocales.map((locale) => ({
      localeCode: locale,
      name: toRequiredString(formData.get(`name_${locale}`)),
      slug: toRequiredString(formData.get(`slug_${locale}`)),
      summary: toNullableString(formData.get(`summary_${locale}`)),
      body: toNullableString(formData.get(`body_${locale}`)),
      seoTitle: toNullableString(formData.get(`seoTitle_${locale}`)),
      seoDescription: toNullableString(formData.get(`seoDescription_${locale}`)),
      certificationsText: toNullableString(formData.get(`certificationsText_${locale}`)),
      publishStatus: toRequiredString(formData.get(`translationStatus_${locale}`)),
    })),
  };

  const parsed = manufacturerFormSchema.safeParse(rawInput);

  if (!parsed.success) {
    const issue =
      parsed.error.issues[0]?.message ?? "Manufacturer validation failed.";
    redirect(getRedirectTarget(id, `?error=${encodeURIComponent(issue)}`));
  }

  const codeConflict = await prisma.manufacturer.findUnique({
    where: { code: parsed.data.code },
    select: { id: true },
  });

  if (codeConflict && codeConflict.id !== parsed.data.id) {
    redirect(
      getRedirectTarget(
        id,
        `?error=${encodeURIComponent("A manufacturer with this code already exists.")}`,
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
        ? { NOT: { manufacturerId: parsed.data.id } }
        : {}),
    };

    const duplicate = await prisma.manufacturerTranslation.findFirst({
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

    const publishedProducts = await prisma.product.count({
      where: {
        manufacturerId:
          parsed.data.id && parsed.data.id !== "new" ? parsed.data.id : "__none__",
        publishStatus: "published",
        translations: {
          some: {
            localeCode: translation.localeCode,
            publishStatus: "published",
          },
        },
      },
    });

    const issues =
      translation.publishStatus === "published"
        ? getManufacturerPublicationIssues({
            baseStatus: parsed.data.publishStatus,
            translationStatus: translation.publishStatus,
            localeVisibility:
              localeVisibility.get(translation.localeCode) ?? "internal_only",
            isComplete: true,
            slug: translation.slug,
            summary: translation.summary,
            body: translation.body,
            seoTitle: translation.seoTitle,
            seoDescription: translation.seoDescription,
            hasPublishedProducts: publishedProducts > 0,
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

  const payload = {
    code: parsed.data.code,
    originCountry: parsed.data.originCountry,
    websiteUrl: parsed.data.websiteUrl,
    logoMediaId: parsed.data.logoMediaId,
    heroMediaId: parsed.data.heroMediaId,
    sortOrder: parsed.data.sortOrder,
    isFeatured: parsed.data.isFeatured,
    publishStatus: parsed.data.publishStatus,
  };

  const record =
    parsed.data.id && parsed.data.id !== "new"
      ? await prisma.manufacturer.update({
          where: { id: parsed.data.id },
          data: {
            ...payload,
            translations: {
              deleteMany: {},
              create: translationRows,
            },
          },
        })
      : await prisma.manufacturer.create({
          data: {
            ...payload,
            translations: {
              create: translationRows,
            },
          },
        });

  revalidatePath("/admin");
  revalidatePath("/admin/manufacturers");
  revalidatePath(`/admin/manufacturers/${record.id}`);
  redirect(`/admin/manufacturers/${record.id}?saved=1`);
}
