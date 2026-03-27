"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  defaultPublicLocale,
  publicLocales,
  type PublicLocale,
} from "@/lib/i18n/config";
import { cn } from "@/lib/utils";

type LocaleSwitcherProps = {
  currentLocale: PublicLocale;
};

export function LocaleSwitcher({ currentLocale }: LocaleSwitcherProps) {
  const currentPath = usePathname();
  const pathWithoutLocale =
    currentPath.replace(new RegExp(`^/${currentLocale}`), "") || "/";

  return (
    <div className="inline-flex rounded-full border border-line bg-white/85 p-1 shadow-sm">
      {publicLocales.map((locale) => {
        const href =
          locale === defaultPublicLocale && pathWithoutLocale === "/"
            ? `/${locale}`
            : `/${locale}${pathWithoutLocale === "/" ? "" : pathWithoutLocale}`;

        return (
          <Link
            key={locale}
            href={href}
            className={cn(
              "focus-ring rounded-full px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.08em]",
              locale === currentLocale
                ? "bg-brand text-white"
                : "text-foreground/75 hover:bg-[#fff0f0]",
            )}
          >
            {locale}
          </Link>
        );
      })}
    </div>
  );
}
