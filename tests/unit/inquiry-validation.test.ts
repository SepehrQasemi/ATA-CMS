import { describe, expect, test } from "vitest";

import {
  inquirySubmissionSchema,
  INQUIRY_FIELD_LIMITS,
} from "@/lib/validation/inquiries";

describe("inquiry validation", () => {
  test("trims optional values and keeps a valid inquiry payload", () => {
    const result = inquirySubmissionSchema.safeParse({
      requestType: "product_inquiry",
      sourceLocaleCode: "en",
      sourcePageId: " page-contact ",
      productId: " product-citric-acid ",
      manufacturerId: " manufacturer-meridian ",
      companyName: "  QA Foods  ",
      contactName: "  Amelia Hart  ",
      email: "  amelia@example.com  ",
      phone: "   ",
      country: " France ",
      message: "  Need pricing and technical documentation for our next batch.  ",
      consentToContact: true,
      utmSource: "  linkedin ",
      utmMedium: undefined,
      utmCampaign: null,
    });

    expect(result.success).toBe(true);
    expect(result.data?.phone).toBeNull();
    expect(result.data?.companyName).toBe("QA Foods");
    expect(result.data?.message).toBe(
      "Need pricing and technical documentation for our next batch.",
    );
  });

  test("rejects overly long fields with readable limits", () => {
    const result = inquirySubmissionSchema.safeParse({
      requestType: "general",
      sourceLocaleCode: "en",
      sourcePageId: null,
      productId: null,
      manufacturerId: null,
      companyName: "A".repeat(INQUIRY_FIELD_LIMITS.companyName + 1),
      contactName: "A".repeat(INQUIRY_FIELD_LIMITS.contactName + 1),
      email: "valid@example.com",
      phone: null,
      country: null,
      message: "B".repeat(INQUIRY_FIELD_LIMITS.message + 1),
      consentToContact: true,
      utmSource: null,
      utmMedium: null,
      utmCampaign: null,
    });

    expect(result.success).toBe(false);
    expect(result.error?.issues.map((issue) => issue.message)).toEqual(
      expect.arrayContaining([
        `Maximum length is ${INQUIRY_FIELD_LIMITS.companyName} characters.`,
        `Contact name must be ${INQUIRY_FIELD_LIMITS.contactName} characters or fewer.`,
        `Message must be ${INQUIRY_FIELD_LIMITS.message} characters or fewer.`,
      ]),
    );
  });
});
