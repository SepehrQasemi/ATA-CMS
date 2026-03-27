export type CategoryNode = {
  id: string;
  name: string;
  parentId: string | null;
};

export type CategoryTreeNode = CategoryNode & {
  children: CategoryTreeNode[];
};

export type CategoryTreeNodeOf<T extends CategoryNode> = T & {
  children: CategoryTreeNodeOf<T>[];
};

export function buildCategoryTree<T extends CategoryNode>(categories: T[]) {
  const nodes = new Map<string, CategoryTreeNodeOf<T>>();

  for (const category of categories) {
    nodes.set(category.id, { ...category, children: [] });
  }

  const roots: CategoryTreeNodeOf<T>[] = [];

  for (const node of nodes.values()) {
    if (!node.parentId) {
      roots.push(node);
      continue;
    }

    const parent = nodes.get(node.parentId);

    if (!parent) {
      roots.push(node);
      continue;
    }

    parent.children.push(node);
  }

  return roots;
}

export function wouldCreateCategoryCycle(options: {
  categoryId: string;
  nextParentId: string | null;
  parentLookup: Map<string, string | null>;
}) {
  let currentParentId = options.nextParentId;

  while (currentParentId) {
    if (currentParentId === options.categoryId) {
      return true;
    }

    currentParentId = options.parentLookup.get(currentParentId) ?? null;
  }

  return false;
}
