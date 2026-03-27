import { afterEach, describe, expect, test, vi } from "vitest";

import { verifyAdminCredentials } from "@/lib/auth/credentials";

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
});
