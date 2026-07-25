import { MainLayout } from "@/components/layout/MainLayout";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";

export default function WorkflowsPage() {
  return (
    <MainLayout>
      <Card>
        <Badge variant="primary">Workflows</Badge>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight">Lifecycle orchestration control</h1>
        <p className="mt-3 text-sm text-foreground/60 sm:text-base">
          Plan, run, and audit project flows from planning through monitoring with explicit gate checks.
        </p>
      </Card>
      <div className="grid gap-4 xl:grid-cols-3">
        {[
          ["Planning", "6 active"],
          ["Security Review", "2 pending"],
          ["Deployment Ready", "4 approved"],
        ].map(([title, value]) => (
          <Card key={title}>
            <p className="text-xs uppercase tracking-[0.2em] text-foreground/45">{title}</p>
            <p className="mt-2 text-2xl font-semibold">{value}</p>
          </Card>
        ))}
      </div>
    </MainLayout>
  );
}
