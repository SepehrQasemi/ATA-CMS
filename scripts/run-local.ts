import "dotenv/config";

import { spawn, spawnSync } from "node:child_process";
import { copyFileSync, existsSync } from "node:fs";
import { join, resolve } from "node:path";

import { PrismaClient } from "@prisma/client";

const rootDir = resolve(process.cwd());
const envPath = join(rootDir, ".env");
const envExamplePath = join(rootDir, ".env.example");
const npmCommand = "npm";
const setupOnly = process.argv.includes("--setup-only");

function logStep(message: string) {
  console.log(`\n[ATA-CMS] ${message}`);
}

function toShellCommand(args: string[]) {
  return [npmCommand, ...args].join(" ");
}

function runNpmCommand(args: string[]) {
  const result = spawnSync(toShellCommand(args), {
    cwd: rootDir,
    shell: true,
    stdio: "inherit",
  });

  if (result.error) {
    console.error(result.error);
    process.exit(1);
  }

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

function readEnvValue(key: string) {
  return process.env[key] ?? "";
}

async function ensureSeedData() {
  const prisma = new PrismaClient();

  try {
    const [localeCount, settingsCount] = await Promise.all([
      prisma.locale.count(),
      prisma.siteSettings.count(),
    ]);

    if (localeCount === 0 || settingsCount === 0) {
      logStep("Database exists but core seed data is missing. Seeding sample catalog data.");
      runNpmCommand(["run", "db:seed"]);
      return;
    }

    logStep("Existing local content detected. Keeping current database content.");
  } finally {
    await prisma.$disconnect();
  }
}

async function main() {
  if (!existsSync(envPath)) {
    copyFileSync(envExamplePath, envPath);
    logStep("Created .env from .env.example. Review credentials if needed.");
  }

  const dbPath = join(rootDir, "prisma", "dev.db");
  const dbExists = existsSync(dbPath);

  logStep("Generating Prisma client.");
  runNpmCommand(["run", "db:generate"]);

  logStep("Synchronizing local database schema.");
  runNpmCommand(["run", "db:push"]);

  if (!dbExists) {
    logStep("Local database not found. Seeding development data.");
    runNpmCommand(["run", "db:seed"]);
  } else {
    await ensureSeedData();
  }

  console.log("\n[ATA-CMS] Local environment is ready.");
  console.log("[ATA-CMS] Public site:  http://127.0.0.1:3000/en");
  console.log("[ATA-CMS] French site:  http://127.0.0.1:3000/fr");
  console.log("[ATA-CMS] Admin login:  http://127.0.0.1:3000/admin/login");
  console.log(`[ATA-CMS] Admin email:  ${readEnvValue("ATA_ADMIN_EMAIL")}`);
  console.log(`[ATA-CMS] Admin password: ${readEnvValue("ATA_ADMIN_PASSWORD")}`);

  if (setupOnly) {
    console.log("[ATA-CMS] Setup-only mode complete. Re-run without --setup-only to start Next.js.");
    return;
  }

  logStep("Starting Next.js development server.");
  const child = spawn(
    `${npmCommand} run dev -- --hostname 127.0.0.1 --port 3000`,
    {
      cwd: rootDir,
      shell: true,
      stdio: "inherit",
    },
  );

  child.on("exit", (code) => {
    process.exit(code ?? 0);
  });
}

main().catch((error) => {
  console.error("\n[ATA-CMS] Local run failed.");
  console.error(error);
  process.exit(1);
});
