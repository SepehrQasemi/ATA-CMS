import { beforeEach, describe, expect, test, vi } from "vitest";

vi.mock("@/lib/db", () => ({
  prisma: {
    siteSettings: {
      findFirstOrThrow: vi.fn(),
    },
    page: {
      findFirst: vi.fn(),
    },
    productTranslation: {
      findFirst: vi.fn(),
    },
    product: {
      findMany: vi.fn(),
    },
  },
}));

import { prisma } from "@/lib/db";
import {
  getProductDetailData,
  getPublicPage,
  getSiteChrome,
} from "@/lib/public/queries";

describe("public queries", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("getSiteChrome tolerates missing localized site settings translations", async () => {
    vi.mocked(prisma.siteSettings.findFirstOrThrow).mockResolvedValue({
      id: "site-settings",
      contactEmail: "sales@example.com",
      translations: [],
    } as never);

    await expect(getSiteChrome("en")).resolves.toEqual(
      expect.objectContaining({
        id: "site-settings",
        translation: null,
      }),
    );
  });

  test("getPublicPage returns null when the localized translation is missing", async () => {
    vi.mocked(prisma.page.findFirst).mockResolvedValue({
      id: "page-contact",
      pageKey: "contact",
      translations: [],
    } as never);

    await expect(getPublicPage("en", "contact")).resolves.toBeNull();
  });

  test("getPublicPage attaches the first localized translation", async () => {
    vi.mocked(prisma.page.findFirst).mockResolvedValue({
      id: "page-contact",
      pageKey: "contact",
      translations: [
        {
          localeCode: "en",
          title: "Contact",
        },
      ],
    } as never);

    await expect(getPublicPage("en", "contact")).resolves.toEqual(
      expect.objectContaining({
        id: "page-contact",
        translation: {
          localeCode: "en",
          title: "Contact",
        },
      }),
    );
  });

  test("getProductDetailData returns null when public category/manufacturer translations are incomplete", async () => {
    vi.mocked(prisma.productTranslation.findFirst).mockResolvedValue({
      productId: "product-citric-acid",
      localeCode: "en",
      slug: "citric-acid-monohydrate",
      name: "Citric Acid Monohydrate",
      product: {
        id: "product-citric-acid",
        categoryId: "cat-acidity-regulators",
        documents: [],
        category: {
          code: "acidity-regulators",
          translations: [],
        },
        manufacturer: {
          code: "meridian-bio",
          translations: [{ name: "Meridian Bio", slug: "meridian-bio" }],
        },
      },
    } as never);

    await expect(
      getProductDetailData("en", "citric-acid-monohydrate"),
    ).resolves.toBeNull();
  });

  test("getProductDetailData keeps only renderable public documents and localized related products", async () => {
    vi.mocked(prisma.productTranslation.findFirst).mockResolvedValue({
      productId: "product-citric-acid",
      localeCode: "en",
      slug: "citric-acid-monohydrate",
      name: "Citric Acid Monohydrate",
      shortDescription: "Food-grade acidity regulator.",
      product: {
        id: "product-citric-acid",
        categoryId: "cat-acidity-regulators",
        manufacturerId: "manufacturer-meridian",
        documents: [
          {
            id: "doc-public",
            isPublic: true,
            media: {
              publicUrl: "/documents/citric-acid-datasheet.txt",
              title: "Citric acid datasheet",
            },
            translations: [
              {
                label: "Citric acid datasheet",
                description: "Technical and handling summary.",
                publishStatus: "published",
              },
            ],
          },
          {
            id: "doc-hidden",
            isPublic: true,
            media: {
              publicUrl: "/documents/hidden.txt",
              title: "Hidden document",
            },
            translations: [
              {
                label: "   ",
                description: "Should not render",
                publishStatus: "published",
              },
            ],
          },
        ],
        category: {
          code: "acidity-regulators",
          translations: [
            {
              name: "Acidity Regulators",
              fullSlugPathCache: "food-additives/acidity-regulators",
            },
          ],
        },
        manufacturer: {
          code: "meridian-bio",
          translations: [{ name: "Meridian Bio", slug: "meridian-bio" }],
        },
      },
    } as never);

    vi.mocked(prisma.product.findMany).mockResolvedValue([
      {
        id: "product-sodium-bicarbonate",
        primaryImage: null,
        translations: [
          {
            name: "Sodium Bicarbonate",
            slug: "sodium-bicarbonate",
          },
        ],
      },
      {
        id: "product-missing-translation",
        primaryImage: null,
        translations: [],
      },
    ] as never);

    const result = await getProductDetailData("en", "citric-acid-monohydrate");

    expect(result?.product.documents).toHaveLength(1);
    expect(result?.product.documents[0]?.id).toBe("doc-public");
    expect(result?.relatedProducts).toHaveLength(1);
    expect(result?.relatedProducts[0]?.translation.name).toBe("Sodium Bicarbonate");
  });
});
