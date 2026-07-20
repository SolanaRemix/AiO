import { homeStats } from "@/lib/constants";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";

export function AiStatus() {
  return (
    <Card>
      <div className="mb-5 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-foreground/45">AI status</p>
          <h2 className="mt-2 text-xl font-semibold">Operational signal board</h2>
        </div>
        <Badge variant="success">Healthy</Badge>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {homeStats.map((stat) => (
          <div key={stat.label} className="rounded-2xl border border-border/80 bg-card/45 p-4">
            <p className="text-sm text-foreground/55">{stat.label}</p>
            <p className="mt-3 text-3xl font-semibold">{stat.value}</p>
            <p className="mt-2 text-sm text-success">{stat.delta}</p>
          </div>
        ))}
        <div className="rounded-2xl border border-border/80 bg-card/45 p-4">
          <div className="h-4 w-32 animate-pulse rounded-full bg-foreground/10" />
          <div className="mt-4 h-9 w-24 animate-pulse rounded-2xl bg-foreground/10" />
          <div className="mt-3 h-4 w-full animate-pulse rounded-full bg-foreground/10" />
        </div>
        <div className="rounded-2xl border border-border/80 bg-card/45 p-4">
          <p className="text-sm text-foreground/55">Quality gate drift</p>
          <p className="mt-3 text-3xl font-semibold">0.18%</p>
          <p className="mt-2 text-sm text-primary">Auto-correcting with swarm feedback</p>
        </div>
      </div>
    </Card>
  );
}
