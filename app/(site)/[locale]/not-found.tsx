export default function PublicNotFoundPage() {
  return (
    <section className="section-shell">
      <div className="content-shell surface-panel p-8">
        <p className="eyebrow">Not Found</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-[-0.03em]">
          The requested content is not available in this locale.
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-muted">
          Public routes are explicitly locale-scoped and do not fall back to another
          language when content is missing.
        </p>
      </div>
    </section>
  );
}
