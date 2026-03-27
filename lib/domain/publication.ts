import {
  type AvailabilityStatus,
  type LocaleVisibilityStatus,
  type PublishStatus,
} from "@prisma/client";

export type PublicationContext = {
  baseStatus: PublishStatus;
  isComplete: boolean;
  localeVisibility: LocaleVisibilityStatus;
  translationStatus: PublishStatus;
};

export type ProductPublicationInput = PublicationContext & {
  hasCategory: boolean;
  hasImage: boolean;
  hasManufacturer: boolean;
  hasPricingFallback: boolean;
  slug: string | null | undefined;
  summary: string | null | undefined;
  seoDescription: string | null | undefined;
  seoTitle: string | null | undefined;
};

export type CategoryPublicationInput = PublicationContext & {
  body: string | null | undefined;
  fullSlugPath: string | null | undefined;
  hasPublishedProducts: boolean;
  seoDescription: string | null | undefined;
  seoTitle: string | null | undefined;
  shortDescription: string | null | undefined;
};

export type ManufacturerPublicationInput = PublicationContext & {
  body: string | null | undefined;
  hasPublishedProducts: boolean;
  seoDescription: string | null | undefined;
  seoTitle: string | null | undefined;
  slug: string | null | undefined;
  summary: string | null | undefined;
};

export type PagePublicationInput = PublicationContext & {
  hasRequiredSections: boolean;
  seoDescription: string | null | undefined;
  seoTitle: string | null | undefined;
  slugRequired: boolean;
  slug: string | null | undefined;
  title: string | null | undefined;
};

function hasText(value: string | null | undefined) {
  return Boolean(value?.trim());
}

export function isLocalePublic(visibility: LocaleVisibilityStatus) {
  return visibility === "public";
}

export function canExposeEntity({
  baseStatus,
  isComplete,
  localeVisibility,
  translationStatus,
}: PublicationContext) {
  return (
    isLocalePublic(localeVisibility) &&
    baseStatus === "published" &&
    translationStatus === "published" &&
    isComplete
  );
}

export function getProductPublicationIssues(input: ProductPublicationInput) {
  const issues: string[] = [];

  if (!input.hasCategory) issues.push("Category is required.");
  if (!input.hasManufacturer) issues.push("Manufacturer is required.");
  if (!input.hasImage) issues.push("At least one image is required.");
  if (!hasText(input.slug)) issues.push("Localized slug is required.");
  if (!hasText(input.summary)) issues.push("Short description is required.");
  if (!hasText(input.seoTitle)) issues.push("SEO title is required.");
  if (!hasText(input.seoDescription)) issues.push("SEO description is required.");
  if (!input.hasPricingFallback) {
    issues.push("A public price or contact-for-pricing message is required.");
  }

  return issues;
}

export function getCategoryPublicationIssues(input: CategoryPublicationInput) {
  const issues: string[] = [];

  if (!hasText(input.fullSlugPath)) issues.push("Localized slug path is required.");
  if (!hasText(input.shortDescription)) {
    issues.push("Short description is required.");
  }
  if (!hasText(input.body)) issues.push("Body content is required.");
  if (!hasText(input.seoTitle)) issues.push("SEO title is required.");
  if (!hasText(input.seoDescription)) issues.push("SEO description is required.");
  if (!input.hasPublishedProducts) {
    issues.push("At least one published product is required.");
  }

  return issues;
}

export function getManufacturerPublicationIssues(
  input: ManufacturerPublicationInput,
) {
  const issues: string[] = [];

  if (!hasText(input.slug)) issues.push("Localized slug is required.");
  if (!hasText(input.summary)) issues.push("Summary is required.");
  if (!hasText(input.body)) issues.push("Body content is required.");
  if (!hasText(input.seoTitle)) issues.push("SEO title is required.");
  if (!hasText(input.seoDescription)) issues.push("SEO description is required.");
  if (!input.hasPublishedProducts) {
    issues.push("At least one published product is required.");
  }

  return issues;
}

export function getPagePublicationIssues(input: PagePublicationInput) {
  const issues: string[] = [];

  if (!hasText(input.title)) issues.push("Title is required.");
  if (input.slugRequired && !hasText(input.slug)) {
    issues.push("Slug is required.");
  }
  if (!input.hasRequiredSections) {
    issues.push("Required structured sections are missing.");
  }
  if (!hasText(input.seoTitle)) issues.push("SEO title is required.");
  if (!hasText(input.seoDescription)) issues.push("SEO description is required.");

  return issues;
}

export function getAvailabilityTone(status: AvailabilityStatus) {
  switch (status) {
    case "in_stock":
      return "success";
    case "available_on_request":
      return "muted";
    case "out_of_stock":
      return "warning";
    case "discontinued":
      return "warning";
  }
}
