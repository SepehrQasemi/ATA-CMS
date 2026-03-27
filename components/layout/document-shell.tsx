import type { ReactNode } from "react";

import { manrope } from "@/lib/fonts";
import { cn } from "@/lib/utils";

type DocumentShellProps = {
  children: ReactNode;
  dir?: "ltr" | "rtl";
  lang: string;
};

export function DocumentShell({
  children,
  dir = "ltr",
  lang,
}: DocumentShellProps) {
  return (
    <html lang={lang} dir={dir} className={cn(manrope.variable, "antialiased")}>
      <body className="min-h-screen bg-background text-foreground">{children}</body>
    </html>
  );
}
