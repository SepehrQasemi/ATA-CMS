import Link from "next/link";

import { Card } from "@/components/ui/card";
import type { PublicLocale } from "@/lib/i18n/config";
import { getCatalogPath, getDisplayText } from "@/lib/public/content";

type CategoryCardProps = {
  description?: string | null | undefined;
  locale: PublicLocale;
  name: string;
  path: string;
};

export function CategoryCard({
  description,
  locale,
  name,
  path,
}: CategoryCardProps) {
  const href = getCatalogPath(locale, "categories", path);
  const descriptionText = getDisplayText(
    description,
    locale === "fr"
      ? "Description de categorie en cours de preparation."
      : "Category description is being prepared.",
  );

  return (
    <Card className="interactive-panel p-6">
      {href ? (
        <Link href={href} className="block space-y-3">
          <p className="break-words text-xl font-semibold">{name}</p>
          <p className="text-sm leading-7 text-muted">{descriptionText}</p>
        </Link>
      ) : (
        <div aria-disabled="true" className="space-y-3 opacity-90">
          <p className="break-words text-xl font-semibold">{name}</p>
          <p className="text-sm leading-7 text-muted">{descriptionText}</p>
        </div>
      )}
    </Card>
  );
}
