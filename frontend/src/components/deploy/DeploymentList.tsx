import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";

const deployments = [
  {
    id: "dep-1",
    name: "Apollo Grid",
    environment: "production",
    status: "succeeded",
    url: "https://apollo-grid.aio.app",
    updatedAt: "3 min ago",
  },
  {
    id: "dep-2",
    name: "Vector Hub",
    environment: "preview",
    status: "building",
    url: "https://vector-hub-preview.aio.app",
    updatedAt: "8 min ago",
  },
  {
    id: "dep-3",
    name: "Relay OS",
    environment: "production",
    status: "succeeded",
    url: "https://relay-os.aio.app",
    updatedAt: "1 hr ago",
  },
  {
    id: "dep-4",
    name: "Helios Care",
    environment: "preview",
    status: "failed",
    url: undefined,
    updatedAt: "2 hr ago",
  },
];

const statusVariant: Record<string, "success" | "warning" | "danger" | "primary"> = {
  succeeded: "success",
  building: "warning",
  deploying: "warning",
  failed: "danger",
  rolled_back: "primary",
  queued: "primary",
};

export function DeploymentList() {
  return (
    <Card>
      <div className="mb-5 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-foreground/45">Deployments</p>
          <h2 className="mt-2 text-xl font-semibold">Recent pipeline runs</h2>
        </div>
        <Badge variant="primary">{deployments.length} tracked</Badge>
      </div>
      <div className="space-y-3">
        {deployments.map((dep) => (
          <div
            key={dep.id}
            className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border/80 bg-card/45 p-4"
          >
            <div className="min-w-0">
              <p className="text-sm font-medium">{dep.name}</p>
              <p className="mt-1 truncate text-xs text-foreground/50">
                {dep.url ?? "No URL assigned"}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant={dep.environment === "production" ? "danger" : "primary"}>
                {dep.environment}
              </Badge>
              <Badge variant={statusVariant[dep.status] ?? "primary"}>{dep.status}</Badge>
              <span className="text-xs text-foreground/40">{dep.updatedAt}</span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
