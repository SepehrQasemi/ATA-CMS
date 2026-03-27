import { describe, expect, test } from "vitest";

import {
  buildCategoryTree,
  wouldCreateCategoryCycle,
} from "@/lib/domain/category-tree";

describe("category hierarchy", () => {
  test("builds a multi-level tree", () => {
    const tree = buildCategoryTree([
      { id: "root", name: "Food additives", parentId: null },
      { id: "child", name: "Acidity regulators", parentId: "root" },
      { id: "leaf", name: "Citric acids", parentId: "child" },
    ]);

    expect(tree).toHaveLength(1);
    expect(tree[0]?.children[0]?.children[0]?.name).toBe("Citric acids");
  });

  test("detects cyclical parent assignment", () => {
    const parentLookup = new Map<string, string | null>([
      ["root", null],
      ["child", "root"],
      ["leaf", "child"],
    ]);

    expect(
      wouldCreateCategoryCycle({
        categoryId: "root",
        nextParentId: "leaf",
        parentLookup,
      }),
    ).toBe(true);
  });
});
