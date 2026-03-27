import type { MetadataRoute } from "next";
import { PublishStatus } from "@prisma/client";

import { prisma } from "@/lib/db";
import { publicLocales } from "@/lib/i18n/config";
import { buildAbsoluteUrl } from "@/lib/seo/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [pages, products, manufacturers, categories] = await Promise.all([
    prisma.page.findMany({
      where: {
        publishStatus: PublishStatus.published,
        translations: {
          some: {
            localeCode: { in: [...publicLocales] },
            publishStatus: PublishStatus.published,
          },
        },
      },
      include: {
        translations: {
          where: {
            localeCode: { in: [...publicLocales] },
            publishStatus: PublishStatus.published,
          },
        },
      },
    }),
    prisma.productTranslation.findMany({
      where: {
        localeCode: { in: [...publicLocales] },
        publishStatus: PublishStatus.published,
        product: { publishStatus: PublishStatus.published },
      },
      select: {
        localeCode: true,
        slug: true,
        updatedAt: true,
      },
    }),
    prisma.manufacturerTranslation.findMany({
      where: {
        localeCode: { in: [...publicLocales] },
        publishStatus: PublishStatus.published,
        manufacturer: { publishStatus: PublishStatus.published },
      },
      select: {
        localeCode: true,
        slug: true,
        updatedAt: true,
      },
    }),
    prisma.categoryTranslation.findMany({
      where: {
        localeCode: { in: [...publicLocales] },
        publishStatus: PublishStatus.published,
        category: { publishStatus: PublishStatus.published },
      },
      select: {
        localeCode: true,
        fullSlugPathCache: true,
        updatedAt: true,
      },
    }),
  ]);

  const pageEntries = pages.flatMap((page) =>
    page.translations.map((translation) => ({
      url: buildAbsoluteUrl(
        page.pageKey === "home"
          ? `/${translation.localeCode}`
          : `/${translation.localeCode}/${translation.slug}`,
      ),
      lastModified: translation.updatedAt,
    })),
  );

  return [
    ...pageEntries,
    ...products.map((product) => ({
      url: buildAbsoluteUrl(`/${product.localeCode}/products/${product.slug}`),
      lastModified: product.updatedAt,
    })),
    ...manufacturers.map((manufacturer) => ({
      url: buildAbsoluteUrl(
        `/${manufacturer.localeCode}/manufacturers/${manufacturer.slug}`,
      ),
      lastModified: manufacturer.updatedAt,
    })),
    ...categories.map((category) => ({
      url: buildAbsoluteUrl(
        `/${category.localeCode}/categories/${category.fullSlugPathCache}`,
      ),
      lastModified: category.updatedAt,
    })),
  ];
}
