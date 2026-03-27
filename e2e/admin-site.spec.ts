import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { expect, test } from "@playwright/test";

function readLocalEnvValue(key: string) {
  const envFile = readFileSync(resolve(process.cwd(), ".env"), "utf8");
  const match = envFile.match(new RegExp(`^${key}="?([^"\\r\\n]+)"?$`, "m"));
  return process.env[key] ?? match?.[1] ?? "";
}

const adminEmail = readLocalEnvValue("ATA_ADMIN_EMAIL");
const adminPassword = readLocalEnvValue("ATA_ADMIN_PASSWORD");

test("admin routes redirect anonymous users to login", async ({ page }) => {
  await page.goto("/admin/products");

  await expect(page).toHaveURL(/\/admin\/login$/);
  await expect(page.getByRole("heading", { name: /sign in/i })).toBeVisible();
});

test("admin login opens the editorial dashboard and inquiry queue", async ({
  page,
}) => {
  await page.goto("/admin/login");

  await page.getByLabel(/^email$/i).fill(adminEmail);
  await page.getByLabel(/^password$/i).fill(adminPassword);
  await page.getByRole("button", { name: /enter admin/i }).click();

  await expect(
    page.getByRole("heading", { name: /ata-cms dashboard/i }),
  ).toBeVisible();
  await expect(page.getByRole("link", { name: /open products/i })).toBeVisible();

  await page.getByRole("link", { name: /^inquiries$/i }).click();
  await expect(
    page.getByRole("heading", { name: /inbound inquiry queue/i }),
  ).toBeVisible();
});
