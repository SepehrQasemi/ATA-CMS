import "@/app/globals.css";

import type { ReactNode } from "react";

import { DocumentShell } from "@/components/layout/document-shell";

export default function RootRedirectLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return <DocumentShell lang="en">{children}</DocumentShell>;
}
