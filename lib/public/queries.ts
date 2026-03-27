import { type PageKey, PublishStatus } from "@prisma/client";

import { prisma } from "@/lib/db";
import { buildCategoryTree } from "@/lib/domain/category-tree";
import type { PublicLocale } from "@/lib/i18n/config";
import {
  attachProductManufacturerRelation,
  attachProductRelations,
  attachTranslation,
  pickFirstTranslation,
} from "@/lib/public/query-helpers";
import { getRenderablePublicDocuments } from "@/lib/public/document-visibility";

const publishedWhere = { publishStatus: PublishStatus.published } as const;

function localeWhere(locale: PublicLocale) {
  return {
    localeCode: locale,
    publishStatus: PublishStatus.published,
  } as const;
}

function translationInclude(locale: PublicLocale) {
  return {
    where: localeWhere(locale),
    take: 1,
  } as const;
}

function publicEntityWhere(locale: PublicLocale) {
  return {
    ...publishedWhere,
    translations: {
      some: localeWhere(locale),
    },
  } as const;
}

export async function getSiteChrome(locale: PublicLocale) {
  const settings = await prisma.siteSettings.findFirstOrThrow({
    include: {
      translations: {
        where: { localeCode: locale },
        take: 1,
      },
    },
  });

  const translation = settings.translations[0];

  return {
    ...settings,
    translation: translation ?? null,
  };
}

export async function getPublicPage(locale: PublicLocale, pageKey: PageKey) {
  const page = await prisma.page.findFirst({
    where: {
      pageKey,
      ...publicEntityWhere(locale),
    },
    include: {
      heroMedia: true,
      translations: translationInclude(locale),
    },
  });

  if (!page || page.translations.length === 0) {
    return null;
  }

  return {
    ...page,
    translation: page.translations[0]!,
  };
}

export async function getHomeData(locale: PublicLocale) {
  const [page, settings, featuredCategories, featuredProducts, featuredManufacturers] =
    await Promise.all([
      getPublicPage(locale, "home"),
      getSiteChrome(locale),
      prisma.category.findMany({
        where: { ...publicEntityWhere(locale), isFeatured: true },
        include: {
          heroMedia: true,
          translations: translationInclude(locale),
        },
        orderBy: { sortOrder: "asc" },
        take: 4,
      }),
      prisma.product.findMany({
        where: {
          ...publicEntityWhere(locale),
          isFeatured: true,
          category: publicEntityWhere(locale),
          manufacturer: publicEntityWhere(locale),
        },
        include: {
          primaryImage: true,
          translations: translationInclude(locale),
          category: {
            include: {
              translations: translationInclude(locale),
            },
          },
          manufacturer: {
            include: {
              translations: translationInclude(locale),
            },
          },
        },
        orderBy: { sortOrder: "asc" },
        take: 4,
      }),
      prisma.manufacturer.findMany({
        where: { ...publicEntityWhere(locale), isFeatured: true },
        include: {
          logoMedia: true,
          translations: translationInclude(locale),
          _count: {
            select: {
              products: true,
            },
          },
        },
        orderBy: { sortOrder: "asc" },
        take: 4,
      }),
    ]);

  return {
    featuredCategories: featuredCategories.flatMap((category) => {
      const shaped = attachTranslation(category);
      return shaped ? [shaped] : [];
    }),
    featuredManufacturers: featuredManufacturers.flatMap((manufacturer) => {
      const shaped = attachTranslation(manufacturer);
      return shaped ? [shaped] : [];
    }),
    featuredProducts: featuredProducts.flatMap((product) => {
      const shaped = attachProductRelations(product);
      return shaped ? [shaped] : [];
    }),
    page,
    settings,
  };
}

export async function getProductsIndexData(locale: PublicLocale) {
  const [page, products] = await Promise.all([
    getPublicPage(locale, "products_index"),
    prisma.product.findMany({
      where: {
        ...publicEntityWhere(locale),
        category: publicEntityWhere(locale),
        manufacturer: publicEntityWhere(locale),
      },
      include: {
        primaryImage: true,
        translations: translationInclude(locale),
        category: {
          include: {
            translations: translationInclude(locale),
          },
        },
        manufacturer: {
          include: {
            translations: translationInclude(locale),
          },
        },
      },
      orderBy: [{ isFeatured: "desc" }, { sortOrder: "asc" }, { createdAt: "desc" }],
    }),
  ]);

  return {
    page,
    products: products.flatMap((product) => {
      const shaped = attachProductRelations(product);
      return shaped ? [shaped] : [];
    }),
  };
}

export async function getProductDetailData(locale: PublicLocale, slug: string) {
  const translation = await prisma.productTranslation.findFirst({
    where: {
      localeCode: locale,
      slug,
      publishStatus: PublishStatus.published,
      product: {
        ...publishedWhere,
        category: publicEntityWhere(locale),
        manufacturer: publicEntityWhere(locale),
      },
    },
    include: {
      product: {
        include: {
          primaryImage: true,
          images: {
            include: { media: true },
            orderBy: { sortOrder: "asc" },
          },
          specs: {
            where: { localeCode: locale },
            orderBy: { sortOrder: "asc" },
          },
          documents: {
            where: { isPublic: true },
            include: {
              media: true,
              translations: translationInclude(locale),
            },
            orderBy: { sortOrder: "asc" },
          },
          category: {
            include: {
              translations: translationInclude(locale),
            },
          },
          manufacturer: {
            include: {
              translations: translationInclude(locale),
            },
          },
        },
      },
    },
  });

  if (!translation) {
    return null;
  }

  const categoryTranslation = pickFirstTranslation(
    translation.product.category.translations,
  );
  const manufacturerTranslation = pickFirstTranslation(
    translation.product.manufacturer.translations,
  );

  if (!categoryTranslation || !manufacturerTranslation) {
    return null;
  }

  const relatedProducts = await prisma.product.findMany({
    where: {
      ...publicEntityWhere(locale),
      id: { not: translation.productId },
      categoryId: translation.product.categoryId,
      category: publicEntityWhere(locale),
      manufacturer: publicEntityWhere(locale),
    },
    include: {
      primaryImage: true,
      translations: translationInclude(locale),
    },
    take: 3,
  });

  return {
    product: {
      ...translation.product,
      translation,
      categoryTranslation,
      manufacturerTranslation,
      documents: getRenderablePublicDocuments(translation.product.documents),
    },
    relatedProducts: relatedProducts.flatMap((product) => {
      const shaped = attachTranslation(product);
      return shaped ? [shaped] : [];
    }),
  };
}

export async function getManufacturersIndexData(locale: PublicLocale) {
  const [page, manufacturers] = await Promise.all([
    getPublicPage(locale, "manufacturers_index"),
    prisma.manufacturer.findMany({
      where: publicEntityWhere(locale),
      include: {
        logoMedia: true,
        translations: translationInclude(locale),
        _count: {
          select: {
            products: true,
          },
        },
      },
      orderBy: [{ isFeatured: "desc" }, { sortOrder: "asc" }],
    }),
  ]);

  return {
    page,
    manufacturers: manufacturers.flatMap((manufacturer) => {
      const shaped = attachTranslation(manufacturer);
      return shaped ? [shaped] : [];
    }),
  };
}

export async function getManufacturerDetailData(
  locale: PublicLocale,
  slug: string,
) {
  const translation = await prisma.manufacturerTranslation.findFirst({
    where: {
      localeCode: locale,
      slug,
      publishStatus: PublishStatus.published,
      manufacturer: publishedWhere,
    },
    include: {
      manufacturer: {
        include: {
          logoMedia: true,
          heroMedia: true,
          products: {
            where: {
              ...publicEntityWhere(locale),
              category: publicEntityWhere(locale),
            },
            include: {
              primaryImage: true,
              translations: translationInclude(locale),
            },
            orderBy: { sortOrder: "asc" },
          },
        },
      },
    },
  });

  if (!translation) {
    return null;
  }

  return {
    manufacturer: {
      ...translation.manufacturer,
      translation,
      products: translation.manufacturer.products.flatMap((product) => {
        const shaped = attachTranslation(product);
        return shaped ? [shaped] : [];
      }),
    },
  };
}

export async function getCategoriesIndexData(locale: PublicLocale) {
  const [page, categories] = await Promise.all([
    getPublicPage(locale, "categories_index"),
    prisma.category.findMany({
      where: publicEntityWhere(locale),
      include: {
        translations: translationInclude(locale),
      },
      orderBy: [{ depth: "asc" }, { sortOrder: "asc" }],
    }),
  ]);

  const nodes = categories
    .map((category) => {
      const translation = pickFirstTranslation(category.translations);
      if (!translation) {
        return null;
      }

      return {
        id: category.id,
        name: translation.name ?? category.code,
        parentId: category.parentId,
        code: category.code,
        translation,
      };
    })
    .filter((item): item is NonNullable<typeof item> => Boolean(item));

  return {
    page,
    categoryTree: buildCategoryTree(nodes),
  };
}

export async function getCategoryDetailData(
  locale: PublicLocale,
  fullSlugPath: string,
) {
  const translation = await prisma.categoryTranslation.findFirst({
    where: {
      localeCode: locale,
      fullSlugPathCache: fullSlugPath,
      publishStatus: PublishStatus.published,
      category: publishedWhere,
    },
    include: {
      category: {
        include: {
          heroMedia: true,
          children: {
            where: {
              ...publicEntityWhere(locale),
            },
            include: {
              translations: translationInclude(locale),
            },
            orderBy: { sortOrder: "asc" },
          },
          products: {
            where: {
              ...publicEntityWhere(locale),
              manufacturer: publicEntityWhere(locale),
            },
            include: {
              primaryImage: true,
              translations: translationInclude(locale),
              manufacturer: {
                include: {
                  translations: translationInclude(locale),
                },
              },
            },
            orderBy: { sortOrder: "asc" },
          },
        },
      },
    },
  });

  if (!translation) {
    return null;
  }

  return {
    category: {
      ...translation.category,
      translation,
      children: translation.category.children.flatMap((child) => {
        const shaped = attachTranslation(child);
        return shaped ? [shaped] : [];
      }),
      products: translation.category.products.flatMap((product) => {
        const shaped = attachProductManufacturerRelation(product);
        return shaped ? [shaped] : [];
      }),
    },
  };
}
