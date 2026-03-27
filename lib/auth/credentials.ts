import { adminLoginSchema } from "@/lib/validation/auth";

export function verifyAdminCredentials(input: unknown) {
  const credentials = adminLoginSchema.parse(input);

  const configuredEmail =
    process.env.ATA_ADMIN_EMAIL?.trim().toLowerCase() ??
    "admin@abadis-tejarat-arka.local";
  const configuredPassword =
    process.env.ATA_ADMIN_PASSWORD?.trim() ?? "ChangeMe123!";

  return (
    credentials.email === configuredEmail &&
    credentials.password === configuredPassword
  );
}
