import { execSync } from "node:child_process";
import { existsSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

const schemaPath = "prisma/schema.prisma";
const databasePath = join(process.cwd(), "prisma", "dev.db");
const tempSqlPath = join(process.cwd(), "prisma", ".tmp", "db-push.sql");
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

const diffCommand = existsSync(databasePath)
  ? `npx prisma migrate diff --from-schema-datasource ${schemaPath} --to-schema-datamodel ${schemaPath} --script`
  : `npx prisma migrate diff --from-empty --to-schema-datamodel ${schemaPath} --script`;

const sql = run(diffCommand).trim();

if (!sql) {
  console.log("Database schema already matches the Prisma datamodel.");
  process.exit(0);
}

mkdirSync(dirname(tempSqlPath), { recursive: true });
writeFileSync(tempSqlPath, `${sql}\n`);

try {
  execute(`npx prisma db execute --file "${tempSqlPath}" --schema ${schemaPath}`);
  console.log("Database schema synchronized via prisma migrate diff + db execute.");
} finally {
  rmSync(tempSqlPath, { force: true });
}
