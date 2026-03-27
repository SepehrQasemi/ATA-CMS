import { describe, expect, test } from "vitest";

import {
  getAvailabilityLabel,
} from "@/lib/domain/availability";
import { getAvailabilityTone } from "@/lib/domain/publication";

describe("availability presentation", () => {
  test("maps statuses to localized labels", () => {
    expect(getAvailabilityLabel("en", "available_on_request")).toBe(
      "Available on request",
    );
    expect(getAvailabilityLabel("fr", "out_of_stock")).toBe(
      "Rupture de stock",
    );
  });

  test("assigns stable badge tones", () => {
    expect(getAvailabilityTone("in_stock")).toBe("success");
    expect(getAvailabilityTone("available_on_request")).toBe("muted");
  });
});
