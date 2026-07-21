import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";

const environments = [
  {
    name: "Production",
    url: "https://apollo-grid.aio.app",
    status: "Live",
    lastDeploy: "3 min ago",
    version: "v4.7.0",
    health: "Healthy",
  },
  {
    name: "Preview",
    url: "https://apollo-grid-preview.aio.app",
    status: "Live",
    lastDeploy: "22 min ago",
    version: "v4.8.0-rc.1",
    health: "Healthy",
  },
  {
    name: "Staging",
    url: "https://apollo-grid-staging.aio.app",
    status: "Deploying",
    lastDeploy: "Just now",
    version: "v4.8.0-rc.2",
    health: "Degraded",
  },
];

export function EnvironmentPanel() {
  return (
    <Card>
      <div className="mb-5">
        <p className="text-xs uppercase tracking-[0.22em] text-foreground/45">Environments</p>
        <h2 className="mt-2 text-xl font-semibold">Active deployment targets</h2>
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        {environments.map((env) => (
          <div
            key={env.name}
            className="rounded-2xl border border-border/80 bg-card/45 p-4"
          >
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-semibold">{env.name}</p>
              <Badge variant={env.status === "Live" ? "success" : "warning"}>{env.status}</Badge>
            </div>
            <p className="mt-3 truncate text-xs text-primary">{env.url}</p>
            <div className="mt-3 flex items-center justify-between">
              <span className="text-xs text-foreground/50">{env.version}</span>
              <span className="text-xs text-foreground/40">{env.lastDeploy}</span>
            </div>
            <div className="mt-2">
              <Badge variant={env.health === "Healthy" ? "success" : "warning"} >
                {env.health}
              </Badge>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
