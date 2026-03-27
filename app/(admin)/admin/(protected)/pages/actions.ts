"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { prisma } from "@/lib/db";
import { getPagePublicationIssues } from "@/lib/domain/publication";
import { appLocales } from "@/lib/i18n/config";
import {
  parseJsonField,
  toBoolean,
  toNullableString,
  toRequiredString,
} from "@/lib/admin/utils";
import { pageFormSchema } from "@/lib/validation/cms";

function getRedirectTarget(id: string | null, search: string) {
  return id && id !== "new" ? `/admin/pages/${id}${search}` : `/admin/pages/new${search}`;
}

export async function savePageAction(formData: FormData) {
  const id = toNullableString(formData.get("id"));

  const rawInput = {
    id,
    pageKey: toRequiredString(formData.get("pageKey")),
    publishStatus: toRequiredString(formData.get("publishStatus")),
    showInNavigation: toBoolean(formData.get("showInNavigation")),
    templateVariant: toNullableString(formData.get("templateVariant")),
    navigationGroup: toNullableString(formData.get("navigationGroup")),
    heroMediaId: toNullableString(formData.get("heroMediaId")),
    translations: appLocales.map((locale) => ({
      localeCode: locale,
      title: toRequiredString(formData.get(`title_${locale}`)),
      slug: toNullableString(formData.get(`slug_${locale}`)),
      summary: toNullableString(formData.get(`summary_${locale}`)),
      contentBlocksJson: toRequiredString(formData.get(`contentBlocksJson_${locale}`)),
      heroHeading: toNullableString(formData.get(`heroHeading_${locale}`)),
      seoTitle: toNullableString(formData.get(`seoTitle_${locale}`)),
      seoDescription: toNullableString(formData.get(`seoDescription_${locale}`)),
      ogTitle: toNullableString(formData.get(`ogTitle_${locale}`)),
      ogDescription: toNullableString(formData.get(`ogDescription_${locale}`)),
      publishStatus: toRequiredString(formData.get(`translationStatus_${locale}`)),
    })),
  };

  const parsed = pageFormSchema.safeParse(rawInput);

  if (!parsed.success) {
    const issue = parsed.error.issues[0]?.message ?? "Page validation failed.";
    redirect(getRedirectTarget(id, `?error=${encodeURIComponent(issue)}`));
  }

  const localeVisibility = new Map(
    (
      await prisma.locale.findMany({
        select: { code: true, visibilityStatus: true },
      })
    ).map((locale) => [locale.code, locale.visibilityStatus]),
  );

  const pageKeyConflict = await prisma.page.findUnique({
    where: { pageKey: parsed.data.pageKey },
    select: { id: true },
  });

  if (pageKeyConflict && pageKeyConflict.id !== parsed.data.id) {
    redirect(
      getRedirectTarget(
        id,
        `?error=${encodeURIComponent("A page with this page key already exists.")}`,
      ),
    );
  }

  for (const translation of parsed.data.translations) {
    if (translation.localeCode === "fa" && translation.publishStatus === "published") {
      redirect(
        getRedirectTarget(
          id,
          `?error=${encodeURIComponent("Persian cannot be published publicly in MVP.")}`,
        ),
      );
    }

    const contentBlocks = parseJsonField(translation.contentBlocksJson, []);
    const hasRequiredSections =
      Array.isArray(contentBlocks) && contentBlocks.length > 0;

    if (!Array.isArray(contentBlocks)) {
      redirect(
        getRedirectTarget(
          id,
          `?error=${encodeURIComponent(`${translation.localeCode.toUpperCase()} content blocks must be valid JSON.`)}`,
        ),
      );
    }

    const issues =
      translation.publishStatus === "published"
        ? getPagePublicationIssues({
            baseStatus: parsed.data.publishStatus,
            translationStatus: translation.publishStatus,
            localeVisibility:
              localeVisibility.get(translation.localeCode) ?? "internal_only",
            isComplete: true,
            title: translation.title,
            slugRequired: parsed.data.pageKey !== "home",
            slug: translation.slug,
            hasRequiredSections,
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
  }

  const translationRows = parsed.data.translations.map((translation) => ({
    localeCode: translation.localeCode,
    title: translation.title,
    slug: translation.slug,
    summary: translation.summary,
    contentBlocksJson: translation.contentBlocksJson,
    heroHeading: translation.heroHeading,
    seoTitle: translation.seoTitle,
    seoDescription: translation.seoDescription,
    ogTitle: translation.ogTitle,
    ogDescription: translation.ogDescription,
    publishStatus: translation.publishStatus,
  }));

  const payload = {
    pageKey: parsed.data.pageKey,
    publishStatus: parsed.data.publishStatus,
    showInNavigation: parsed.data.showInNavigation,
    templateVariant: parsed.data.templateVariant,
    navigationGroup: parsed.data.navigationGroup,
    heroMediaId: parsed.data.heroMediaId,
  };

  const record =
    parsed.data.id && parsed.data.id !== "new"
      ? await prisma.page.update({
          where: { id: parsed.data.id },
          data: {
            ...payload,
            translations: {
              deleteMany: {},
              create: translationRows,
            },
          },
        })
      : await prisma.page.create({
          data: {
            ...payload,
            isSystemPage: true,
            translations: {
              create: translationRows,
            },
          },
        });

  revalidatePath("/admin");
  revalidatePath("/admin/pages");
  revalidatePath(`/admin/pages/${record.id}`);
  redirect(`/admin/pages/${record.id}?saved=1`);
}
