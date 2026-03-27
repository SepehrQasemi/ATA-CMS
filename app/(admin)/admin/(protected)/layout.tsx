import type { ReactNode } from "react";

import { AdminShell } from "@/components/layout/admin-shell";
import { requireAdminSession } from "@/lib/auth/session";

export default async function AdminProtectedLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  const session = await requireAdminSession();
  return <AdminShell email={session.email}>{children}</AdminShell>;
}
