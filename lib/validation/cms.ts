import { z } from "zod";

import { appLocales } from "@/lib/i18n/config";

const publishStatuses = ["draft", "review", "published", "archived"] as const;
const availabilityStatuses = [
  "in_stock",
  "available_on_request",
  "out_of_stock",
  "discontinued",
] as const;
const inquiryStatuses = [
  "new",
  "qualified",
  "answered",
  "closed",
  "spam",
] as const;
const localeVisibilityStatuses = [
  "disabled",
  "internal_only",
  "public",
] as const;
const pageKeys = [
  "home",
  "about",
  "products_index",
  "categories_index",
  "manufacturers_index",
  "contact",
  "privacy",
  "legal",
] as const;
const mediaKinds = ["image", "document"] as const;
const productDocumentTypes = [
  "datasheet",
  "catalog",
  "certificate",
  "brochure",
  "other",
] as const;

const optionalText = z
  .union([z.string(), z.null(), z.undefined()])
  .transform((value) => value?.trim() || null);
const requiredText = (label: string) =>
  z.string().trim().min(1, `${label} is required.`);

export const localeCodeSchema = z.enum(appLocales);
export const publishStatusSchema = z.enum(publishStatuses);
export const availabilityStatusSchema = z.enum(availabilityStatuses);
export const inquiryStatusSchema = z.enum(inquiryStatuses);
export const localeVisibilityStatusSchema = z.enum(localeVisibilityStatuses);
export const pageKeySchema = z.enum(pageKeys);
export const mediaKindSchema = z.enum(mediaKinds);
export const productDocumentTypeSchema = z.enum(productDocumentTypes);

export const pageTranslationSchema = z.object({
  localeCode: localeCodeSchema,
  title: requiredText("Title"),
  slug: optionalText,
  summary: optionalText,
  contentBlocksJson: z.string().trim().min(2, "Structured content is required."),
  heroHeading: optionalText,
  seoTitle: optionalText,
  seoDescription: optionalText,
  ogTitle: optionalText,
  ogDescription: optionalText,
  publishStatus: publishStatusSchema,
});

export const pageFormSchema = z.object({
  id: optionalText,
  pageKey: pageKeySchema,
  publishStatus: publishStatusSchema,
  showInNavigation: z.boolean(),
  templateVariant: optionalText,
  navigationGroup: optionalText,
  heroMediaId: optionalText,
  translations: z.array(pageTranslationSchema).length(appLocales.length),
});

export const categoryTranslationSchema = z.object({
  localeCode: localeCodeSchema,
  name: requiredText("Name"),
  slugSegment: requiredText("Slug segment"),
  shortDescription: optionalText,
  body: optionalText,
  seoTitle: optionalText,
  seoDescription: optionalText,
  publishStatus: publishStatusSchema,
});

export const categoryFormSchema = z.object({
  id: optionalText,
  code: requiredText("Category code"),
  parentId: optionalText,
  sortOrder: z.number().int().min(0),
  isFeatured: z.boolean(),
  heroMediaId: optionalText,
  publishStatus: publishStatusSchema,
  translations: z.array(categoryTranslationSchema).length(appLocales.length),
});

export const manufacturerTranslationSchema = z.object({
  localeCode: localeCodeSchema,
  name: requiredText("Name"),
  slug: requiredText("Slug"),
  summary: optionalText,
  body: optionalText,
  seoTitle: optionalText,
  seoDescription: optionalText,
  certificationsText: optionalText,
  publishStatus: publishStatusSchema,
});

export const manufacturerFormSchema = z.object({
  id: optionalText,
  code: requiredText("Manufacturer code"),
  originCountry: optionalText,
  websiteUrl: optionalText,
  logoMediaId: optionalText,
  heroMediaId: optionalText,
  sortOrder: z.number().int().min(0),
  isFeatured: z.boolean(),
  publishStatus: publishStatusSchema,
  translations: z.array(manufacturerTranslationSchema).length(appLocales.length),
});

export const productTranslationSchema = z.object({
  localeCode: localeCodeSchema,
  name: requiredText("Name"),
  slug: requiredText("Slug"),
  shortDescription: requiredText("Short description"),
  longDescription: optionalText,
  availabilityNote: optionalText,
  contactForPricingMessage: optionalText,
  seoTitle: optionalText,
  seoDescription: optionalText,
  metaKeywords: optionalText,
  publishStatus: publishStatusSchema,
});

export const productImageSchema = z.object({
  mediaId: requiredText("Image media"),
  sortOrder: z.number().int().min(0),
  isPrimary: z.boolean(),
  altHint: optionalText,
});

export const productSpecSchema = z.object({
  localeCode: localeCodeSchema,
  label: requiredText("Spec label"),
  value: requiredText("Spec value"),
  unit: optionalText,
  sortOrder: z.number().int().min(0),
  isHighlight: z.boolean(),
});

export const productDocumentTranslationSchema = z.object({
  localeCode: localeCodeSchema,
  label: optionalText,
  description: optionalText,
  publishStatus: publishStatusSchema,
});

export const productDocumentSchema = z.object({
  mediaId: requiredText("Document media"),
  documentType: productDocumentTypeSchema,
  isPublic: z.boolean(),
  sortOrder: z.number().int().min(0),
  internalNotes: optionalText,
  translations: z
    .array(productDocumentTranslationSchema)
    .length(appLocales.length),
});

export const productFormSchema = z.object({
  id: optionalText,
  sku: optionalText,
  categoryId: requiredText("Category"),
  manufacturerId: requiredText("Manufacturer"),
  availabilityStatus: availabilityStatusSchema,
  publicPriceAmount: z.number().nonnegative().nullable(),
  publicPriceCurrency: optionalText,
  publicPriceUnitLabel: optionalText,
  priceLastVerifiedAt: z.string().trim().nullable(),
  isFeatured: z.boolean(),
  primaryImageMediaId: optionalText,
  publishStatus: publishStatusSchema,
  sortOrder: z.number().int().min(0),
  internalNotes: optionalText,
  translations: z.array(productTranslationSchema).length(appLocales.length),
  images: z.array(productImageSchema),
  specs: z.array(productSpecSchema),
  documents: z.array(productDocumentSchema),
});

export const siteSettingTranslationSchema = z.object({
  localeCode: localeCodeSchema,
  siteName: requiredText("Site name"),
  siteTagline: optionalText,
  defaultMetaTitleSuffix: optionalText,
  defaultMetaDescription: optionalText,
  footerCompanyBlurb: optionalText,
  contactIntro: optionalText,
  defaultContactForPricingMessage: optionalText,
});

export const localeConfigSchema = z.object({
  code: localeCodeSchema,
  visibilityStatus: localeVisibilityStatusSchema,
  isDefaultPublic: z.boolean(),
  direction: z.enum(["ltr", "rtl"]),
  label: requiredText("Locale label"),
  nativeLabel: optionalText,
  sortOrder: z.number().int().min(0),
});

export const settingsFormSchema = z.object({
  id: requiredText("Settings id"),
  defaultLocaleCode: localeCodeSchema,
  contactEmail: z.string().trim().email("A valid contact email is required."),
  phone: optionalText,
  addressJson: z.string().trim().min(2, "Address JSON is required."),
  socialLinksJson: z.string().trim().min(2, "Social links JSON is required."),
  mainNavigationJson: z.string().trim().min(2, "Main navigation JSON is required."),
  footerNavigationJson: z
    .string()
    .trim()
    .min(2, "Footer navigation JSON is required."),
  defaultShareImageMediaId: optionalText,
  searchConsoleVerification: optionalText,
  localeConfigs: z.array(localeConfigSchema).length(appLocales.length),
  translations: z.array(siteSettingTranslationSchema).length(appLocales.length),
});

export const mediaFormSchema = z.object({
  id: optionalText,
  kind: mediaKindSchema,
  storageKey: requiredText("Storage key"),
  publicUrl: optionalText,
  mimeType: requiredText("Mime type"),
  originalFilename: optionalText,
  title: optionalText,
  width: z.number().int().min(0).nullable(),
  height: z.number().int().min(0).nullable(),
  bytes: z.number().int().min(0).nullable(),
});

export const inquiryReviewSchema = z.object({
  id: requiredText("Inquiry id"),
  status: inquiryStatusSchema,
  internalNotes: optionalText,
});

export type PageFormInput = z.infer<typeof pageFormSchema>;
export type CategoryFormInput = z.infer<typeof categoryFormSchema>;
export type ManufacturerFormInput = z.infer<typeof manufacturerFormSchema>;
export type ProductFormInput = z.infer<typeof productFormSchema>;
export type SettingsFormInput = z.infer<typeof settingsFormSchema>;
export type MediaFormInput = z.infer<typeof mediaFormSchema>;
export type InquiryReviewInput = z.infer<typeof inquiryReviewSchema>;
