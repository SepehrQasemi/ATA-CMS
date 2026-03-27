-- CreateTable
CREATE TABLE "locales" (
    "code" TEXT NOT NULL PRIMARY KEY,
    "label" TEXT NOT NULL,
    "nativeLabel" TEXT,
    "direction" TEXT NOT NULL,
    "visibilityStatus" TEXT NOT NULL DEFAULT 'internal_only',
    "isDefaultPublic" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "launchDate" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "media" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "kind" TEXT NOT NULL,
    "storageKey" TEXT NOT NULL,
    "publicUrl" TEXT,
    "mimeType" TEXT NOT NULL,
    "width" INTEGER,
    "height" INTEGER,
    "bytes" INTEGER,
    "originalFilename" TEXT,
    "title" TEXT,
    "focalPointX" REAL,
    "focalPointY" REAL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "pages" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "pageKey" TEXT NOT NULL,
    "publishStatus" TEXT NOT NULL DEFAULT 'draft',
    "isSystemPage" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "showInNavigation" BOOLEAN NOT NULL DEFAULT false,
    "heroMediaId" TEXT,
    "templateVariant" TEXT,
    "navigationGroup" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "pages_heroMediaId_fkey" FOREIGN KEY ("heroMediaId") REFERENCES "media" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "page_translations" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "pageId" TEXT NOT NULL,
    "localeCode" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT,
    "summary" TEXT,
    "contentBlocksJson" TEXT,
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    "ogTitle" TEXT,
    "ogDescription" TEXT,
    "heroHeading" TEXT,
    "publishStatus" TEXT NOT NULL DEFAULT 'draft',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "page_translations_pageId_fkey" FOREIGN KEY ("pageId") REFERENCES "pages" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "page_translations_localeCode_fkey" FOREIGN KEY ("localeCode") REFERENCES "locales" ("code") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "categories" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "parentId" TEXT,
    "publishStatus" TEXT NOT NULL DEFAULT 'draft',
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "depth" INTEGER NOT NULL DEFAULT 0,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "heroMediaId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "categories_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "categories" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "categories_heroMediaId_fkey" FOREIGN KEY ("heroMediaId") REFERENCES "media" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "category_translations" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "categoryId" TEXT NOT NULL,
    "localeCode" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slugSegment" TEXT NOT NULL,
    "fullSlugPathCache" TEXT,
    "shortDescription" TEXT,
    "body" TEXT,
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    "faqJson" TEXT,
    "publishStatus" TEXT NOT NULL DEFAULT 'draft',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "category_translations_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "category_translations_localeCode_fkey" FOREIGN KEY ("localeCode") REFERENCES "locales" ("code") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "manufacturers" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "publishStatus" TEXT NOT NULL DEFAULT 'draft',
    "originCountry" TEXT,
    "websiteUrl" TEXT,
    "logoMediaId" TEXT,
    "heroMediaId" TEXT,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "manufacturers_logoMediaId_fkey" FOREIGN KEY ("logoMediaId") REFERENCES "media" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "manufacturers_heroMediaId_fkey" FOREIGN KEY ("heroMediaId") REFERENCES "media" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "manufacturer_translations" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "manufacturerId" TEXT NOT NULL,
    "localeCode" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "summary" TEXT,
    "body" TEXT,
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    "certificationsText" TEXT,
    "publishStatus" TEXT NOT NULL DEFAULT 'draft',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "manufacturer_translations_manufacturerId_fkey" FOREIGN KEY ("manufacturerId") REFERENCES "manufacturers" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "manufacturer_translations_localeCode_fkey" FOREIGN KEY ("localeCode") REFERENCES "locales" ("code") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "products" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sku" TEXT,
    "categoryId" TEXT NOT NULL,
    "manufacturerId" TEXT NOT NULL,
    "publishStatus" TEXT NOT NULL DEFAULT 'draft',
    "availabilityStatus" TEXT NOT NULL,
    "publicPriceAmount" DECIMAL,
    "publicPriceCurrency" TEXT,
    "publicPriceUnitLabel" TEXT,
    "priceLastVerifiedAt" DATETIME,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "primaryImageMediaId" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "internalNotes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "products_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "products_manufacturerId_fkey" FOREIGN KEY ("manufacturerId") REFERENCES "manufacturers" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "products_primaryImageMediaId_fkey" FOREIGN KEY ("primaryImageMediaId") REFERENCES "media" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "product_translations" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "productId" TEXT NOT NULL,
    "localeCode" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "shortDescription" TEXT NOT NULL,
    "longDescription" TEXT,
    "availabilityNote" TEXT,
    "contactForPricingMessage" TEXT,
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    "metaKeywords" TEXT,
    "publishStatus" TEXT NOT NULL DEFAULT 'draft',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "product_translations_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "product_translations_localeCode_fkey" FOREIGN KEY ("localeCode") REFERENCES "locales" ("code") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "product_images" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "productId" TEXT NOT NULL,
    "mediaId" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "altHint" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "product_images_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "product_images_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "media" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "product_specs" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "productId" TEXT NOT NULL,
    "localeCode" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "unit" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isHighlight" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "product_specs_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "product_specs_localeCode_fkey" FOREIGN KEY ("localeCode") REFERENCES "locales" ("code") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "product_documents" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "productId" TEXT NOT NULL,
    "mediaId" TEXT NOT NULL,
    "documentType" TEXT NOT NULL,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "expiresAt" DATETIME,
    "internalNotes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "product_documents_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "product_documents_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "media" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "product_document_translations" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "productDocumentId" TEXT NOT NULL,
    "localeCode" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "description" TEXT,
    "publishStatus" TEXT NOT NULL DEFAULT 'draft',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "product_document_translations_productDocumentId_fkey" FOREIGN KEY ("productDocumentId") REFERENCES "product_documents" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "product_document_translations_localeCode_fkey" FOREIGN KEY ("localeCode") REFERENCES "locales" ("code") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "contact_requests" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "requestType" TEXT,
    "status" TEXT NOT NULL DEFAULT 'new',
    "sourceLocaleCode" TEXT NOT NULL,
    "sourcePageId" TEXT,
    "productId" TEXT,
    "manufacturerId" TEXT,
    "companyName" TEXT,
    "contactName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "country" TEXT,
    "message" TEXT NOT NULL,
    "consentToContact" BOOLEAN NOT NULL,
    "utmSource" TEXT,
    "utmMedium" TEXT,
    "utmCampaign" TEXT,
    "internalNotes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "contact_requests_sourceLocaleCode_fkey" FOREIGN KEY ("sourceLocaleCode") REFERENCES "locales" ("code") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "contact_requests_sourcePageId_fkey" FOREIGN KEY ("sourcePageId") REFERENCES "pages" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "contact_requests_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "contact_requests_manufacturerId_fkey" FOREIGN KEY ("manufacturerId") REFERENCES "manufacturers" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "site_settings" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "defaultLocaleCode" TEXT NOT NULL,
    "publicLocalesJson" TEXT NOT NULL,
    "contactEmail" TEXT NOT NULL,
    "phone" TEXT,
    "addressJson" TEXT,
    "socialLinksJson" TEXT,
    "mainNavigationJson" TEXT,
    "footerNavigationJson" TEXT,
    "defaultShareImageMediaId" TEXT,
    "searchConsoleVerification" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "site_settings_defaultShareImageMediaId_fkey" FOREIGN KEY ("defaultShareImageMediaId") REFERENCES "media" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "site_setting_translations" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "siteSettingsId" TEXT NOT NULL,
    "localeCode" TEXT NOT NULL,
    "siteName" TEXT NOT NULL,
    "siteTagline" TEXT,
    "defaultMetaTitleSuffix" TEXT,
    "defaultMetaDescription" TEXT,
    "footerCompanyBlurb" TEXT,
    "contactIntro" TEXT,
    "defaultContactForPricingMessage" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "site_setting_translations_siteSettingsId_fkey" FOREIGN KEY ("siteSettingsId") REFERENCES "site_settings" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "site_setting_translations_localeCode_fkey" FOREIGN KEY ("localeCode") REFERENCES "locales" ("code") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "media_storageKey_key" ON "media"("storageKey");

-- CreateIndex
CREATE UNIQUE INDEX "pages_pageKey_key" ON "pages"("pageKey");

-- CreateIndex
CREATE UNIQUE INDEX "page_translations_pageId_localeCode_key" ON "page_translations"("pageId", "localeCode");

-- CreateIndex
CREATE UNIQUE INDEX "page_translations_localeCode_slug_key" ON "page_translations"("localeCode", "slug");

-- CreateIndex
CREATE UNIQUE INDEX "categories_code_key" ON "categories"("code");

-- CreateIndex
CREATE UNIQUE INDEX "category_translations_categoryId_localeCode_key" ON "category_translations"("categoryId", "localeCode");

-- CreateIndex
CREATE UNIQUE INDEX "category_translations_localeCode_fullSlugPathCache_key" ON "category_translations"("localeCode", "fullSlugPathCache");

-- CreateIndex
CREATE UNIQUE INDEX "manufacturers_code_key" ON "manufacturers"("code");

-- CreateIndex
CREATE UNIQUE INDEX "manufacturer_translations_manufacturerId_localeCode_key" ON "manufacturer_translations"("manufacturerId", "localeCode");

-- CreateIndex
CREATE UNIQUE INDEX "manufacturer_translations_localeCode_slug_key" ON "manufacturer_translations"("localeCode", "slug");

-- CreateIndex
CREATE UNIQUE INDEX "products_sku_key" ON "products"("sku");

-- CreateIndex
CREATE UNIQUE INDEX "product_translations_productId_localeCode_key" ON "product_translations"("productId", "localeCode");

-- CreateIndex
CREATE UNIQUE INDEX "product_translations_localeCode_slug_key" ON "product_translations"("localeCode", "slug");

-- CreateIndex
CREATE INDEX "product_images_productId_sortOrder_idx" ON "product_images"("productId", "sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "product_specs_productId_localeCode_label_key" ON "product_specs"("productId", "localeCode", "label");

-- CreateIndex
CREATE UNIQUE INDEX "product_document_translations_productDocumentId_localeCode_key" ON "product_document_translations"("productDocumentId", "localeCode");

-- CreateIndex
CREATE UNIQUE INDEX "site_setting_translations_siteSettingsId_localeCode_key" ON "site_setting_translations"("siteSettingsId", "localeCode");
