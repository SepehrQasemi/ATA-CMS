import { describe, expect, test } from "vitest";

import {
  attachProductManufacturerRelation,
  attachProductRelations,
  attachTranslation,
  pickFirstTranslation,
} from "@/lib/public/query-helpers";

describe("public query helpers", () => {
  test("pickFirstTranslation fails safely on empty inputs", () => {
    expect(pickFirstTranslation(undefined)).toBeNull();
    expect(pickFirstTranslation(null)).toBeNull();
    expect(pickFirstTranslation([])).toBeNull();
  });

  test("attachTranslation returns a strongly shaped item when a translation exists", () => {
    const shaped = attachTranslation({
      id: "manufacturer-meridian",
      code: "meridian-bio",
      translations: [{ name: "Meridian Bio", slug: "meridian-bio" }],
    });

    expect(shaped).toEqual({
      id: "manufacturer-meridian",
      code: "meridian-bio",
      translation: { name: "Meridian Bio", slug: "meridian-bio" },
    });
  });

  test("attachTranslation returns null when no localized translation is available", () => {
    expect(
      attachTranslation({
        id: "manufacturer-meridian",
        translations: [],
      }),
    ).toBeNull();
  });

  test("attachProductRelations keeps category and manufacturer context together", () => {
    const shaped = attachProductRelations({
      id: "product-citric-acid",
      availabilityStatus: "in_stock",
      translations: [{ name: "Citric Acid Monohydrate", slug: "citric-acid-monohydrate" }],
      category: {
        id: "cat-acidity-regulators",
        translations: [{ name: "Acidity Regulators", fullSlugPathCache: "food/acidity" }],
      },
      manufacturer: {
        id: "manufacturer-meridian",
        translations: [{ name: "Meridian Bio", slug: "meridian-bio" }],
      },
    });

    expect(shaped).toEqual({
      id: "product-citric-acid",
      availabilityStatus: "in_stock",
      category: {
        id: "cat-acidity-regulators",
        translations: [{ name: "Acidity Regulators", fullSlugPathCache: "food/acidity" }],
      },
      manufacturer: {
        id: "manufacturer-meridian",
        translations: [{ name: "Meridian Bio", slug: "meridian-bio" }],
      },
      translation: { name: "Citric Acid Monohydrate", slug: "citric-acid-monohydrate" },
      categoryTranslation: {
        name: "Acidity Regulators",
        fullSlugPathCache: "food/acidity",
      },
      manufacturerTranslation: { name: "Meridian Bio", slug: "meridian-bio" },
    });
  });

  test("attachProductRelations drops items with incomplete related translations", () => {
    expect(
      attachProductRelations({
        id: "product-citric-acid",
        translations: [{ name: "Citric Acid Monohydrate", slug: "citric-acid-monohydrate" }],
        category: { id: "cat-acidity-regulators", translations: [] },
        manufacturer: {
          id: "manufacturer-meridian",
          translations: [{ name: "Meridian Bio", slug: "meridian-bio" }],
        },
      }),
    ).toBeNull();
  });

  test("attachProductManufacturerRelation drops items without a published manufacturer translation", () => {
    expect(
      attachProductManufacturerRelation({
        id: "product-citric-acid",
        translations: [{ name: "Citric Acid Monohydrate", slug: "citric-acid-monohydrate" }],
        manufacturer: {
          id: "manufacturer-meridian",
          translations: [],
        },
      }),
    ).toBeNull();
  });
});
