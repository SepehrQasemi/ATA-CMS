import Link from "next/link";
import type { ReactNode } from "react";

import { BrandLogo } from "@/components/brand/brand-logo";
import { Button } from "@/components/ui/button";

type AdminShellProps = {
  children: ReactNode;
  email: string;
};

const adminLinks = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/pages", label: "Pages" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/categories", label: "Categories" },
  { href: "/admin/manufacturers", label: "Manufacturers" },
  { href: "/admin/media", label: "Media" },
  { href: "/admin/inquiries", label: "Inquiries" },
  { href: "/admin/settings", label: "Settings" },
  { href: "/admin/seo", label: "SEO" },
];

export function AdminShell({ children, email }: AdminShellProps) {
  return (
    <div className="min-h-screen bg-[#fff6f6]">
      <div className="content-shell grid gap-8 py-8 lg:grid-cols-[260px_1fr]">
        <aside className="surface-panel sticky top-6 h-fit rounded-[1.5rem] bg-gradient-to-br from-[#4d0f22] to-[#2b0813] p-6 text-white shadow-[0_18px_40px_rgba(43,8,19,0.25)]">
          <BrandLogo href="/admin" shortLabel tone="light" />
          <div className="mt-8 space-y-2">
            {adminLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="focus-ring block rounded-2xl px-4 py-3 text-sm font-medium text-white/78 transition hover:bg-white/10 hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </div>
          <div className="mt-8 rounded-2xl border border-white/12 bg-white/6 p-4 text-sm text-white/80">
            Signed in as {email}
          </div>
          <Button asChild variant="secondary" className="mt-4 w-full justify-center">
            <Link href="/admin/logout">Sign out</Link>
          </Button>
        </aside>
        <div className="min-w-0">{children}</div>
      </div>
    </div>
  );
}
