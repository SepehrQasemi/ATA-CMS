"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { prisma } from "@/lib/db";
import { wouldCreateCategoryCycle } from "@/lib/domain/category-tree";
import { getCategoryPublicationIssues } from "@/lib/domain/publication";
import { appLocales } from "@/lib/i18n/config";
import {
  toBoolean,
  toInteger,
  toNullableString,
  toRequiredString,
} from "@/lib/admin/utils";
import { categoryFormSchema } from "@/lib/validation/cms";

function getRedirectTarget(id: string | null, search: string) {
  return id && id !== "new"
    ? `/admin/categories/${id}${search}`
    : `/admin/categories/new${search}`;
}

export async function saveCategoryAction(formData: FormData) {
  const id = toNullableString(formData.get("id"));

  const rawInput = {
    id,
    code: toRequiredString(formData.get("code")),
    parentId: toNullableString(formData.get("parentId")),
    sortOrder: toInteger(formData.get("sortOrder")),
    isFeatured: toBoolean(formData.get("isFeatured")),
    heroMediaId: toNullableString(formData.get("heroMediaId")),
    publishStatus: toRequiredString(formData.get("publishStatus")),
    translations: appLocales.map((locale) => ({
      localeCode: locale,
      name: toRequiredString(formData.get(`name_${locale}`)),
      slugSegment: toRequiredString(formData.get(`slugSegment_${locale}`)),
      shortDescription: toNullableString(formData.get(`shortDescription_${locale}`)),
      body: toNullableString(formData.get(`body_${locale}`)),
      seoTitle: toNullableString(formData.get(`seoTitle_${locale}`)),
      seoDescription: toNullableString(formData.get(`seoDescription_${locale}`)),
      publishStatus: toRequiredString(formData.get(`translationStatus_${locale}`)),
    })),
  };

  const parsed = categoryFormSchema.safeParse(rawInput);

  if (!parsed.success) {
    const issue = parsed.error.issues[0]?.message ?? "Category validation failed.";
    redirect(getRedirectTarget(id, `?error=${encodeURIComponent(issue)}`));
  }

  const allCategories = await prisma.category.findMany({
    select: { id: true, parentId: true },
  });

  if (
    parsed.data.parentId &&
    wouldCreateCategoryCycle({
      categoryId: parsed.data.id ?? "new",
      nextParentId: parsed.data.parentId,
      parentLookup: new Map(
        allCategories.map((category) => [category.id, category.parentId]),
      ),
    })
  ) {
    redirect(
      getRedirectTarget(
        id,
        `?error=${encodeURIComponent("This parent assignment would create a cycle.")}`,
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

  const parentTranslations = parsed.data.parentId
    ? await prisma.categoryTranslation.findMany({
        where: { categoryId: parsed.data.parentId },
        select: { localeCode: true, fullSlugPathCache: true },
      })
    : [];
  const parentPathByLocale = new Map(
    parentTranslations.map((translation) => [
      translation.localeCode,
      translation.fullSlugPathCache,
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

    const fullSlugPathCache = parsed.data.parentId
      ? [parentPathByLocale.get(translation.localeCode), translation.slugSegment]
          .filter(Boolean)
          .join("/")
      : translation.slugSegment;

    const duplicateWhere = {
      localeCode: translation.localeCode,
      fullSlugPathCache,
      ...(parsed.data.id && parsed.data.id !== "new"
        ? { NOT: { categoryId: parsed.data.id } }
        : {}),
    };

    const duplicate = await prisma.categoryTranslation.findFirst({
      where: duplicateWhere,
      select: { id: true },
    });

    if (duplicate) {
      redirect(
        getRedirectTarget(
          id,
          `?error=${encodeURIComponent(
            `${translation.localeCode.toUpperCase()} slug path must be unique.`,
          )}`,
        ),
      );
    }

    const publishedProducts = await prisma.product.count({
      where: {
        categoryId: parsed.data.id && parsed.data.id !== "new" ? parsed.data.id : "__none__",
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
        ? getCategoryPublicationIssues({
            baseStatus: parsed.data.publishStatus,
            translationStatus: translation.publishStatus,
            localeVisibility:
              localeVisibility.get(translation.localeCode) ?? "internal_only",
            isComplete: true,
            fullSlugPath: fullSlugPathCache,
            shortDescription: translation.shortDescription,
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

    translationRows.push({
      ...translation,
      fullSlugPathCache,
    });
  }

  const parentDepth = parsed.data.parentId
    ? await prisma.category.findUnique({
        where: { id: parsed.data.parentId },
        select: { depth: true },
      })
    : null;

  const payload = {
    code: parsed.data.code,
    parentId: parsed.data.parentId,
    sortOrder: parsed.data.sortOrder,
    isFeatured: parsed.data.isFeatured,
    heroMediaId: parsed.data.heroMediaId,
    publishStatus: parsed.data.publishStatus,
    depth: parsed.data.parentId ? (parentDepth?.depth ?? 0) + 1 : 0,
  };

  const record =
    parsed.data.id && parsed.data.id !== "new"
      ? await prisma.category.update({
          where: { id: parsed.data.id },
          data: {
            ...payload,
            translations: {
              deleteMany: {},
              create: translationRows,
            },
          },
        })
      : await prisma.category.create({
          data: {
            ...payload,
            translations: {
              create: translationRows,
            },
          },
        });

  revalidatePath("/admin");
  revalidatePath("/admin/categories");
  revalidatePath(`/admin/categories/${record.id}`);
  redirect(`/admin/categories/${record.id}?saved=1`);
}
