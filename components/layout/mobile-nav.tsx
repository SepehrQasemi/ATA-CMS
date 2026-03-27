"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";

import { LocaleSwitcher } from "@/components/layout/locale-switcher";
import { Button } from "@/components/ui/button";
import type { PublicLocale } from "@/lib/i18n/config";
import { cn } from "@/lib/utils";

type MobileNavProps = {
  inquiryLabel: string;
  items: Array<{ href: string; label: string }>;
  locale: PublicLocale;
};

export function MobileNav({ inquiryLabel, items, locale }: MobileNavProps) {
  const [open, setOpen] = useState(false);
  const navigationLabel = locale === "fr" ? "Navigation" : "Navigation";
  const closeLabel = locale === "fr" ? "Fermer la navigation" : "Close navigation";
  const openLabel = locale === "fr" ? "Ouvrir la navigation" : "Open navigation";

  useEffect(() => {
    if (!open) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div className="lg:hidden">
      <Button
        type="button"
        variant="secondary"
        size="sm"
        aria-controls="mobile-site-nav"
        aria-expanded={open}
        aria-label={open ? closeLabel : openLabel}
        className="h-11 w-11 rounded-full px-0"
        onClick={() => setOpen((value) => !value)}
      >
        {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
      </Button>

      <div
        className={cn(
          "fixed inset-0 z-30 bg-[rgba(21,21,21,0.22)] backdrop-blur-[1px] transition-opacity",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={() => setOpen(false)}
      />

      <div
        id="mobile-site-nav"
        className={cn(
          "fixed inset-x-0 top-24 z-40 px-4 transition duration-200",
          open
            ? "translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-2 opacity-0",
        )}
      >
        <div className="content-shell surface-panel space-y-6 px-5 py-6">
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-[0.1em] text-muted">
              {navigationLabel}
            </p>
            <div className="grid gap-2">
              {items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="focus-ring rounded-2xl px-3 py-3 text-base font-semibold hover:bg-[#fff1f1]"
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-4 border-t border-line/70 pt-4">
            <LocaleSwitcher currentLocale={locale} />
            <Button asChild size="lg">
              <Link href={`/${locale}/contact`} onClick={() => setOpen(false)}>
                {inquiryLabel}
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
