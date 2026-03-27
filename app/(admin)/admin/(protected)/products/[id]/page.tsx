type AdminDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminProductDetail({
  params,
}: AdminDetailPageProps) {
  const { id } = await params;

  return (
    <div className="space-y-3">
      <p className="eyebrow">Product editor</p>
      <h1 className="text-4xl font-semibold tracking-[-0.03em]">Product {id}</h1>
      <p className="max-w-3xl text-base leading-7 text-muted">
        This detail route is scaffolded for the product form, child editors, and
        locale publication workflow described in the admin form requirements.
      </p>
    </div>
  );
}
