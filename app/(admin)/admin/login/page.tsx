import Link from "next/link";

import { BrandLogo } from "@/components/brand/brand-logo";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <main className="section-shell">
      <div className="content-shell max-w-5xl">
        <Card className="grid overflow-hidden lg:grid-cols-[0.95fr_1.05fr]">
          <div className="bg-gradient-to-br from-[#4d0f22] to-[#2b0813] p-10 text-white">
            <BrandLogo href="/admin/login" shortLabel tone="light" />
            <div className="mt-10 space-y-5">
              <p className="eyebrow border-white/18 bg-white/8 text-white/75">
                ATA-CMS admin
              </p>
              <h1 className="text-4xl font-semibold leading-tight tracking-[-0.03em]">
                Protected editorial workspace for the ATA public website.
              </h1>
              <p className="max-w-md text-sm leading-7 text-white/76">
                Manage pages, catalog content, media, SEO posture, and inbound
                inquiries from one local-safe MVP CMS.
              </p>
            </div>
          </div>
          <div className="p-10">
            <div className="space-y-2">
              <h2 className="text-3xl font-semibold tracking-[-0.03em]">
                Sign in
              </h2>
              <p className="text-sm leading-7 text-muted">
                Use the local admin credentials defined in your environment.
              </p>
            </div>
            <form action="/admin/auth/login" method="post" className="mt-8 space-y-5">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="admin@abadis-tejarat-arka.local"
                  required
                />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input id="password" name="password" type="password" required />
              </div>
              {error ? (
                <p className="rounded-2xl border border-danger/15 bg-rose-50 px-4 py-3 text-sm text-danger">
                  Invalid credentials. Check `ATA_ADMIN_EMAIL` and
                  `ATA_ADMIN_PASSWORD`.
                </p>
              ) : null}
              <Button type="submit" size="lg" className="w-full justify-center">
                Enter admin
              </Button>
            </form>
            <p className="mt-6 text-sm text-muted">
              <Link href="/en" className="focus-ring font-medium text-brand-strong">
                Return to public site
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </main>
  );
}
