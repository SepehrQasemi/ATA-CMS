import { describe, expect, test } from "vitest";

import {
  defaultPublicLocale,
  getLocaleDirection,
  isAppLocale,
  isPublicLocale,
  publicLocales,
} from "@/lib/i18n/config";

describe("locale configuration", () => {
  test("keeps English as the default public locale", () => {
    expect(defaultPublicLocale).toBe("en");
    expect(publicLocales).toEqual(["en", "fr"]);
  });

  test("models Persian without exposing it as public", () => {
    expect(isAppLocale("fa")).toBe(true);
    expect(isPublicLocale("fa")).toBe(false);
    expect(getLocaleDirection("fa")).toBe("rtl");
  });
});
