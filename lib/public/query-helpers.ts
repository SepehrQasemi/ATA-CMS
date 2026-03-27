type WithTranslations<TTranslation> = {
  translations: TTranslation[];
};

type TranslationOf<TItem> =
  TItem extends WithTranslations<infer TTranslation> ? TTranslation : never;

type CategoryTranslationOf<TItem> = TItem extends {
  category: WithTranslations<infer TCategoryTranslation>;
}
  ? TCategoryTranslation
  : never;

type ManufacturerTranslationOf<TItem> = TItem extends {
  manufacturer: WithTranslations<infer TManufacturerTranslation>;
}
  ? TManufacturerTranslation
  : never;

function omitTranslations<TItem extends WithTranslations<unknown>>(item: TItem) {
  const next = { ...item };
  delete (next as { translations?: unknown }).translations;
  return next as Omit<TItem, "translations">;
}

export function pickFirstTranslation<TTranslation>(
  translations: TTranslation[] | null | undefined,
) {
  return translations?.[0] ?? null;
}

export function attachTranslation<TItem extends WithTranslations<unknown>>(
  item: TItem,
) {
  const translation = pickFirstTranslation(item.translations);

  if (!translation) {
    return null;
  }

  const rest = omitTranslations(item);
  return {
    ...rest,
    translation,
  } as Omit<TItem, "translations"> & { translation: TranslationOf<TItem> };
}

export function attachProductRelations<
  TItem extends WithTranslations<unknown> & {
    category: WithTranslations<unknown>;
    manufacturer: WithTranslations<unknown>;
  },
>(item: TItem) {
  const translation = pickFirstTranslation(item.translations);
  const categoryTranslation = pickFirstTranslation(item.category.translations);
  const manufacturerTranslation = pickFirstTranslation(
    item.manufacturer.translations,
  );

  if (!translation || !categoryTranslation || !manufacturerTranslation) {
    return null;
  }

  const rest = omitTranslations(item);
  return {
    ...rest,
    translation,
    categoryTranslation,
    manufacturerTranslation,
  } as Omit<TItem, "translations"> & {
    translation: TranslationOf<TItem>;
    categoryTranslation: CategoryTranslationOf<TItem>;
    manufacturerTranslation: ManufacturerTranslationOf<TItem>;
  };
}

export function attachProductManufacturerRelation<
  TItem extends WithTranslations<unknown> & {
    manufacturer: WithTranslations<unknown>;
  },
>(item: TItem) {
  const translation = pickFirstTranslation(item.translations);
  const manufacturerTranslation = pickFirstTranslation(
    item.manufacturer.translations,
  );

  if (!translation || !manufacturerTranslation) {
    return null;
  }

  const rest = omitTranslations(item);
  return {
    ...rest,
    translation,
    manufacturerTranslation,
  } as Omit<TItem, "translations"> & {
    translation: TranslationOf<TItem>;
    manufacturerTranslation: ManufacturerTranslationOf<TItem>;
  };
}
