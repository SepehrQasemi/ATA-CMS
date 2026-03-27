import { Card } from "@/components/ui/card";

type AdminPlaceholderPageProps = {
  description: string;
  eyebrow: string;
  title: string;
};

export function AdminPlaceholderPage({
  description,
  eyebrow,
  title,
}: AdminPlaceholderPageProps) {
  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="text-4xl font-semibold tracking-[-0.03em]">{title}</h1>
        <p className="max-w-3xl text-base leading-7 text-muted">{description}</p>
      </div>
      <Card className="p-6 text-sm leading-7 text-muted">
        Phase 1 establishes the protected route, layout, and design language. Phase 2
        will activate the data-backed CRUD workflow for this area.
      </Card>
    </div>
  );
}
