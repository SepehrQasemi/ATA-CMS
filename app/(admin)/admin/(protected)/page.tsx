import { Card } from "@/components/ui/card";

const dashboardCards = [
  {
    title: "Content entities",
    body: "Dashboard, pages, products, categories, manufacturers, media, inquiries, settings, and SEO areas are scaffolded into the route map.",
  },
  {
    title: "Locale posture",
    body: "Public runtime is locked to English and French while Persian remains modeled for admin workflows only.",
  },
  {
    title: "Phase boundary",
    body: "Phase 2 will activate Prisma migrations, seed data, publication gates, and CRUD foundations for each domain entity.",
  },
];

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <p className="eyebrow">Dashboard</p>
        <h1 className="text-4xl font-semibold tracking-[-0.03em]">
          ATA editorial foundation
        </h1>
        <p className="max-w-3xl text-base leading-7 text-muted">
          The admin area is protected and ready for the structured CMS surfaces
          required by the implementation roadmap.
        </p>
      </div>
      <div className="grid gap-5 xl:grid-cols-3">
        {dashboardCards.map((card) => (
          <Card key={card.title} className="p-6">
            <h2 className="text-xl font-semibold">{card.title}</h2>
            <p className="mt-3 text-sm leading-7 text-muted">{card.body}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
