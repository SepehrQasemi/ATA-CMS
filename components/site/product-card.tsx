import Image from "next/image";
import Link from "next/link";

import { Card } from "@/components/ui/card";
import { AdminStatusBadge } from "@/components/admin/status-badge";
import type { PublicLocale } from "@/lib/i18n/config";
import { getCatalogPath, getDisplayText } from "@/lib/public/content";
import { sanitizeHref } from "@/lib/safe-url";

type ProductCardProps = {
  availabilityStatus: "available_on_request" | "discontinued" | "in_stock" | "out_of_stock";
  imageUrl?: string | null | undefined;
  locale: PublicLocale;
  manufacturerName?: string | null | undefined;
  name: string;
  priceLabel?: string;
  shortDescription: string;
  slug: string;
};

export function ProductCard({
  availabilityStatus,
  imageUrl,
  locale,
  manufacturerName,
  name,
  priceLabel,
  shortDescription,
  slug,
}: ProductCardProps) {
  const href = getCatalogPath(locale, "products", slug);
  const imageSrc = sanitizeHref(imageUrl, { allowRelative: true });
  const description = getDisplayText(
    shortDescription,
    locale === "fr"
      ? "La fiche produit detaillee sera enrichie par l equipe catalogue."
      : "The detailed product profile will be completed by the catalog team.",
  );
  const manufacturerLabel = getDisplayText(manufacturerName, "ATA catalog");
  const priceCopy = getDisplayText(priceLabel);
  const cardContent = (
    <>
      <div className="relative aspect-[4/3] bg-gradient-to-br from-[#fff0f0] to-white">
        {imageSrc ? (
          <Image
            src={imageSrc}
            alt={name}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition duration-300 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full items-center justify-center px-6 text-center text-sm font-semibold text-brand-strong/80">
            {locale === "fr" ? "Visuel produit a venir" : "Product visual pending"}
          </div>
        )}
      </div>
      <div className="space-y-4 p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <p className="max-w-[18rem] break-words text-xl font-semibold">{name}</p>
          <AdminStatusBadge kind="availability" status={availabilityStatus} />
        </div>
        <p className="min-h-14 text-sm leading-7 text-muted">{description}</p>
        <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
          <span className="max-w-[12rem] break-words text-muted">{manufacturerLabel}</span>
          {priceCopy ? (
            <span className="font-semibold text-brand-strong">{priceCopy}</span>
          ) : null}
        </div>
      </div>
    </>
  );

  return (
    <Card className="interactive-panel overflow-hidden">
      {href ? (
        <Link href={href} className="group block">
          {cardContent}
        </Link>
      ) : (
        <div aria-disabled="true" className="group block opacity-90">
          {cardContent}
        </div>
      )}
    </Card>
  );
}
