import { PublishStatus } from "@prisma/client";

import { prisma } from "@/lib/db";
import { publicLocales } from "@/lib/i18n/config";

export async function getPageAlternatePathnames(pageId: string, isHome: boolean) {
  const translations = await prisma.pageTranslation.findMany({
    where: {
      pageId,
      localeCode: { in: [...publicLocales] },
      publishStatus: PublishStatus.published,
    },
    select: {
      localeCode: true,
      slug: true,
    },
  });

  return Object.fromEntries(
    translations.map((translation) => [
      translation.localeCode,
      isHome ? `/${translation.localeCode}` : `/${translation.localeCode}/${translation.slug}`,
    ]),
  );
}

export async function getProductAlternatePathnames(productId: string) {
  const translations = await prisma.productTranslation.findMany({
    where: {
      productId,
      localeCode: { in: [...publicLocales] },
      publishStatus: PublishStatus.published,
    },
    select: {
      localeCode: true,
      slug: true,
    },
  });

  return Object.fromEntries(
    translations.map((translation) => [
      translation.localeCode,
      `/${translation.localeCode}/products/${translation.slug}`,
    ]),
  );
}

export async function getManufacturerAlternatePathnames(manufacturerId: string) {
  const translations = await prisma.manufacturerTranslation.findMany({
    where: {
      manufacturerId,
      localeCode: { in: [...publicLocales] },
      publishStatus: PublishStatus.published,
    },
    select: {
      localeCode: true,
      slug: true,
    },
  });

  return Object.fromEntries(
    translations.map((translation) => [
      translation.localeCode,
      `/${translation.localeCode}/manufacturers/${translation.slug}`,
    ]),
  );
}

export async function getCategoryAlternatePathnames(categoryId: string) {
  const translations = await prisma.categoryTranslation.findMany({
    where: {
      categoryId,
      localeCode: { in: [...publicLocales] },
      publishStatus: PublishStatus.published,
    },
    select: {
      localeCode: true,
      fullSlugPathCache: true,
    },
  });

  return Object.fromEntries(
    translations.map((translation) => [
      translation.localeCode,
      `/${translation.localeCode}/categories/${translation.fullSlugPathCache}`,
    ]),
  );
}
