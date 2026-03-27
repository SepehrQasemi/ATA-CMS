import {
  LocaleVisibilityStatus,
  PageKey,
  PrismaClient,
  PublishStatus,
} from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.locale.upsert({
    where: { code: "en" },
    update: {
      label: "English",
      nativeLabel: "English",
      direction: "ltr",
      visibilityStatus: LocaleVisibilityStatus.public,
      isDefaultPublic: true,
      sortOrder: 1,
    },
    create: {
      code: "en",
      label: "English",
      nativeLabel: "English",
      direction: "ltr",
      visibilityStatus: LocaleVisibilityStatus.public,
      isDefaultPublic: true,
      sortOrder: 1,
    },
  });

  await prisma.locale.upsert({
    where: { code: "fr" },
    update: {
      label: "French",
      nativeLabel: "Français",
      direction: "ltr",
      visibilityStatus: LocaleVisibilityStatus.public,
      isDefaultPublic: false,
      sortOrder: 2,
    },
    create: {
      code: "fr",
      label: "French",
      nativeLabel: "Français",
      direction: "ltr",
      visibilityStatus: LocaleVisibilityStatus.public,
      isDefaultPublic: false,
      sortOrder: 2,
    },
  });

  await prisma.locale.upsert({
    where: { code: "fa" },
    update: {
      label: "Persian",
      nativeLabel: "فارسی",
      direction: "rtl",
      visibilityStatus: LocaleVisibilityStatus.internal_only,
      isDefaultPublic: false,
      sortOrder: 3,
    },
    create: {
      code: "fa",
      label: "Persian",
      nativeLabel: "فارسی",
      direction: "rtl",
      visibilityStatus: LocaleVisibilityStatus.internal_only,
      isDefaultPublic: false,
      sortOrder: 3,
    },
  });

  const siteSettings = await prisma.siteSettings.findFirst();

  const settings =
    siteSettings ??
    (await prisma.siteSettings.create({
      data: {
        defaultLocaleCode: "en",
        publicLocalesJson: JSON.stringify(["en", "fr"]),
        contactEmail: "info@abadis-tejarat-arka.com",
        phone: "+33 1 00 00 00 00",
      },
    }));

  await prisma.siteSettingTranslation.upsert({
    where: {
      siteSettingsId_localeCode: {
        siteSettingsId: settings.id,
        localeCode: "en",
      },
    },
    update: {
      siteName: "Abadis Tejarat Arka",
      siteTagline: "B2B catalog and sourcing foundation",
      defaultMetaTitleSuffix: "Abadis Tejarat Arka",
      defaultMetaDescription:
        "Multilingual B2B catalog foundation for products, manufacturers, and inquiries.",
      footerCompanyBlurb:
        "Abadis Tejarat Arka is building a multilingual public catalog for structured B2B sourcing conversations.",
      contactIntro:
        "Use the ATA contact route for pricing requests and catalog inquiries.",
      defaultContactForPricingMessage:
        "Contact ATA for pricing and sourcing details.",
    },
    create: {
      siteSettingsId: settings.id,
      localeCode: "en",
      siteName: "Abadis Tejarat Arka",
      siteTagline: "B2B catalog and sourcing foundation",
      defaultMetaTitleSuffix: "Abadis Tejarat Arka",
      defaultMetaDescription:
        "Multilingual B2B catalog foundation for products, manufacturers, and inquiries.",
      footerCompanyBlurb:
        "Abadis Tejarat Arka is building a multilingual public catalog for structured B2B sourcing conversations.",
      contactIntro:
        "Use the ATA contact route for pricing requests and catalog inquiries.",
      defaultContactForPricingMessage:
        "Contact ATA for pricing and sourcing details.",
    },
  });

  await prisma.siteSettingTranslation.upsert({
    where: {
      siteSettingsId_localeCode: {
        siteSettingsId: settings.id,
        localeCode: "fr",
      },
    },
    update: {
      siteName: "Abadis Tejarat Arka",
      siteTagline: "Fondation catalogue B2B",
      defaultMetaTitleSuffix: "Abadis Tejarat Arka",
      defaultMetaDescription:
        "Fondation catalogue B2B multilingue pour produits, fabricants et demandes.",
      footerCompanyBlurb:
        "Abadis Tejarat Arka construit un catalogue public multilingue pour des conversations B2B structurées.",
      contactIntro:
        "Utilisez la page contact ATA pour les demandes de prix et de sourcing.",
      defaultContactForPricingMessage:
        "Contactez ATA pour le prix et les détails de sourcing.",
    },
    create: {
      siteSettingsId: settings.id,
      localeCode: "fr",
      siteName: "Abadis Tejarat Arka",
      siteTagline: "Fondation catalogue B2B",
      defaultMetaTitleSuffix: "Abadis Tejarat Arka",
      defaultMetaDescription:
        "Fondation catalogue B2B multilingue pour produits, fabricants et demandes.",
      footerCompanyBlurb:
        "Abadis Tejarat Arka construit un catalogue public multilingue pour des conversations B2B structurées.",
      contactIntro:
        "Utilisez la page contact ATA pour les demandes de prix et de sourcing.",
      defaultContactForPricingMessage:
        "Contactez ATA pour le prix et les détails de sourcing.",
    },
  });

  for (const pageKey of [
    PageKey.home,
    PageKey.about,
    PageKey.products_index,
    PageKey.categories_index,
    PageKey.manufacturers_index,
    PageKey.contact,
  ]) {
    await prisma.page.upsert({
      where: { pageKey },
      update: {
        publishStatus: PublishStatus.draft,
        isSystemPage: true,
      },
      create: {
        pageKey,
        publishStatus: PublishStatus.draft,
        isSystemPage: true,
      },
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
