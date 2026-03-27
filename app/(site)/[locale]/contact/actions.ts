"use server";

import { redirect } from "next/navigation";
import { ZodError } from "zod";

import { prisma } from "@/lib/db";
import { createInquiryRecord } from "@/lib/domain/inquiries";
import { toBoolean, toNullableString, toRequiredString } from "@/lib/admin/utils";
import {
  normalizePublicLocale,
  sanitizeInquiryRedirectPath,
} from "@/lib/public/forms";

export async function submitInquiryAction(formData: FormData) {
  const locale = normalizePublicLocale(toRequiredString(formData.get("sourceLocaleCode")));
  const redirectTo = sanitizeInquiryRedirectPath(
    toRequiredString(formData.get("redirectTo")),
    locale,
  );

  try {
    await createInquiryRecord(prisma, {
      requestType:
        (toNullableString(formData.get("requestType")) as
          | "general"
          | "product_inquiry"
          | "manufacturer_inquiry"
          | "pricing_request"
          | null) ?? "general",
      sourceLocaleCode: locale,
      sourcePageId: toNullableString(formData.get("sourcePageId")),
      productId: toNullableString(formData.get("productId")),
      manufacturerId: toNullableString(formData.get("manufacturerId")),
      companyName: toNullableString(formData.get("companyName")),
      contactName: toRequiredString(formData.get("contactName")),
      email: toRequiredString(formData.get("email")),
      phone: toNullableString(formData.get("phone")),
      country: toNullableString(formData.get("country")),
      message: toRequiredString(formData.get("message")),
      consentToContact: toBoolean(formData.get("consentToContact")),
      utmSource: toNullableString(formData.get("utmSource")),
      utmMedium: toNullableString(formData.get("utmMedium")),
      utmCampaign: toNullableString(formData.get("utmCampaign")),
    });
  } catch (error) {
    const message =
      error instanceof ZodError
        ? error.issues[0]?.message ?? "Please review the inquiry form and try again."
        : error instanceof Error
          ? error.message
          : "Inquiry submission failed.";
    redirect(`${redirectTo}?error=${encodeURIComponent(message)}`);
  }

  redirect(`${redirectTo}?sent=1`);
}
