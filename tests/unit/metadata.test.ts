import { describe, expect, test } from "vitest";

import { buildPageMetadata } from "@/lib/seo/metadata";

describe("metadata builder", () => {
  test("creates canonical metadata from the configured site url", () => {
    const metadata = buildPageMetadata({
      title: "Products",
      description: "Catalog landing page",
      locale: "en",
      pathname: "/en/products",
      alternates: {
        en: "/en/products",
        fr: "/fr/produits",
      },
    });

    expect(metadata.alternates?.canonical).toBe(
      "http://localhost:3000/en/products",
    );
    expect(metadata.alternates?.languages?.fr).toBe(
      "http://localhost:3000/fr/produits",
    );
    expect(metadata.alternates?.languages?.["x-default"]).toBe(
      "http://localhost:3000/en/products",
    );
    expect(metadata.title).toBe("Products | Abadis Tejarat Arka");
  });
});
