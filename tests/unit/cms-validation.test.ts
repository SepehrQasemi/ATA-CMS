import { describe, expect, test } from "vitest";

import { productFormSchema } from "@/lib/validation/cms";

describe("cms validation", () => {
  test("requires product manufacturer and category relationships", () => {
    const result = productFormSchema.safeParse({
      id: null,
      sku: null,
      categoryId: "",
      manufacturerId: "",
      availabilityStatus: "in_stock",
      publicPriceAmount: null,
      publicPriceCurrency: null,
      publicPriceUnitLabel: null,
      priceLastVerifiedAt: null,
      isFeatured: false,
      primaryImageMediaId: null,
      publishStatus: "draft",
      sortOrder: 0,
      internalNotes: null,
      images: [],
      specs: [],
      documents: [],
      translations: [
        {
          localeCode: "en",
          name: "Citric Acid",
          slug: "citric-acid",
          shortDescription: "Short description",
          longDescription: null,
          availabilityNote: null,
          contactForPricingMessage: null,
          seoTitle: null,
          seoDescription: null,
          metaKeywords: null,
          publishStatus: "draft",
        },
        {
          localeCode: "fr",
          name: "Acide Citrique",
          slug: "acide-citrique",
          shortDescription: "Description courte",
          longDescription: null,
          availabilityNote: null,
          contactForPricingMessage: null,
          seoTitle: null,
          seoDescription: null,
          metaKeywords: null,
          publishStatus: "draft",
        },
        {
          localeCode: "fa",
          name: "Draft",
          slug: "draft",
          shortDescription: "Internal only",
          longDescription: null,
          availabilityNote: null,
          contactForPricingMessage: null,
          seoTitle: null,
          seoDescription: null,
          metaKeywords: null,
          publishStatus: "review",
        },
      ],
    });

    expect(result.success).toBe(false);
    expect(result.error?.flatten().fieldErrors.categoryId).toEqual([
      "Category is required.",
    ]);
    expect(result.error?.flatten().fieldErrors.manufacturerId).toEqual([
      "Manufacturer is required.",
    ]);
  });

  test("accepts product document rows with per-locale metadata", () => {
    const result = productFormSchema.safeParse({
      id: "product-citric-acid",
      sku: "ATA-CIT-001",
      categoryId: "cat-acidity-regulators",
      manufacturerId: "manufacturer-meridian",
      availabilityStatus: "in_stock",
      publicPriceAmount: 21.5,
      publicPriceCurrency: "USD",
      publicPriceUnitLabel: "kg",
      priceLastVerifiedAt: "2026-03-27",
      isFeatured: true,
      primaryImageMediaId: "media-product-citric",
      publishStatus: "published",
      sortOrder: 0,
      internalNotes: null,
      images: [{ mediaId: "media-product-citric", sortOrder: 0, isPrimary: true, altHint: null }],
      specs: [],
      documents: [
        {
          mediaId: "media-doc-citric",
          documentType: "datasheet",
          isPublic: true,
          sortOrder: 0,
          internalNotes: null,
          translations: [
            {
              localeCode: "en",
              label: "Citric acid datasheet",
              description: "Technical sheet",
              publishStatus: "published",
            },
            {
              localeCode: "fr",
              label: "Fiche technique acide citrique",
              description: "Fiche technique",
              publishStatus: "published",
            },
            {
              localeCode: "fa",
              label: null,
              description: null,
              publishStatus: "review",
            },
          ],
        },
      ],
      translations: [
        {
          localeCode: "en",
          name: "Citric Acid",
          slug: "citric-acid",
          shortDescription: "Short description",
          longDescription: "Long description",
          availabilityNote: null,
          contactForPricingMessage: null,
          seoTitle: "Citric Acid",
          seoDescription: "Citric Acid details",
          metaKeywords: null,
          publishStatus: "published",
        },
        {
          localeCode: "fr",
          name: "Acide Citrique",
          slug: "acide-citrique",
          shortDescription: "Description courte",
          longDescription: "Description longue",
          availabilityNote: null,
          contactForPricingMessage: null,
          seoTitle: "Acide Citrique",
          seoDescription: "Details produit",
          metaKeywords: null,
          publishStatus: "published",
        },
        {
          localeCode: "fa",
          name: "Draft",
          slug: "draft",
          shortDescription: "Internal only",
          longDescription: null,
          availabilityNote: null,
          contactForPricingMessage: null,
          seoTitle: null,
          seoDescription: null,
          metaKeywords: null,
          publishStatus: "review",
        },
      ],
    });

    expect(result.success).toBe(true);
    expect(result.data?.documents[0]?.mediaId).toBe("media-doc-citric");
  });
});
