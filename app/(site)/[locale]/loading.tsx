import { Card } from "@/components/ui/card";

export default function PublicLocaleLoading() {
  return (
    <section className="section-shell" aria-busy="true" aria-live="polite">
      <div className="content-shell space-y-8">
        <div className="space-y-4">
          <div className="h-8 w-32 animate-pulse rounded-full bg-white/85" />
          <div className="h-16 max-w-3xl animate-pulse rounded-[2rem] bg-white/85" />
          <div className="h-6 max-w-2xl animate-pulse rounded-full bg-white/75" />
        </div>
        <div className="grid gap-5 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <Card key={index} className="space-y-4 p-6">
              <div className="aspect-[4/3] animate-pulse rounded-[1.2rem] bg-[#fff0f0]" />
              <div className="h-6 animate-pulse rounded-full bg-white/85" />
              <div className="h-4 w-4/5 animate-pulse rounded-full bg-white/70" />
              <div className="h-4 w-2/3 animate-pulse rounded-full bg-white/70" />
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
