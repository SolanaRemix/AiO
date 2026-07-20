import { MainLayout } from "@/components/layout/MainLayout";
import { WorkspaceTabs } from "@/components/workspace/WorkspaceTabs";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";

export default function WorkspacePage() {
  return (
    <MainLayout>
      <Card className="neural-border overflow-hidden">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <Badge variant="primary">Workspace</Badge>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight">Apollo Grid execution room</h1>
            <p className="mt-3 max-w-3xl text-sm text-foreground/60 sm:text-base">
              A synchronized surface for chat, files, tasks, timelines, memory, knowledge, deployment evidence, and agent telemetry.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              ["Critical path", "3 blockers"],
              ["Readiness", "82%"],
              ["Artifacts", "19 linked"],
            ].map(([label, value]) => (
              <div key={label} className="rounded-2xl border border-border/80 bg-card/50 px-4 py-3 text-right">
                <p className="text-xs uppercase tracking-[0.2em] text-foreground/45">{label}</p>
                <p className="mt-2 text-xl font-semibold">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </Card>
      <WorkspaceTabs />
    </MainLayout>
  );
}
