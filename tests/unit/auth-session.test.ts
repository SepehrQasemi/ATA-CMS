import { afterEach, describe, expect, test, vi } from "vitest";

import { verifyAdminCredentials } from "@/lib/auth/credentials";
import { shouldUseSecureAdminCookie } from "@/lib/auth/session";

describe("admin credential guard", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  test("accepts the configured admin credentials", () => {
    vi.stubEnv("ATA_ADMIN_EMAIL", "admin@example.com");
    vi.stubEnv("ATA_ADMIN_PASSWORD", "ChangeMe123!");

    expect(
      verifyAdminCredentials({
        email: "admin@example.com",
        password: "ChangeMe123!",
      }),
    ).toBe(true);
  });

  test("rejects incorrect credentials", () => {
    vi.stubEnv("ATA_ADMIN_EMAIL", "admin@example.com");
    vi.stubEnv("ATA_ADMIN_PASSWORD", "ChangeMe123!");

    expect(
      verifyAdminCredentials({
        email: "admin@example.com",
        password: "wrong-pass",
      }),
    ).toBe(false);
  });

  test("only enables secure admin cookies for https production URLs", () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "http://127.0.0.1:3000");
    expect(shouldUseSecureAdminCookie()).toBe(false);

    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://ata.example.com");
    expect(shouldUseSecureAdminCookie()).toBe(true);
  });
});
