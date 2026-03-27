import { execSync } from "node:child_process";
import {
  existsSync,
  mkdirSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { dirname, join } from "node:path";

const schemaPath = "prisma/schema.prisma";
const migrationsPath = join(process.cwd(), "prisma", "migrations");
const shadowDbPath = join(process.cwd(), "prisma", "shadow.db");
const shellPath =
  process.platform === "win32"
    ? process.env.ComSpec ?? "cmd.exe"
    : process.env.SHELL ?? "/bin/sh";

function run(command: string) {
  return execSync(command, {
    encoding: "utf8",
    shell: shellPath,
  });
}

function execute(command: string) {
  execSync(command, {
    stdio: "inherit",
    shell: shellPath,
  });
}

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

const requestedName = process.argv.slice(2).join(" ").trim() || "schema-update";
const migrationName = slugify(requestedName);
const timestamp = new Date()
  .toISOString()
  .replace(/[-:TZ.]/g, "")
  .slice(0, 14);
const migrationDir = join(migrationsPath, `${timestamp}_${migrationName}`);
const migrationFile = join(migrationDir, "migration.sql");

mkdirSync(migrationsPath, { recursive: true });

const hasExistingMigrations = readdirSync(migrationsPath, {
  withFileTypes: true,
}).some((entry) => entry.isDirectory());

const diffCommand = hasExistingMigrations
  ? `npx prisma migrate diff --from-migrations "${migrationsPath}" --to-schema-datamodel ${schemaPath} --shadow-database-url "file:${shadowDbPath.replace(/\\/g, "/")}" --script`
  : `npx prisma migrate diff --from-empty --to-schema-datamodel ${schemaPath} --script`;

const sql = run(diffCommand).trim();

if (!sql) {
  console.log("No schema changes detected. Migration file was not created.");
  process.exit(0);
}

mkdirSync(dirname(migrationFile), { recursive: true });
writeFileSync(migrationFile, `${sql}\n`);

try {
  execute(`npx prisma db execute --file "${migrationFile}" --schema ${schemaPath}`);
  console.log(`Migration created and applied: ${migrationFile}`);
} finally {
  if (existsSync(shadowDbPath)) {
    rmSync(shadowDbPath, { force: true });
  }
}
