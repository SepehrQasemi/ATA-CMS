import Image from "next/image";
import Link from "next/link";

import { Card } from "@/components/ui/card";
import type { PublicLocale } from "@/lib/i18n/config";

type ManufacturerCardProps = {
  locale: PublicLocale;
  logoUrl?: string | null | undefined;
  name: string;
  productCount: number;
  slug: string;
  summary: string;
};

export function ManufacturerCard({
  locale,
  logoUrl,
  name,
  productCount,
  slug,
  summary,
}: ManufacturerCardProps) {
  return (
    <Card className="interactive-panel overflow-hidden p-6">
      <Link href={`/${locale}/manufacturers/${slug}`} className="group block space-y-5">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-[#fff0f0]">
            {logoUrl ? (
              <Image
                src={logoUrl}
                alt={name}
                width={40}
                height={40}
                className="h-10 w-10 object-contain transition duration-300 group-hover:scale-105"
              />
            ) : (
              <span className="text-sm font-semibold text-brand-strong">{name[0]}</span>
            )}
          </div>
          <div>
            <p className="text-xl font-semibold">{name}</p>
            <p className="text-sm text-muted">{productCount} linked products</p>
          </div>
        </div>
        <p className="text-sm leading-7 text-muted">{summary}</p>
      </Link>
    </Card>
  );
}
