import { MainLayout } from "@/components/layout/MainLayout";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { DeploymentList } from "@/components/deploy/DeploymentList";
import { EnvironmentPanel } from "@/components/deploy/EnvironmentPanel";
import { PipelineStatus } from "@/components/deploy/PipelineStatus";

export default function DeployPage() {
  return (
    <MainLayout>
      <Card>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <Badge variant="primary">Deploy</Badge>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight">
              Deployment control center
            </h1>
            <p className="mt-3 max-w-3xl text-sm text-foreground/60 sm:text-base">
              Build, preview, and promote production deployments. Manage rollbacks,
              environment variables, and secret injection across every pipeline stage.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              ["Deployments", "14"],
              ["Success rate", "92.8%"],
              ["Avg build time", "2m 18s"],
            ].map(([label, value]) => (
              <div
                key={label}
                className="rounded-2xl border border-border/80 bg-card/50 px-4 py-3 text-right"
              >
                <p className="text-xs uppercase tracking-[0.2em] text-foreground/45">{label}</p>
                <p className="mt-2 text-xl font-semibold">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </Card>
      <EnvironmentPanel />
      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <DeploymentList />
        <PipelineStatus />
      </div>
    </MainLayout>
  );
}
