import { describe, expect, test } from "vitest";

import {
  hasPricingFallback,
  resolvePricingMessage,
} from "@/lib/domain/pricing";

describe("pricing rules", () => {
  test("formats an informational public price when available", () => {
    expect(
      resolvePricingMessage({
        locale: "en",
        amount: 21.5,
        currency: "USD",
        message: null,
        unitLabel: "kg",
      }),
    ).toContain("$21.50");
  });

  test("falls back to localized contact messaging when price is missing", () => {
    expect(
      resolvePricingMessage({
        locale: "fr",
        amount: null,
        currency: null,
        message: "Contactez ATA pour le prix.",
        unitLabel: null,
      }),
    ).toBe("Contactez ATA pour le prix.");

    expect(
      hasPricingFallback({
        locale: "fr",
        amount: null,
        currency: null,
        message: "Contactez ATA pour le prix.",
        unitLabel: null,
      }),
    ).toBe(true);
  });
});
