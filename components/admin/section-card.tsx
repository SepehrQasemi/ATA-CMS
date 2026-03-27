import type { ReactNode } from "react";

import { Card } from "@/components/ui/card";

type AdminSectionCardProps = {
  children: ReactNode;
  description?: string;
  title: string;
};

export function AdminSectionCard({
  children,
  description,
  title,
}: AdminSectionCardProps) {
  return (
    <Card className="space-y-5 p-6">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold">{title}</h2>
        {description ? (
          <p className="text-sm leading-6 text-muted">{description}</p>
        ) : null}
      </div>
      {children}
    </Card>
  );
}
