import { z } from "zod";

import { appLocales } from "@/lib/i18n/config";

const requestTypes = [
  "general",
  "product_inquiry",
  "manufacturer_inquiry",
  "pricing_request",
] as const;

const optionalText = z
  .union([z.string(), z.null(), z.undefined()])
  .transform((value) => value?.trim() || null);

export const inquirySubmissionSchema = z.object({
  requestType: z.enum(requestTypes).nullable(),
  sourceLocaleCode: z.enum(appLocales),
  sourcePageId: optionalText,
  productId: optionalText,
  manufacturerId: optionalText,
  companyName: optionalText,
  contactName: z.string().trim().min(1, "Contact name is required."),
  email: z.string().trim().email("A valid email is required."),
  phone: optionalText,
  country: optionalText,
  message: z.string().trim().min(10, "Message is required."),
  consentToContact: z
    .boolean()
    .refine((value) => value, "Consent is required before sending an inquiry."),
  utmSource: optionalText,
  utmMedium: optionalText,
  utmCampaign: optionalText,
});

export type InquirySubmissionInput = z.infer<typeof inquirySubmissionSchema>;
