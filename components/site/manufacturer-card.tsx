import Image from "next/image";
import Link from "next/link";

import { Card } from "@/components/ui/card";
import type { PublicLocale } from "@/lib/i18n/config";
import { getCatalogPath, getDisplayText } from "@/lib/public/content";
import { sanitizeHref } from "@/lib/safe-url";

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
  const href = getCatalogPath(locale, "manufacturers", slug);
  const logoSrc = sanitizeHref(logoUrl, { allowRelative: true });
  const summaryText = getDisplayText(
    summary,
    locale === "fr"
      ? "Profil fabricant en cours de consolidation."
      : "Manufacturer profile is being consolidated.",
  );
  const cardContent = (
    <>
      <div className="flex items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-[#fff0f0]">
          {logoSrc ? (
            <Image
              src={logoSrc}
              alt={name}
              width={40}
              height={40}
              className="h-10 w-10 object-contain transition duration-300 group-hover:scale-105"
            />
          ) : (
            <span className="text-sm font-semibold text-brand-strong">
              {name.trim().charAt(0) || "A"}
            </span>
          )}
        </div>
        <div className="min-w-0">
          <p className="break-words text-xl font-semibold">{name}</p>
          <p className="text-sm text-muted">{productCount} linked products</p>
        </div>
      </div>
      <p className="text-sm leading-7 text-muted">{summaryText}</p>
    </>
  );

  return (
    <Card className="interactive-panel overflow-hidden p-6">
      {href ? (
        <Link href={href} className="group block space-y-5">
          {cardContent}
        </Link>
      ) : (
        <div aria-disabled="true" className="group block space-y-5 opacity-90">
          {cardContent}
        </div>
      )}
    </Card>
  );
}
