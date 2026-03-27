import { describe, expect, test } from "vitest";

import { buildPageMetadata } from "@/lib/seo/metadata";

describe("metadata builder", () => {
  test("creates canonical metadata from the configured site url", () => {
    const metadata = buildPageMetadata({
      title: "Products",
      description: "Catalog landing page",
      pathname: "/en/products",
    });

    expect(metadata.alternates?.canonical).toBe(
      "http://localhost:3000/en/products",
    );
    expect(metadata.title).toBe("Products | Abadis Tejarat Arka");
  });
});
