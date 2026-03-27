import { describe, expect, test } from "vitest";

import {
  normalizePublicLocale,
  sanitizeInquiryRedirectPath,
} from "@/lib/public/forms";

describe("public form guards", () => {
  test("normalizes unexpected locales to the default public locale", () => {
    expect(normalizePublicLocale("fr")).toBe("fr");
    expect(normalizePublicLocale("fa")).toBe("en");
    expect(normalizePublicLocale("de")).toBe("en");
    expect(normalizePublicLocale(undefined)).toBe("en");
  });

  test("prevents open redirects in inquiry redirects", () => {
    expect(sanitizeInquiryRedirectPath("https://evil.example", "en")).toBe("/en/contact");
    expect(sanitizeInquiryRedirectPath("//evil.example", "en")).toBe("/en/contact");
    expect(sanitizeInquiryRedirectPath("/fr/contact", "en")).toBe("/en/contact");
  });

  test("keeps the expected in-locale contact route", () => {
    expect(sanitizeInquiryRedirectPath(" /fr/contact ", "fr")).toBe("/fr/contact");
  });
});
