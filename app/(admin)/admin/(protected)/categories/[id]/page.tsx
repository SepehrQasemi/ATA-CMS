type AdminDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminCategoryDetail({
  params,
}: AdminDetailPageProps) {
  const { id } = await params;

  return (
    <div className="space-y-3">
      <p className="eyebrow">Category editor</p>
      <h1 className="text-4xl font-semibold tracking-[-0.03em]">Category {id}</h1>
      <p className="max-w-3xl text-base leading-7 text-muted">
        This detail route is scaffolded for hierarchy management, localized slug-path
        editing, and category landing page content.
      </p>
    </div>
  );
}
