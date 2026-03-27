import { Card } from "@/components/ui/card";

export default function AdminLoading() {
  return (
    <section className="space-y-6" aria-busy="true" aria-live="polite">
      <div className="space-y-3">
        <div className="h-4 w-36 animate-pulse rounded-full bg-white/70" />
        <div className="h-10 w-72 animate-pulse rounded-full bg-white/85" />
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <Card key={index} className="space-y-4 p-6">
            <div className="h-4 w-28 animate-pulse rounded-full bg-white/70" />
            <div className="h-8 w-20 animate-pulse rounded-full bg-white/85" />
            <div className="h-4 w-full animate-pulse rounded-full bg-white/70" />
          </Card>
        ))}
      </div>

      <Card className="space-y-4 p-6">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="h-12 animate-pulse rounded-2xl bg-white/70" />
        ))}
      </Card>
    </section>
  );
}
