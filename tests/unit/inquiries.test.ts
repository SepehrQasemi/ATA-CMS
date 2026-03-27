import { describe, expect, test, vi } from "vitest";

import {
  createInquiryRecord,
  updateInquiryReview,
} from "@/lib/domain/inquiries";

describe("inquiry services", () => {
  test("persists a validated inquiry payload through the repository", async () => {
    const create = vi.fn().mockResolvedValue({ id: "inquiry-1" });

    await createInquiryRecord(
      {
        contactRequest: {
          create,
          update: vi.fn(),
        },
      },
      {
        requestType: "product_inquiry",
        sourceLocaleCode: "en",
        sourcePageId: "page-contact",
        productId: "product-citric-acid",
        manufacturerId: "manufacturer-meridian",
        companyName: "North Ridge Foods",
        contactName: "Amelia Hart",
        email: "amelia@northridge.example",
        phone: null,
        country: "United Kingdom",
        message: "Need a quotation and datasheet for the next batch review.",
        consentToContact: true,
        utmSource: "google",
        utmMedium: "organic",
        utmCampaign: "citric-acid",
      },
    );

    expect(create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          status: "new",
          sourceLocaleCode: "en",
          productId: "product-citric-acid",
          manufacturerId: "manufacturer-meridian",
        }),
      }),
    );
  });

  test("updates inquiry review state and notes", async () => {
    const update = vi.fn().mockResolvedValue({ id: "inquiry-1" });

    await updateInquiryReview(
      {
        contactRequest: {
          create: vi.fn(),
          update,
        },
      },
      {
        id: "inquiry-1",
        status: "qualified",
        internalNotes: "Pricing request confirmed and routed to sales.",
      },
    );

    expect(update).toHaveBeenCalledWith({
      where: { id: "inquiry-1" },
      data: {
        status: "qualified",
        internalNotes: "Pricing request confirmed and routed to sales.",
      },
    });
  });
});
