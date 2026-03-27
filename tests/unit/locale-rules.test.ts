import { describe, expect, test } from "vitest";

import { getLocaleConfigurationIssues } from "@/lib/domain/locales";

describe("locale configuration rules", () => {
  test("accepts the documented MVP locale posture", () => {
    expect(
      getLocaleConfigurationIssues([
        { code: "en", visibilityStatus: "public", isDefaultPublic: true },
        { code: "fr", visibilityStatus: "public", isDefaultPublic: false },
        { code: "fa", visibilityStatus: "internal_only", isDefaultPublic: false },
      ]),
    ).toEqual([]);
  });

  test("blocks public Persian and invalid default locale changes", () => {
    expect(
      getLocaleConfigurationIssues([
        { code: "en", visibilityStatus: "public", isDefaultPublic: false },
        { code: "fr", visibilityStatus: "public", isDefaultPublic: true },
        { code: "fa", visibilityStatus: "public", isDefaultPublic: false },
      ]),
    ).toEqual([
      "English must remain the default public locale for MVP.",
      "Persian cannot be public in MVP.",
    ]);
  });
});
