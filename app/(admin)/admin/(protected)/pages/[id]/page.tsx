type AdminDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminPageDetail({ params }: AdminDetailPageProps) {
  const { id } = await params;

  return (
    <div className="space-y-3">
      <p className="eyebrow">Page editor</p>
      <h1 className="text-4xl font-semibold tracking-[-0.03em]">Page {id}</h1>
      <p className="max-w-3xl text-base leading-7 text-muted">
        This detail route is scaffolded for the structured page editor defined in the
        CMS specification.
      </p>
    </div>
  );
}
