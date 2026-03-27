import { describe, expect, test } from "vitest";

import {
  joinSlugPath,
  slugifySegment,
  splitSlugPath,
} from "@/lib/domain/slugs";

describe("slug helpers", () => {
  test("normalizes text into kebab-case segments", () => {
    expect(slugifySegment("Citric Acid Monohydrate")).toBe(
      "citric-acid-monohydrate",
    );
    expect(slugifySegment("Régulateurs d'acidité")).toBe(
      "regulateurs-d-acidite",
    );
  });

  test("builds stable category paths", () => {
    expect(joinSlugPath(["Food Additives", "Acidity Regulators"])).toBe(
      "food-additives/acidity-regulators",
    );
  });

  test("splits localized slug paths safely", () => {
    expect(splitSlugPath("/food-additives/acidity-regulators/")).toEqual([
      "food-additives",
      "acidity-regulators",
    ]);
  });
});
