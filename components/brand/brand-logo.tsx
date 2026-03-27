import Image from "next/image";
import Link from "next/link";

import { siteConfig } from "@/lib/site-config";
import { cn } from "@/lib/utils";

type BrandLogoProps = {
  className?: string;
  href: string;
  shortLabel?: boolean;
  tone?: "default" | "light";
};

export function BrandLogo({
  className,
  href,
  shortLabel = false,
  tone = "default",
}: BrandLogoProps) {
  return (
    <Link
      href={href}
      className={cn("focus-ring inline-flex items-center gap-3", className)}
    >
      <span className="relative h-11 w-14 shrink-0">
        <Image
          src="/brand/ata-logo.svg"
          alt={`${siteConfig.shortName} logo`}
          fill
          sizes="56px"
          className="object-contain"
          priority
        />
      </span>
      <span className="flex flex-col leading-tight">
        <span
          className={cn(
            "text-sm font-semibold tracking-[0.14em] uppercase",
            tone === "light" ? "text-white/80" : "text-brand-strong",
          )}
        >
          {siteConfig.shortName}
        </span>
        <span
          className={cn(
            "text-sm font-medium",
            tone === "light" ? "text-white" : "text-foreground/85",
          )}
        >
          {shortLabel ? siteConfig.shortName : siteConfig.companyName}
        </span>
      </span>
    </Link>
  );
}
