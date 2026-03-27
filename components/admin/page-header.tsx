import type { ReactNode } from "react";

type AdminPageHeaderProps = {
  action?: ReactNode;
  description: string;
  eyebrow: string;
  title: string;
};

export function AdminPageHeader({
  action,
  description,
  eyebrow,
  title,
}: AdminPageHeaderProps) {
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div className="space-y-3">
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="text-4xl font-semibold tracking-[-0.03em]">{title}</h1>
        <p className="max-w-3xl text-base leading-7 text-muted">{description}</p>
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
