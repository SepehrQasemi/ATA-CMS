import { z } from "zod";

import { appLocales } from "@/lib/i18n/config";

export const INQUIRY_FIELD_LIMITS = {
  companyName: 120,
  contactName: 80,
  country: 80,
  email: 254,
  message: 2000,
  phone: 40,
  sourceId: 100,
  utm: 120,
} as const;

const requestTypes = [
  "general",
  "product_inquiry",
  "manufacturer_inquiry",
  "pricing_request",
] as const;

const optionalText = z
  .union([z.string(), z.null(), z.undefined()])
  .transform((value) => value?.trim() || null);

const optionalBoundedText = (max: number) =>
  optionalText.refine(
    (value) => value === null || value.length <= max,
    `Maximum length is ${max} characters.`,
  );

export const inquirySubmissionSchema = z.object({
  requestType: z.enum(requestTypes).nullable(),
  sourceLocaleCode: z.enum(appLocales),
  sourcePageId: optionalBoundedText(INQUIRY_FIELD_LIMITS.sourceId),
  productId: optionalBoundedText(INQUIRY_FIELD_LIMITS.sourceId),
  manufacturerId: optionalBoundedText(INQUIRY_FIELD_LIMITS.sourceId),
  companyName: optionalBoundedText(INQUIRY_FIELD_LIMITS.companyName),
  contactName: z
    .string()
    .trim()
    .min(1, "Contact name is required.")
    .max(
      INQUIRY_FIELD_LIMITS.contactName,
      `Contact name must be ${INQUIRY_FIELD_LIMITS.contactName} characters or fewer.`,
    ),
  email: z
    .string()
    .trim()
    .max(
      INQUIRY_FIELD_LIMITS.email,
      `Email must be ${INQUIRY_FIELD_LIMITS.email} characters or fewer.`,
    )
    .email("A valid email is required."),
  phone: optionalBoundedText(INQUIRY_FIELD_LIMITS.phone),
  country: optionalBoundedText(INQUIRY_FIELD_LIMITS.country),
  message: z
    .string()
    .trim()
    .min(10, "Message is required.")
    .max(
      INQUIRY_FIELD_LIMITS.message,
      `Message must be ${INQUIRY_FIELD_LIMITS.message} characters or fewer.`,
    ),
  consentToContact: z
    .boolean()
    .refine((value) => value, "Consent is required before sending an inquiry."),
  utmSource: optionalBoundedText(INQUIRY_FIELD_LIMITS.utm),
  utmMedium: optionalBoundedText(INQUIRY_FIELD_LIMITS.utm),
  utmCampaign: optionalBoundedText(INQUIRY_FIELD_LIMITS.utm),
});

export type InquirySubmissionInput = z.infer<typeof inquirySubmissionSchema>;
