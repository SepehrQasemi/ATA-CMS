import { describe, expect, test } from "vitest";

import {
  canExposeEntity,
  getCategoryPublicationIssues,
  getManufacturerPublicationIssues,
  getPagePublicationIssues,
  getProductPublicationIssues,
} from "@/lib/domain/publication";

describe("publication rules", () => {
  test("requires locale visibility and published statuses before public exposure", () => {
    expect(
      canExposeEntity({
        baseStatus: "published",
        translationStatus: "published",
        localeVisibility: "public",
        isComplete: true,
      }),
    ).toBe(true);

    expect(
      canExposeEntity({
        baseStatus: "published",
        translationStatus: "published",
        localeVisibility: "internal_only",
        isComplete: true,
      }),
    ).toBe(false);
  });

  test("blocks product publication when required dependencies are missing", () => {
    const issues = getProductPublicationIssues({
      baseStatus: "published",
      translationStatus: "published",
      localeVisibility: "public",
      isComplete: false,
      hasCategory: false,
      hasManufacturer: true,
      hasImage: false,
      hasPricingFallback: false,
      slug: "",
      summary: "",
      seoTitle: "",
      seoDescription: "",
    });

    expect(issues).toEqual([
      "Category is required.",
      "At least one image is required.",
      "Localized slug is required.",
      "Short description is required.",
      "SEO title is required.",
      "SEO description is required.",
      "A public price or contact-for-pricing message is required.",
    ]);
  });

  test("requires meaningful category and manufacturer landing content", () => {
    expect(
      getCategoryPublicationIssues({
        baseStatus: "published",
        translationStatus: "published",
        localeVisibility: "public",
        isComplete: false,
        fullSlugPath: "food-additives",
        shortDescription: "Intro",
        body: "",
        seoTitle: "Food additives",
        seoDescription: "",
        hasPublishedProducts: false,
      }),
    ).toEqual([
      "Body content is required.",
      "SEO description is required.",
      "At least one published product is required.",
    ]);

    expect(
      getManufacturerPublicationIssues({
        baseStatus: "published",
        translationStatus: "published",
        localeVisibility: "public",
        isComplete: false,
        slug: "meridian-bio",
        summary: "Summary",
        body: "",
        seoTitle: "Meridian Bio",
        seoDescription: "Producer profile",
        hasPublishedProducts: false,
      }),
    ).toEqual([
      "Body content is required.",
      "At least one published product is required.",
    ]);
  });

  test("enforces structured system page requirements", () => {
    expect(
      getPagePublicationIssues({
        baseStatus: "published",
        translationStatus: "published",
        localeVisibility: "public",
        isComplete: false,
        title: "About",
        slugRequired: true,
        slug: "about",
        hasRequiredSections: false,
        seoTitle: "",
        seoDescription: "",
      }),
    ).toEqual([
      "Required structured sections are missing.",
      "SEO title is required.",
      "SEO description is required.",
    ]);
  });
});
