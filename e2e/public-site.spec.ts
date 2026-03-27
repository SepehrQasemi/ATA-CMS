import { expect, test } from "@playwright/test";

test("home page exposes featured catalog sections", async ({ page }) => {
  await page.goto("/en");

  await expect(
    page.getByRole("heading", {
      name: /manufacturer-aware sourcing for serious b2b buying teams/i,
    }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", {
      name: /clear category entry points for a b2b catalog/i,
    }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: /citric acid monohydrate/i }),
  ).toBeVisible();
});

test("french product detail shows localized availability and pricing fallback", async ({
  page,
}) => {
  await page.goto("/fr/products/acide-sorbique");

  await expect(
    page.getByRole("heading", { name: /acide sorbique/i }),
  ).toBeVisible();
  await expect(page.getByText(/actuellement indisponible/i)).toBeVisible();
  await expect(page.getByText(/contactez ATA pour le prix/i)).toBeVisible();
});

test("contact inquiry flow stores a submission and confirms success", async ({
  page,
}) => {
  await page.goto("/en/contact?product=product-citric-acid");

  await page.getByLabel(/contact name/i).fill("Playwright Buyer");
  await page.getByLabel(/company/i).fill("QA Foods");
  await page.getByLabel(/^email$/i).fill("qa-buyer@example.com");
  await page.getByLabel(/^phone$/i).fill("+33 6 11 22 33 44");
  await page.getByLabel(/country/i).fill("France");
  await page
    .getByLabel(/^message$/i)
    .fill("Need pricing, documentation, and lead time for the next production slot.");
  await page.getByText(/i agree to be contacted/i).click();
  await page.getByRole("button", { name: /send inquiry/i }).click();

  await expect(
    page.getByText(/your inquiry has been stored successfully/i),
  ).toBeVisible();
});

test("invalid inquiry submission keeps the user on the form with readable errors", async ({
  page,
}) => {
  await page.goto("/en/contact");

  await page.getByLabel(/contact name/i).fill("   ");
  await page.getByLabel(/^email$/i).fill("qa-invalid@example.com");
  await page.getByLabel(/^message$/i).fill("short");
  await page.getByText(/i agree to be contacted/i).click();
  await page.getByRole("button", { name: /send inquiry/i }).click();

  await expect(page).toHaveURL(/\/en\/contact/);
  await expect(page.getByText(/contact name is required/i)).toBeVisible();
});

test("non-public Persian routes stay unavailable", async ({ page }) => {
  const response = await page.goto("/fa");
  expect(response?.status()).toBe(404);
});

test("home page emits hreflang alternates for public locales only", async ({
  page,
}) => {
  await page.goto("/en");

  await expect(page.locator('link[rel="alternate"][hreflang="en"]')).toHaveCount(1);
  await expect(page.locator('link[rel="alternate"][hreflang="fr"]')).toHaveCount(1);
  await expect(page.locator('link[rel="alternate"][hreflang="fa"]')).toHaveCount(0);
  await expect(
    page.locator('link[rel="alternate"][hreflang="x-default"]'),
  ).toHaveCount(1);
});

test("sitemap and robots exclude Persian public URLs", async ({ page }) => {
  await page.goto("/sitemap.xml");
  const sitemapBody = await page.locator("body").innerText();
  expect(sitemapBody).toContain("http://localhost:3000/en");
  expect(sitemapBody).toContain("http://localhost:3000/fr");
  expect(sitemapBody).not.toContain("http://localhost:3000/fa");

  await page.goto("/robots.txt");
  await expect(page.locator("body")).toContainText("Disallow: /fa");
  await expect(page.locator("body")).toContainText("Disallow: /admin");
});

test("missing localized product routes render the not-found recovery UI", async ({
  page,
}) => {
  await page.goto("/en/products/does-not-exist");

  await expect(page.getByRole("heading", { name: /content not found/i })).toBeVisible();
  await expect(page.getByRole("link", { name: /browse products/i })).toBeVisible();
});

test("product documents render only when public document content exists", async ({
  page,
}) => {
  await page.goto("/en/products/citric-acid-monohydrate");
  await expect(page.getByRole("heading", { name: /^documents$/i })).toBeVisible();
  await expect(page.getByRole("link", { name: /citric acid datasheet/i })).toBeVisible();

  await page.goto("/en/products/sorbic-acid");
  await expect(page.getByRole("heading", { name: /^documents$/i })).toHaveCount(0);
});

test("mobile navigation exposes catalog entry points", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/en");

  await page.getByRole("button", { name: /open navigation/i }).click();
  const mobileNav = page.locator("#mobile-site-nav");
  await expect(mobileNav.getByRole("link", { name: /^products$/i })).toBeVisible();
  await mobileNav.getByRole("link", { name: /^products$/i }).click();

  await expect(page).toHaveURL(/\/en\/products$/);
});
