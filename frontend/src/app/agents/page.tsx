import { AgentGrid } from "@/components/agents/AgentGrid";
import { MainLayout } from "@/components/layout/MainLayout";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";

export default function AgentsPage() {
  return (
    <MainLayout>
      <Card>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <Badge variant="primary">Agents</Badge>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight">Distributed specialist grid</h1>
            <p className="mt-3 max-w-3xl text-sm text-foreground/60 sm:text-base">
              Browse 108 enterprise agents spanning planning, architecture, delivery, memory, security, and knowledge operations.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              ["Running", "27"],
              ["Queued", "19"],
              ["Avg latency", "182ms"],
            ].map(([label, value]) => (
              <div key={label} className="rounded-2xl border border-border/80 bg-card/50 px-4 py-3">
                <p className="text-xs uppercase tracking-[0.2em] text-foreground/45">{label}</p>
                <p className="mt-2 text-xl font-semibold">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </Card>
      <AgentGrid />
    </MainLayout>
  );
}
