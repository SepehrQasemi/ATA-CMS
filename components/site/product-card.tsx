import Image from "next/image";
import Link from "next/link";

import { Card } from "@/components/ui/card";
import { AdminStatusBadge } from "@/components/admin/status-badge";
import type { PublicLocale } from "@/lib/i18n/config";

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
  return (
    <Card className="interactive-panel overflow-hidden">
      <Link href={`/${locale}/products/${slug}`} className="group block">
        <div className="relative aspect-[4/3] bg-gradient-to-br from-[#fff0f0] to-white">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={name}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover transition duration-300 group-hover:scale-[1.03]"
            />
          ) : null}
        </div>
        <div className="space-y-4 p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-xl font-semibold">{name}</p>
            <AdminStatusBadge kind="availability" status={availabilityStatus} />
          </div>
          <p className="text-sm leading-7 text-muted">{shortDescription}</p>
          <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
            <span className="text-muted">{manufacturerName ?? "ATA catalog"}</span>
            {priceLabel ? (
              <span className="font-semibold text-brand-strong">{priceLabel}</span>
            ) : null}
          </div>
        </div>
      </Link>
    </Card>
  );
}
