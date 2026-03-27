import Link from "next/link";

import { Card } from "@/components/ui/card";
import type { PublicLocale } from "@/lib/i18n/config";

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
  return (
    <Card className="interactive-panel p-6">
      <Link href={`/${locale}/categories/${path}`} className="block space-y-3">
        <p className="text-xl font-semibold">{name}</p>
        {description ? (
          <p className="text-sm leading-7 text-muted">{description}</p>
        ) : null}
      </Link>
    </Card>
  );
}
