import { describe, expect, test } from "vitest";

import { sanitizeHref } from "@/lib/safe-url";

describe("safe url sanitization", () => {
  test("allows http and https urls", () => {
    expect(sanitizeHref("https://example.com/spec.pdf")).toBe(
      "https://example.com/spec.pdf",
    );
    expect(sanitizeHref("http://example.com/spec.pdf")).toBe(
      "http://example.com/spec.pdf",
    );
  });

  test("blocks unsupported or dangerous protocols", () => {
    expect(sanitizeHref("javascript:alert(1)")).toBeNull();
    expect(sanitizeHref("data:text/html;base64,abc")).toBeNull();
    expect(sanitizeHref("ftp://example.com/file.txt")).toBeNull();
  });

  test("allows local relative urls only when explicitly enabled", () => {
    expect(sanitizeHref("/documents/citric-acid-datasheet.txt")).toBeNull();
    expect(
      sanitizeHref("/documents/citric-acid-datasheet.txt", {
        allowRelative: true,
      }),
    ).toBe("/documents/citric-acid-datasheet.txt");
    expect(
      sanitizeHref("//cdn.example.com/file.txt", {
        allowRelative: true,
      }),
    ).toBeNull();
  });
});
