import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";

const pipelines = [
  { stage: "Build", status: "Pass", duration: "1m 42s", tone: "success" },
  { stage: "Unit Tests", status: "Pass", duration: "48s", tone: "success" },
  { stage: "Security Scan", status: "Pass", duration: "2m 10s", tone: "success" },
  { stage: "Preview Deploy", status: "Pass", duration: "55s", tone: "success" },
  { stage: "Integration Tests", status: "Monitor", duration: "3m 04s", tone: "warning" },
  { stage: "Production Deploy", status: "Pending", duration: "—", tone: "primary" },
];

const toneVariant: Record<string, "success" | "warning" | "danger" | "primary"> = {
  success: "success",
  warning: "warning",
  danger: "danger",
  primary: "primary",
};

export function PipelineStatus() {
  return (
    <Card>
      <div className="mb-5 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-foreground/45">Pipeline</p>
          <h2 className="mt-2 text-xl font-semibold">Apollo Grid · Release 4.7</h2>
        </div>
        <Badge variant="warning">In progress</Badge>
      </div>
      <div className="space-y-2">
        {pipelines.map((step) => (
          <div
            key={step.stage}
            className="flex items-center justify-between rounded-xl border border-border/80 bg-card/40 px-4 py-3"
          >
            <div className="flex items-center gap-3">
              <div
                className={`h-2 w-2 rounded-full ${
                  step.tone === "success"
                    ? "bg-success"
                    : step.tone === "warning"
                      ? "bg-warning"
                      : step.tone === "danger"
                        ? "bg-destructive"
                        : "bg-primary/60"
                }`}
              />
              <span className="text-sm font-medium">{step.stage}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-foreground/45">{step.duration}</span>
              <Badge variant={toneVariant[step.tone] ?? "primary"}>{step.status}</Badge>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
