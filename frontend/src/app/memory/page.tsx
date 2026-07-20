import { MainLayout } from "@/components/layout/MainLayout";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { memoryClusters } from "@/lib/constants";

export default function MemoryPage() {
  return (
    <MainLayout>
      <Card>
        <Badge variant="primary">Memory</Badge>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight">Persistent execution memory</h1>
        <p className="mt-3 max-w-3xl text-sm text-foreground/60 sm:text-base">
          Preserve high-confidence traces for decisions, incidents, customer signals, and reusable workflows across every workspace.
        </p>
      </Card>
      <div className="grid gap-4 xl:grid-cols-2">
        {memoryClusters.map((cluster) => (
          <Card key={cluster.title}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-xl font-semibold">{cluster.title}</h2>
                <p className="mt-3 text-sm text-foreground/60">{cluster.detail}</p>
              </div>
              <Badge variant="success">{cluster.score}</Badge>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-border/80 bg-card/50 px-4 py-3">
                <p className="text-xs uppercase tracking-[0.2em] text-foreground/45">Entries</p>
                <p className="mt-2 text-2xl font-semibold">{cluster.entries}</p>
              </div>
              <div className="rounded-2xl border border-border/80 bg-card/50 px-4 py-3">
                <p className="text-xs uppercase tracking-[0.2em] text-foreground/45">Retention mode</p>
                <p className="mt-2 text-2xl font-semibold">Adaptive</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </MainLayout>
  );
}
