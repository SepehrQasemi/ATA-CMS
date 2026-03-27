import { type PageKey, PublishStatus } from "@prisma/client";

import { prisma } from "@/lib/db";
import { buildCategoryTree } from "@/lib/domain/category-tree";
import type { PublicLocale } from "@/lib/i18n/config";

const publishedWhere = { publishStatus: PublishStatus.published } as const;

function localeWhere(locale: PublicLocale) {
  return {
    localeCode: locale,
    publishStatus: PublishStatus.published,
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
    translation,
  };
}

export async function getPublicPage(locale: PublicLocale, pageKey: PageKey) {
  const page = await prisma.page.findFirst({
    where: {
      pageKey,
      ...publishedWhere,
      translations: {
        some: localeWhere(locale),
      },
    },
    include: {
      heroMedia: true,
      translations: {
        where: { localeCode: locale },
        take: 1,
      },
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
        where: {
          ...publishedWhere,
          isFeatured: true,
          translations: {
            some: localeWhere(locale),
          },
        },
        include: {
          heroMedia: true,
          translations: {
            where: { localeCode: locale },
            take: 1,
          },
        },
        orderBy: { sortOrder: "asc" },
        take: 4,
      }),
      prisma.product.findMany({
        where: {
          ...publishedWhere,
          isFeatured: true,
          translations: {
            some: localeWhere(locale),
          },
        },
        include: {
          primaryImage: true,
          translations: {
            where: { localeCode: locale },
            take: 1,
          },
          category: {
            include: {
              translations: {
                where: { localeCode: locale },
                take: 1,
              },
            },
          },
          manufacturer: {
            include: {
              translations: {
                where: { localeCode: locale },
                take: 1,
              },
            },
          },
        },
        orderBy: { sortOrder: "asc" },
        take: 4,
      }),
      prisma.manufacturer.findMany({
        where: {
          ...publishedWhere,
          isFeatured: true,
          translations: {
            some: localeWhere(locale),
          },
        },
        include: {
          logoMedia: true,
          translations: {
            where: { localeCode: locale },
            take: 1,
          },
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
    featuredCategories: featuredCategories.map((category) => ({
      ...category,
      translation: category.translations[0]!,
    })),
    featuredManufacturers: featuredManufacturers.map((manufacturer) => ({
      ...manufacturer,
      translation: manufacturer.translations[0]!,
    })),
    featuredProducts: featuredProducts.map((product) => ({
      ...product,
      translation: product.translations[0]!,
      categoryTranslation: product.category.translations[0]!,
      manufacturerTranslation: product.manufacturer.translations[0]!,
    })),
    page,
    settings,
  };
}

export async function getProductsIndexData(locale: PublicLocale) {
  const [page, products] = await Promise.all([
    getPublicPage(locale, "products_index"),
    prisma.product.findMany({
      where: {
        ...publishedWhere,
        translations: {
          some: localeWhere(locale),
        },
      },
      include: {
        primaryImage: true,
        translations: {
          where: { localeCode: locale },
          take: 1,
        },
        category: {
          include: {
            translations: {
              where: { localeCode: locale },
              take: 1,
            },
          },
        },
        manufacturer: {
          include: {
            translations: {
              where: { localeCode: locale },
              take: 1,
            },
          },
        },
      },
      orderBy: [{ isFeatured: "desc" }, { sortOrder: "asc" }, { createdAt: "desc" }],
    }),
  ]);

  return {
    page,
    products: products.map((product) => ({
      ...product,
      translation: product.translations[0]!,
      categoryTranslation: product.category.translations[0]!,
      manufacturerTranslation: product.manufacturer.translations[0]!,
    })),
  };
}

export async function getProductDetailData(locale: PublicLocale, slug: string) {
  const translation = await prisma.productTranslation.findFirst({
    where: {
      localeCode: locale,
      slug,
      publishStatus: PublishStatus.published,
      product: publishedWhere,
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
              translations: {
                where: { localeCode: locale },
                take: 1,
              },
            },
            orderBy: { sortOrder: "asc" },
          },
          category: {
            include: {
              translations: {
                where: { localeCode: locale },
                take: 1,
              },
            },
          },
          manufacturer: {
            include: {
              translations: {
                where: { localeCode: locale },
                take: 1,
              },
            },
          },
        },
      },
    },
  });

  if (!translation) {
    return null;
  }

  const relatedProducts = await prisma.product.findMany({
    where: {
      ...publishedWhere,
      id: { not: translation.productId },
      categoryId: translation.product.categoryId,
      translations: {
        some: localeWhere(locale),
      },
    },
    include: {
      primaryImage: true,
      translations: {
        where: { localeCode: locale },
        take: 1,
      },
    },
    take: 3,
  });

  return {
    product: {
      ...translation.product,
      translation,
      categoryTranslation: translation.product.category.translations[0]!,
      manufacturerTranslation: translation.product.manufacturer.translations[0]!,
      documents: translation.product.documents.map((document) => ({
        ...document,
        translation: document.translations[0] ?? null,
      })),
    },
    relatedProducts: relatedProducts.map((product) => ({
      ...product,
      translation: product.translations[0]!,
    })),
  };
}

export async function getManufacturersIndexData(locale: PublicLocale) {
  const [page, manufacturers] = await Promise.all([
    getPublicPage(locale, "manufacturers_index"),
    prisma.manufacturer.findMany({
      where: {
        ...publishedWhere,
        translations: {
          some: localeWhere(locale),
        },
      },
      include: {
        logoMedia: true,
        translations: {
          where: { localeCode: locale },
          take: 1,
        },
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
    manufacturers: manufacturers.map((manufacturer) => ({
      ...manufacturer,
      translation: manufacturer.translations[0]!,
    })),
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
              ...publishedWhere,
              translations: {
                some: localeWhere(locale),
              },
            },
            include: {
              primaryImage: true,
              translations: {
                where: { localeCode: locale },
                take: 1,
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
    manufacturer: {
      ...translation.manufacturer,
      translation,
      products: translation.manufacturer.products.map((product) => ({
        ...product,
        translation: product.translations[0]!,
      })),
    },
  };
}

export async function getCategoriesIndexData(locale: PublicLocale) {
  const [page, categories] = await Promise.all([
    getPublicPage(locale, "categories_index"),
    prisma.category.findMany({
      where: {
        ...publishedWhere,
        translations: {
          some: localeWhere(locale),
        },
      },
      include: {
        translations: {
          where: { localeCode: locale },
          take: 1,
        },
      },
      orderBy: [{ depth: "asc" }, { sortOrder: "asc" }],
    }),
  ]);

  const nodes = categories.map((category) => ({
    id: category.id,
    name: category.translations[0]?.name ?? category.code,
    parentId: category.parentId,
    code: category.code,
    translation: category.translations[0]!,
  }));

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
              ...publishedWhere,
              translations: {
                some: localeWhere(locale),
              },
            },
            include: {
              translations: {
                where: { localeCode: locale },
                take: 1,
              },
            },
            orderBy: { sortOrder: "asc" },
          },
          products: {
            where: {
              ...publishedWhere,
              translations: {
                some: localeWhere(locale),
              },
            },
            include: {
              primaryImage: true,
              translations: {
                where: { localeCode: locale },
                take: 1,
              },
              manufacturer: {
                include: {
                  translations: {
                    where: { localeCode: locale },
                    take: 1,
                  },
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
      children: translation.category.children.map((child) => ({
        ...child,
        translation: child.translations[0]!,
      })),
      products: translation.category.products.map((product) => ({
        ...product,
        translation: product.translations[0]!,
        manufacturerTranslation: product.manufacturer.translations[0]!,
      })),
    },
  };
}
