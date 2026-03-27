"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { prisma } from "@/lib/db";
import { getLocaleConfigurationIssues } from "@/lib/domain/locales";
import { appLocales } from "@/lib/i18n/config";
import {
  toBoolean,
  toInteger,
  toNullableString,
  toRequiredString,
} from "@/lib/admin/utils";
import { settingsFormSchema } from "@/lib/validation/cms";

export async function saveSettingsAction(formData: FormData) {
  const rawInput = {
    id: toRequiredString(formData.get("id")),
    defaultLocaleCode: toRequiredString(formData.get("defaultLocaleCode")),
    contactEmail: toRequiredString(formData.get("contactEmail")),
    phone: toNullableString(formData.get("phone")),
    addressJson: toRequiredString(formData.get("addressJson")),
    socialLinksJson: toRequiredString(formData.get("socialLinksJson")),
    mainNavigationJson: toRequiredString(formData.get("mainNavigationJson")),
    footerNavigationJson: toRequiredString(formData.get("footerNavigationJson")),
    defaultShareImageMediaId: toNullableString(formData.get("defaultShareImageMediaId")),
    searchConsoleVerification: toNullableString(
      formData.get("searchConsoleVerification"),
    ),
    localeConfigs: appLocales.map((locale) => ({
      code: locale,
      visibilityStatus: toRequiredString(formData.get(`visibilityStatus_${locale}`)),
      isDefaultPublic: toBoolean(formData.get(`isDefaultPublic_${locale}`)),
      direction: toRequiredString(formData.get(`direction_${locale}`)),
      label: toRequiredString(formData.get(`label_${locale}`)),
      nativeLabel: toNullableString(formData.get(`nativeLabel_${locale}`)),
      sortOrder: toInteger(formData.get(`sortOrder_${locale}`)),
    })),
    translations: appLocales.map((locale) => ({
      localeCode: locale,
      siteName: toRequiredString(formData.get(`siteName_${locale}`)),
      siteTagline: toNullableString(formData.get(`siteTagline_${locale}`)),
      defaultMetaTitleSuffix: toNullableString(
        formData.get(`defaultMetaTitleSuffix_${locale}`),
      ),
      defaultMetaDescription: toNullableString(
        formData.get(`defaultMetaDescription_${locale}`),
      ),
      footerCompanyBlurb: toNullableString(formData.get(`footerCompanyBlurb_${locale}`)),
      contactIntro: toNullableString(formData.get(`contactIntro_${locale}`)),
      defaultContactForPricingMessage: toNullableString(
        formData.get(`defaultContactForPricingMessage_${locale}`),
      ),
    })),
  };

  const parsed = settingsFormSchema.safeParse(rawInput);

  if (!parsed.success) {
    const issue = parsed.error.issues[0]?.message ?? "Settings validation failed.";
    redirect(`/admin/settings?error=${encodeURIComponent(issue)}`);
  }

  const localeIssues = getLocaleConfigurationIssues(parsed.data.localeConfigs);

  if (parsed.data.defaultLocaleCode !== "en") {
    localeIssues.push("English must remain the default locale for MVP.");
  }

  if (localeIssues.length > 0) {
    redirect(`/admin/settings?error=${encodeURIComponent(localeIssues.join(" "))}`);
  }

  await prisma.$transaction([
    prisma.siteSettings.update({
      where: { id: parsed.data.id },
      data: {
        defaultLocaleCode: parsed.data.defaultLocaleCode,
        publicLocalesJson: JSON.stringify(
          parsed.data.localeConfigs
            .filter((locale) => locale.visibilityStatus === "public")
            .map((locale) => locale.code),
        ),
        contactEmail: parsed.data.contactEmail,
        phone: parsed.data.phone,
        addressJson: parsed.data.addressJson,
        socialLinksJson: parsed.data.socialLinksJson,
        mainNavigationJson: parsed.data.mainNavigationJson,
        footerNavigationJson: parsed.data.footerNavigationJson,
        defaultShareImageMediaId: parsed.data.defaultShareImageMediaId,
        searchConsoleVerification: parsed.data.searchConsoleVerification,
        translations: {
          deleteMany: {},
          create: parsed.data.translations,
        },
      },
    }),
    ...parsed.data.localeConfigs.map((locale) =>
      prisma.locale.update({
        where: { code: locale.code },
        data: {
          label: locale.label,
          nativeLabel: locale.nativeLabel,
          direction: locale.direction,
          visibilityStatus: locale.visibilityStatus,
          isDefaultPublic: locale.isDefaultPublic,
          sortOrder: locale.sortOrder,
        },
      }),
    ),
  ]);

  revalidatePath("/admin");
  revalidatePath("/admin/settings");
  redirect("/admin/settings?saved=1");
}
