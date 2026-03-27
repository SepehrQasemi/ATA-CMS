import {
  AvailabilityStatus,
  ContactRequestType,
  InquiryStatus,
  LocaleVisibilityStatus,
  MediaKind,
  PageKey,
  PrismaClient,
  ProductDocumentType,
  PublishStatus,
} from "@prisma/client";

const prisma = new PrismaClient();

const timestamp = new Date("2026-03-27T09:00:00.000Z");

function json(value: unknown) {
  return JSON.stringify(value);
}

async function resetDatabase() {
  await prisma.contactRequest.deleteMany();
  await prisma.productDocumentTranslation.deleteMany();
  await prisma.productDocument.deleteMany();
  await prisma.productSpec.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.productTranslation.deleteMany();
  await prisma.product.deleteMany();
  await prisma.manufacturerTranslation.deleteMany();
  await prisma.manufacturer.deleteMany();
  await prisma.categoryTranslation.deleteMany();
  await prisma.category.deleteMany();
  await prisma.pageTranslation.deleteMany();
  await prisma.page.deleteMany();
  await prisma.siteSettingTranslation.deleteMany();
  await prisma.siteSettings.deleteMany();
  await prisma.media.deleteMany();
  await prisma.locale.deleteMany();
}

async function seedLocales() {
  await prisma.locale.createMany({
    data: [
      {
        code: "en",
        label: "English",
        nativeLabel: "English",
        direction: "ltr",
        visibilityStatus: LocaleVisibilityStatus.public,
        isDefaultPublic: true,
        sortOrder: 1,
      },
      {
        code: "fr",
        label: "French",
        nativeLabel: "Francais",
        direction: "ltr",
        visibilityStatus: LocaleVisibilityStatus.public,
        sortOrder: 2,
      },
      {
        code: "fa",
        label: "Persian",
        nativeLabel: "Farsi",
        direction: "rtl",
        visibilityStatus: LocaleVisibilityStatus.internal_only,
        sortOrder: 3,
      },
    ],
  });
}

async function seedMedia() {
  await prisma.media.createMany({
    data: [
      {
        id: "media-share",
        kind: MediaKind.image,
        storageKey: "brand/ata-logo.svg",
        publicUrl: "/brand/ata-logo.svg",
        mimeType: "image/svg+xml",
        title: "ATA brand mark",
        originalFilename: "ata-logo.svg",
      },
      {
        id: "media-product-citric",
        kind: MediaKind.image,
        storageKey: "catalog/citric-acid-monohydrate.svg",
        publicUrl: "/catalog/citric-acid-monohydrate.svg",
        mimeType: "image/svg+xml",
        title: "Citric acid monohydrate",
        originalFilename: "citric-acid-monohydrate.svg",
      },
      {
        id: "media-product-sodium",
        kind: MediaKind.image,
        storageKey: "catalog/sodium-bicarbonate.svg",
        publicUrl: "/catalog/sodium-bicarbonate.svg",
        mimeType: "image/svg+xml",
        title: "Sodium bicarbonate",
        originalFilename: "sodium-bicarbonate.svg",
      },
      {
        id: "media-product-sorbic",
        kind: MediaKind.image,
        storageKey: "catalog/sorbic-acid.svg",
        publicUrl: "/catalog/sorbic-acid.svg",
        mimeType: "image/svg+xml",
        title: "Sorbic acid",
        originalFilename: "sorbic-acid.svg",
      },
      {
        id: "media-manufacturer-meridian",
        kind: MediaKind.image,
        storageKey: "catalog/meridian-bio.svg",
        publicUrl: "/catalog/meridian-bio.svg",
        mimeType: "image/svg+xml",
        title: "Meridian Bio",
        originalFilename: "meridian-bio.svg",
      },
      {
        id: "media-manufacturer-nordic",
        kind: MediaKind.image,
        storageKey: "catalog/nordic-ingredients.svg",
        publicUrl: "/catalog/nordic-ingredients.svg",
        mimeType: "image/svg+xml",
        title: "Nordic Ingredients",
        originalFilename: "nordic-ingredients.svg",
      },
      {
        id: "media-manufacturer-arka",
        kind: MediaKind.image,
        storageKey: "catalog/arka-process.svg",
        publicUrl: "/catalog/arka-process.svg",
        mimeType: "image/svg+xml",
        title: "Arka Process",
        originalFilename: "arka-process.svg",
      },
      {
        id: "media-doc-citric",
        kind: MediaKind.document,
        storageKey: "documents/citric-acid-datasheet.txt",
        publicUrl: "/documents/citric-acid-datasheet.txt",
        mimeType: "text/plain",
        title: "Citric acid datasheet",
        originalFilename: "citric-acid-datasheet.txt",
      },
      {
        id: "media-doc-sodium",
        kind: MediaKind.document,
        storageKey: "documents/sodium-bicarbonate-brochure.txt",
        publicUrl: "/documents/sodium-bicarbonate-brochure.txt",
        mimeType: "text/plain",
        title: "Sodium bicarbonate brochure",
        originalFilename: "sodium-bicarbonate-brochure.txt",
      },
    ],
  });
}

async function seedSettings() {
  await prisma.siteSettings.create({
    data: {
      id: "site-settings",
      defaultLocaleCode: "en",
      publicLocalesJson: json(["en", "fr"]),
      contactEmail: "sales@abadis-tejarat-arka.com",
      phone: "+33 1 84 80 12 34",
      addressJson: json({
        city: "Paris",
        country: "France",
        line1: "Rue du Commerce",
      }),
      socialLinksJson: json({
        linkedin: "https://www.linkedin.com/company/abadis-tejarat-arka",
      }),
      mainNavigationJson: json([
        { pageKey: "about", label: { en: "About", fr: "A propos" } },
        { pageKey: "products_index", label: { en: "Products", fr: "Produits" } },
        {
          pageKey: "manufacturers_index",
          label: { en: "Manufacturers", fr: "Fabricants" },
        },
        { pageKey: "contact", label: { en: "Contact", fr: "Contact" } },
      ]),
      footerNavigationJson: json([
        { pageKey: "about", group: "company" },
        { pageKey: "products_index", group: "catalog" },
        { pageKey: "contact", group: "contact" },
      ]),
      defaultShareImageMediaId: "media-share",
      searchConsoleVerification: "ata-local-dev-verification",
      translations: {
        create: [
          {
            localeCode: "en",
            siteName: "Abadis Tejarat Arka",
            siteTagline: "Manufacturer-aware sourcing catalog",
            defaultMetaTitleSuffix: "Abadis Tejarat Arka",
            defaultMetaDescription:
              "Multilingual B2B catalog for industrial and food ingredient sourcing.",
            footerCompanyBlurb:
              "ATA connects buyers with manufacturer-led product information and inquiry handling.",
            contactIntro:
              "Use the inquiry form for pricing, sourcing, and technical documentation requests.",
            defaultContactForPricingMessage:
              "Contact ATA for pricing, lead time, and sourcing details.",
          },
          {
            localeCode: "fr",
            siteName: "Abadis Tejarat Arka",
            siteTagline: "Catalogue B2B oriente fabricants",
            defaultMetaTitleSuffix: "Abadis Tejarat Arka",
            defaultMetaDescription:
              "Catalogue B2B multilingue pour le sourcing de produits industriels et ingredients.",
            footerCompanyBlurb:
              "ATA structure la decouverte produit, les profils fabricants et les demandes de contact.",
            contactIntro:
              "Utilisez le formulaire pour les demandes de prix, de sourcing et de documentation.",
            defaultContactForPricingMessage:
              "Contactez ATA pour le prix, le delai et les details de sourcing.",
          },
          {
            localeCode: "fa",
            siteName: "Abadis Tejarat Arka",
            siteTagline: "Internal Farsi draft",
            defaultMetaTitleSuffix: "Abadis Tejarat Arka",
            defaultMetaDescription: "Internal-only Farsi configuration.",
            footerCompanyBlurb: "Internal-only Farsi configuration.",
            contactIntro: "Internal-only Farsi configuration.",
            defaultContactForPricingMessage: "Internal-only Farsi configuration.",
          },
        ],
      },
    },
  });
}

async function seedPages() {
  const pages = [
    {
      id: "page-home",
      pageKey: PageKey.home,
      showInNavigation: false,
      translations: [
        {
          localeCode: "en",
          title: "Abadis Tejarat Arka",
          summary: "B2B product sourcing and catalog publishing for industrial buyers.",
          heroHeading: "Manufacturer-aware sourcing for serious B2B buying teams.",
          seoTitle: "Abadis Tejarat Arka | Industrial product sourcing",
          seoDescription:
            "Discover categories, manufacturers, and products with structured inquiry workflows.",
          publishStatus: PublishStatus.published,
          contentBlocksJson: json([{ type: "hero" }, { type: "featured" }, { type: "trust" }]),
        },
        {
          localeCode: "fr",
          title: "Abadis Tejarat Arka",
          summary: "Catalogue B2B pour le sourcing de produits industriels.",
          heroHeading: "Un sourcing structure pour les equipes achat B2B.",
          seoTitle: "Abadis Tejarat Arka | Sourcing industriel",
          seoDescription:
            "Explorez categories, fabricants et produits avec un parcours de demande structure.",
          publishStatus: PublishStatus.published,
          contentBlocksJson: json([{ type: "hero" }, { type: "featured" }, { type: "trust" }]),
        },
        {
          localeCode: "fa",
          title: "ATA Home Draft",
          summary: "Internal only",
          heroHeading: "Internal only",
          seoTitle: "ATA Home Draft",
          seoDescription: "Internal only",
          publishStatus: PublishStatus.review,
          contentBlocksJson: json([{ type: "hero" }]),
        },
      ],
    },
    {
      id: "page-about",
      pageKey: PageKey.about,
      showInNavigation: true,
      translations: [
        {
          localeCode: "en",
          title: "About",
          slug: "about",
          summary: "About ATA",
          seoTitle: "About ATA",
          seoDescription: "Learn about ATA, its sourcing approach, and its catalog focus.",
          publishStatus: PublishStatus.published,
          contentBlocksJson: json([{ type: "intro" }, { type: "strengths" }]),
        },
        {
          localeCode: "fr",
          title: "A propos",
          slug: "a-propos",
          summary: "A propos de ATA",
          seoTitle: "A propos de ATA",
          seoDescription:
            "Decouvrez ATA, son approche de sourcing et sa logique catalogue.",
          publishStatus: PublishStatus.published,
          contentBlocksJson: json([{ type: "intro" }, { type: "strengths" }]),
        },
        {
          localeCode: "fa",
          title: "About Draft",
          slug: "about-draft",
          summary: "Internal only",
          seoTitle: "About Draft",
          seoDescription: "Internal only",
          publishStatus: PublishStatus.review,
          contentBlocksJson: json([{ type: "intro" }]),
        },
      ],
    },
    ...[
      { id: "page-products", key: PageKey.products_index, en: "products", fr: "produits" },
      { id: "page-categories", key: PageKey.categories_index, en: "categories", fr: "categories" },
      {
        id: "page-manufacturers",
        key: PageKey.manufacturers_index,
        en: "manufacturers",
        fr: "fabricants",
      },
      { id: "page-contact", key: PageKey.contact, en: "contact", fr: "contact" },
    ].map((page) => ({
      id: page.id,
      pageKey: page.key,
      showInNavigation: true,
      translations: [
        {
          localeCode: "en",
          title: page.en.replace(/-/g, " "),
          slug: page.en,
          summary: `ATA ${page.en.replace(/-/g, " ")} page`,
          seoTitle: `ATA ${page.en.replace(/-/g, " ")}`,
          seoDescription: `Structured ATA ${page.en.replace(/-/g, " ")} page.`,
          publishStatus: PublishStatus.published,
          contentBlocksJson: json([{ type: "intro" }]),
        },
        {
          localeCode: "fr",
          title: page.fr.replace(/-/g, " "),
          slug: page.fr,
          summary: `Page ATA ${page.fr.replace(/-/g, " ")}`,
          seoTitle: `ATA ${page.fr.replace(/-/g, " ")}`,
          seoDescription: `Page structuree ATA ${page.fr.replace(/-/g, " ")}.`,
          publishStatus: PublishStatus.published,
          contentBlocksJson: json([{ type: "intro" }]),
        },
        {
          localeCode: "fa",
          title: `${page.id} draft`,
          slug: `${page.id}-draft`,
          summary: "Internal only",
          seoTitle: `${page.id} draft`,
          seoDescription: "Internal only",
          publishStatus: PublishStatus.review,
          contentBlocksJson: json([{ type: "draft" }]),
        },
      ],
    })),
  ];

  for (const page of pages) {
    await prisma.page.create({
      data: {
        id: page.id,
        pageKey: page.pageKey,
        publishStatus: PublishStatus.published,
        isSystemPage: true,
        showInNavigation: page.showInNavigation,
        translations: { create: page.translations },
      },
    });
  }
}

async function seedCategoriesAndManufacturers() {
  await prisma.category.create({
    data: {
      id: "cat-food-additives",
      code: "food-additives",
      publishStatus: PublishStatus.published,
      isFeatured: true,
      heroMediaId: "media-product-citric",
      translations: {
        create: [
          {
            localeCode: "en",
            name: "Food Additives",
            slugSegment: "food-additives",
            fullSlugPathCache: "food-additives",
            shortDescription: "Ingredients for preservation, acidity control, and formulation.",
            body: "A focused branch for food ingredient buyers seeking structured supplier conversations.",
            seoTitle: "Food Additives",
            seoDescription: "Food additive catalog branch for B2B inquiry-led sourcing.",
            publishStatus: PublishStatus.published,
          },
          {
            localeCode: "fr",
            name: "Additifs Alimentaires",
            slugSegment: "additifs-alimentaires",
            fullSlugPathCache: "additifs-alimentaires",
            shortDescription: "Ingredients pour conservation, acidite et formulation.",
            body: "Une branche catalogue orientee acheteurs B2B et demandes structurees.",
            seoTitle: "Additifs Alimentaires",
            seoDescription: "Branche catalogue B2B pour les additifs alimentaires.",
            publishStatus: PublishStatus.published,
          },
          {
            localeCode: "fa",
            name: "Food Additives Draft",
            slugSegment: "food-additives-draft",
            fullSlugPathCache: "food-additives-draft",
            shortDescription: "Internal only",
            body: "Internal only",
            seoTitle: "Food Additives Draft",
            seoDescription: "Internal only",
            publishStatus: PublishStatus.review,
          },
        ],
      },
    },
  });

  await prisma.category.createMany({
    data: [
      {
        id: "cat-acidity-regulators",
        code: "acidity-regulators",
        parentId: "cat-food-additives",
        publishStatus: PublishStatus.published,
        depth: 1,
        sortOrder: 1,
        isFeatured: true,
      },
      {
        id: "cat-preservatives",
        code: "preservatives",
        parentId: "cat-food-additives",
        publishStatus: PublishStatus.published,
        depth: 1,
        sortOrder: 2,
      },
      {
        id: "cat-industrial-compounds",
        code: "industrial-compounds",
        publishStatus: PublishStatus.published,
        sortOrder: 3,
        heroMediaId: "media-product-sodium",
      },
    ],
  });

  await prisma.categoryTranslation.createMany({
    data: [
      {
        categoryId: "cat-acidity-regulators",
        localeCode: "en",
        name: "Acidity Regulators",
        slugSegment: "acidity-regulators",
        fullSlugPathCache: "food-additives/acidity-regulators",
        shortDescription: "Citric and buffering ingredients for food systems.",
        body: "Localized landing content for acidity regulators with technical buying context.",
        seoTitle: "Acidity Regulators",
        seoDescription: "B2B acidity regulator category with structured product discovery.",
        publishStatus: PublishStatus.published,
      },
      {
        categoryId: "cat-acidity-regulators",
        localeCode: "fr",
        name: "Regulateurs D Acidite",
        slugSegment: "regulateurs-d-acidite",
        fullSlugPathCache: "additifs-alimentaires/regulateurs-d-acidite",
        shortDescription: "Ingredients acides et tampons pour systemes alimentaires.",
        body: "Contenu localise pour les acheteurs a la recherche de regulateurs d acidite.",
        seoTitle: "Regulateurs D Acidite",
        seoDescription: "Categorie B2B de regulateurs d acidite.",
        publishStatus: PublishStatus.published,
      },
      {
        categoryId: "cat-preservatives",
        localeCode: "en",
        name: "Preservatives",
        slugSegment: "preservatives",
        fullSlugPathCache: "food-additives/preservatives",
        shortDescription: "Shelf-life oriented ingredients and preservation support.",
        body: "Localized landing content for preservative-oriented sourcing projects.",
        seoTitle: "Preservatives",
        seoDescription: "Preservative products and inquiry-led sourcing.",
        publishStatus: PublishStatus.published,
      },
      {
        categoryId: "cat-preservatives",
        localeCode: "fr",
        name: "Conservateurs",
        slugSegment: "conservateurs",
        fullSlugPathCache: "additifs-alimentaires/conservateurs",
        shortDescription: "Ingredients pour la stabilite et la conservation.",
        body: "Contenu localise pour les besoins B2B autour des conservateurs.",
        seoTitle: "Conservateurs",
        seoDescription: "Categorie B2B de conservateurs.",
        publishStatus: PublishStatus.published,
      },
      {
        categoryId: "cat-industrial-compounds",
        localeCode: "en",
        name: "Industrial Compounds",
        slugSegment: "industrial-compounds",
        fullSlugPathCache: "industrial-compounds",
        shortDescription: "Utility compounds for industrial process and treatment use cases.",
        body: "Industrial catalog branch focused on documentation-aware sourcing.",
        seoTitle: "Industrial Compounds",
        seoDescription: "Industrial compounds with inquiry-led product discovery.",
        publishStatus: PublishStatus.published,
      },
      {
        categoryId: "cat-industrial-compounds",
        localeCode: "fr",
        name: "Composes Industriels",
        slugSegment: "composes-industriels",
        fullSlugPathCache: "composes-industriels",
        shortDescription: "Composes pour usages process et techniques.",
        body: "Branche catalogue industrielle avec logique de demande structuree.",
        seoTitle: "Composes Industriels",
        seoDescription: "Composes industriels pour la decouverte produit B2B.",
        publishStatus: PublishStatus.published,
      },
    ],
  });

  for (const manufacturer of [
    {
      id: "manufacturer-meridian",
      code: "meridian-bio",
      logoMediaId: "media-manufacturer-meridian",
      originCountry: "Belgium",
      websiteUrl: "https://example.com/meridian-bio",
      translations: [
        {
          localeCode: "en",
          name: "Meridian Bio",
          slug: "meridian-bio",
          summary: "European producer focused on ingredient-grade acids and stabilizers.",
          body: "Manufacturer profile with sourcing context, production discipline, and export readiness.",
          seoTitle: "Meridian Bio",
          seoDescription: "Manufacturer profile for Meridian Bio products.",
          certificationsText: "ISO 9001, HACCP",
          publishStatus: PublishStatus.published,
        },
        {
          localeCode: "fr",
          name: "Meridian Bio",
          slug: "meridian-bio",
          summary: "Producteur europeen d acides et stabilisants.",
          body: "Profil fabricant avec contexte de sourcing et discipline de production.",
          seoTitle: "Meridian Bio",
          seoDescription: "Profil fabricant pour les produits Meridian Bio.",
          certificationsText: "ISO 9001, HACCP",
          publishStatus: PublishStatus.published,
        },
        {
          localeCode: "fa",
          name: "Meridian Bio Draft",
          slug: "meridian-bio-draft",
          summary: "Internal only",
          body: "Internal only",
          seoTitle: "Meridian Bio Draft",
          seoDescription: "Internal only",
          publishStatus: PublishStatus.review,
        },
      ],
    },
    {
      id: "manufacturer-nordic",
      code: "nordic-ingredients",
      logoMediaId: "media-manufacturer-nordic",
      originCountry: "Denmark",
      websiteUrl: "https://example.com/nordic-ingredients",
      translations: [
        {
          localeCode: "en",
          name: "Nordic Ingredients",
          slug: "nordic-ingredients",
          summary: "Specialist producer for preservation and shelf-life support products.",
          body: "Manufacturer profile oriented around documentation quality and stable batch communication.",
          seoTitle: "Nordic Ingredients",
          seoDescription: "Manufacturer profile for Nordic Ingredients.",
          publishStatus: PublishStatus.published,
        },
        {
          localeCode: "fr",
          name: "Nordic Ingredients",
          slug: "nordic-ingredients",
          summary: "Producteur specialise dans la conservation.",
          body: "Profil fabricant axe qualite documentaire et communication produit.",
          seoTitle: "Nordic Ingredients",
          seoDescription: "Profil fabricant Nordic Ingredients.",
          publishStatus: PublishStatus.published,
        },
      ],
    },
    {
      id: "manufacturer-arka",
      code: "arka-process",
      logoMediaId: "media-manufacturer-arka",
      originCountry: "Turkiye",
      websiteUrl: "https://example.com/arka-process",
      translations: [
        {
          localeCode: "en",
          name: "Arka Process",
          slug: "arka-process",
          summary: "Regional process-oriented producer for utility compounds.",
          body: "Manufacturer profile focused on practical industrial formulations and inquiry support.",
          seoTitle: "Arka Process",
          seoDescription: "Manufacturer profile for Arka Process.",
          publishStatus: PublishStatus.published,
        },
        {
          localeCode: "fr",
          name: "Arka Process",
          slug: "arka-process",
          summary: "Producteur regional de composes utilitaires.",
          body: "Profil fabricant oriente usages process et support de demande.",
          seoTitle: "Arka Process",
          seoDescription: "Profil fabricant pour Arka Process.",
          publishStatus: PublishStatus.published,
        },
      ],
    },
  ]) {
    await prisma.manufacturer.create({
      data: {
        id: manufacturer.id,
        code: manufacturer.code,
        publishStatus: PublishStatus.published,
        logoMediaId: manufacturer.logoMediaId,
        originCountry: manufacturer.originCountry,
        websiteUrl: manufacturer.websiteUrl,
        isFeatured: true,
        translations: { create: manufacturer.translations },
      },
    });
  }
}

async function seedProducts() {
  await prisma.product.create({
    data: {
      id: "product-citric-acid",
      sku: "ATA-CIT-001",
      categoryId: "cat-acidity-regulators",
      manufacturerId: "manufacturer-meridian",
      publishStatus: PublishStatus.published,
      availabilityStatus: AvailabilityStatus.in_stock,
      publicPriceAmount: 21.5,
      publicPriceCurrency: "USD",
      publicPriceUnitLabel: "kg",
      priceLastVerifiedAt: timestamp,
      isFeatured: true,
      primaryImageMediaId: "media-product-citric",
      translations: {
        create: [
          {
            localeCode: "en",
            name: "Citric Acid Monohydrate",
            slug: "citric-acid-monohydrate",
            shortDescription: "Food-grade acidity regulator for beverage, confectionery, and dry mix systems.",
            longDescription: "Structured product page content for a high-volume acidity regulator with documentation support.",
            availabilityNote: "Available for regular export-oriented inquiries.",
            seoTitle: "Citric Acid Monohydrate",
            seoDescription: "Citric acid monohydrate with manufacturer context and inquiry workflow.",
            publishStatus: PublishStatus.published,
          },
          {
            localeCode: "fr",
            name: "Acide Citrique Monohydrate",
            slug: "acide-citrique-monohydrate",
            shortDescription: "Regulateur d acidite pour boissons, confiserie et melanges secs.",
            longDescription: "Contenu produit structure avec support documentaire et contexte fabricant.",
            availabilityNote: "Disponible pour demandes export structurees.",
            seoTitle: "Acide Citrique Monohydrate",
            seoDescription: "Acide citrique monohydrate avec contexte fabricant et demande B2B.",
            publishStatus: PublishStatus.published,
          },
          {
            localeCode: "fa",
            name: "Citric Acid Draft",
            slug: "citric-acid-draft",
            shortDescription: "Internal only",
            longDescription: "Internal only",
            contactForPricingMessage: "Internal only",
            seoTitle: "Citric Acid Draft",
            seoDescription: "Internal only",
            publishStatus: PublishStatus.review,
          },
        ],
      },
      images: {
        create: [{ mediaId: "media-product-citric", sortOrder: 1, isPrimary: true }],
      },
      specs: {
        create: [
          { localeCode: "en", label: "Purity", value: "99.5", unit: "%", sortOrder: 1, isHighlight: true },
          { localeCode: "en", label: "Mesh", value: "8-40", sortOrder: 2 },
          { localeCode: "fr", label: "Purete", value: "99.5", unit: "%", sortOrder: 1, isHighlight: true },
          { localeCode: "fr", label: "Granulometrie", value: "8-40", sortOrder: 2 },
        ],
      },
      documents: {
        create: [
          {
            mediaId: "media-doc-citric",
            documentType: ProductDocumentType.datasheet,
            isPublic: true,
            sortOrder: 1,
            translations: {
              create: [
                {
                  localeCode: "en",
                  label: "Citric acid datasheet",
                  description: "Technical and handling summary.",
                  publishStatus: PublishStatus.published,
                },
                {
                  localeCode: "fr",
                  label: "Fiche technique acide citrique",
                  description: "Resume technique et de manipulation.",
                  publishStatus: PublishStatus.published,
                },
                {
                  localeCode: "fa",
                  label: "Citric datasheet draft",
                  description: "Internal only",
                  publishStatus: PublishStatus.review,
                },
              ],
            },
          },
        ],
      },
    },
  });

  await prisma.product.create({
    data: {
      id: "product-sorbic-acid",
      sku: "ATA-SOR-004",
      categoryId: "cat-preservatives",
      manufacturerId: "manufacturer-nordic",
      publishStatus: PublishStatus.published,
      availabilityStatus: AvailabilityStatus.out_of_stock,
      isFeatured: true,
      primaryImageMediaId: "media-product-sorbic",
      translations: {
        create: [
          {
            localeCode: "en",
            name: "Sorbic Acid",
            slug: "sorbic-acid",
            shortDescription: "Preservative ingredient for shelf-life management in formulated products.",
            longDescription: "Inquiry-led sourcing page for preservative buyers who need documentation and availability checks.",
            availabilityNote: "Currently unavailable but can be monitored on request.",
            contactForPricingMessage: "Contact ATA for future availability and pricing guidance.",
            seoTitle: "Sorbic Acid",
            seoDescription: "Sorbic acid product page with inquiry-first sourcing posture.",
            publishStatus: PublishStatus.published,
          },
          {
            localeCode: "fr",
            name: "Acide Sorbique",
            slug: "acide-sorbique",
            shortDescription: "Ingredient conservateur pour la gestion de la duree de vie.",
            longDescription: "Page de sourcing orientee demande avec verification de disponibilite.",
            availabilityNote: "Actuellement indisponible mais suivi possible sur demande.",
            contactForPricingMessage: "Contactez ATA pour le prix et le suivi de disponibilite.",
            seoTitle: "Acide Sorbique",
            seoDescription: "Page produit acide sorbique oriente demande B2B.",
            publishStatus: PublishStatus.published,
          },
        ],
      },
      images: {
        create: [{ mediaId: "media-product-sorbic", sortOrder: 1, isPrimary: true }],
      },
      specs: {
        create: [
          { localeCode: "en", label: "Assay", value: "99.0", unit: "%", sortOrder: 1, isHighlight: true },
          { localeCode: "fr", label: "Dosage", value: "99.0", unit: "%", sortOrder: 1, isHighlight: true },
        ],
      },
    },
  });

  await prisma.product.create({
    data: {
      id: "product-sodium-bicarbonate",
      sku: "ATA-SOD-012",
      categoryId: "cat-industrial-compounds",
      manufacturerId: "manufacturer-arka",
      publishStatus: PublishStatus.published,
      availabilityStatus: AvailabilityStatus.available_on_request,
      publicPriceAmount: 14.25,
      publicPriceCurrency: "EUR",
      publicPriceUnitLabel: "25 kg bag",
      priceLastVerifiedAt: timestamp,
      primaryImageMediaId: "media-product-sodium",
      translations: {
        create: [
          {
            localeCode: "en",
            name: "Sodium Bicarbonate",
            slug: "sodium-bicarbonate",
            shortDescription: "Utility compound for industrial processing and treatment programs.",
            longDescription: "Structured product page for industrial buyers needing documentation and pack-size clarity.",
            availabilityNote: "Quoted on request based on batch and packaging plan.",
            seoTitle: "Sodium Bicarbonate",
            seoDescription: "Sodium bicarbonate product page with informational pricing.",
            publishStatus: PublishStatus.published,
          },
          {
            localeCode: "fr",
            name: "Bicarbonate De Sodium",
            slug: "bicarbonate-de-sodium",
            shortDescription: "Compose utilitaire pour usages industriels et process.",
            longDescription: "Page produit structuree pour les acheteurs ayant besoin de documentation et de precision de conditionnement.",
            availabilityNote: "Cotations confirmees sur demande selon lot et emballage.",
            seoTitle: "Bicarbonate De Sodium",
            seoDescription: "Page produit bicarbonate de sodium avec prix informatif.",
            publishStatus: PublishStatus.published,
          },
        ],
      },
      images: {
        create: [{ mediaId: "media-product-sodium", sortOrder: 1, isPrimary: true }],
      },
      specs: {
        create: [
          { localeCode: "en", label: "Purity", value: "99.0", unit: "%", sortOrder: 1, isHighlight: true },
          { localeCode: "fr", label: "Purete", value: "99.0", unit: "%", sortOrder: 1, isHighlight: true },
        ],
      },
      documents: {
        create: [
          {
            mediaId: "media-doc-sodium",
            documentType: ProductDocumentType.brochure,
            isPublic: true,
            sortOrder: 1,
            translations: {
              create: [
                {
                  localeCode: "en",
                  label: "Sodium bicarbonate brochure",
                  description: "Pack size, use case, and handling summary.",
                  publishStatus: PublishStatus.published,
                },
                {
                  localeCode: "fr",
                  label: "Brochure bicarbonate de sodium",
                  description: "Resume usage, conditionnement et manipulation.",
                  publishStatus: PublishStatus.published,
                },
              ],
            },
          },
        ],
      },
    },
  });
}

async function seedInquiries() {
  await prisma.contactRequest.createMany({
    data: [
      {
        id: "inquiry-citric",
        requestType: ContactRequestType.pricing_request,
        status: InquiryStatus.new,
        sourceLocaleCode: "en",
        sourcePageId: "page-contact",
        productId: "product-citric-acid",
        manufacturerId: "manufacturer-meridian",
        companyName: "North Ridge Foods",
        contactName: "Amelia Hart",
        email: "amelia@northridge.example",
        country: "United Kingdom",
        message: "Need pricing and lead time for a beverage formulation program.",
        consentToContact: true,
        utmSource: "google",
        utmMedium: "organic",
        utmCampaign: "citric-acid",
      },
      {
        id: "inquiry-sodium",
        requestType: ContactRequestType.product_inquiry,
        status: InquiryStatus.qualified,
        sourceLocaleCode: "fr",
        sourcePageId: "page-products",
        productId: "product-sodium-bicarbonate",
        manufacturerId: "manufacturer-arka",
        companyName: "Atelier Process",
        contactName: "Julien Morel",
        email: "julien@atelier-process.example",
        phone: "+33 6 01 02 03 04",
        country: "France",
        message: "Merci de partager la brochure et la disponibilite par lot.",
        consentToContact: true,
        utmSource: "linkedin",
        utmMedium: "social",
      },
      {
        id: "inquiry-general",
        requestType: ContactRequestType.general,
        status: InquiryStatus.answered,
        sourceLocaleCode: "en",
        sourcePageId: "page-about",
        companyName: "Baltic Formulations",
        contactName: "Eric Bowman",
        email: "eric@baltic-formulations.example",
        country: "Poland",
        message: "Looking for support on a small portfolio review across preservatives.",
        consentToContact: true,
      },
    ],
  });
}

async function main() {
  await resetDatabase();
  await seedLocales();
  await seedMedia();
  await seedSettings();
  await seedPages();
  await seedCategoriesAndManufacturers();
  await seedProducts();
  await seedInquiries();
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
