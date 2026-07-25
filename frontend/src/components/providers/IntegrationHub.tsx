import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";

const connectors = [
  {
    id: "git-repository",
    name: "Git Repository",
    category: "Source Control",
    status: "connected",
    lastSync: "6 min ago",
  },
  {
    id: "docs-platform",
    name: "Documentation Platform",
    category: "Knowledge",
    status: "connected",
    lastSync: "18 min ago",
  },
  {
    id: "database",
    name: "Database",
    category: "Storage",
    status: "idle",
    lastSync: "1 hr ago",
  },
  {
    id: "messaging",
    name: "Messaging Platform",
    category: "Communication",
    status: "connected",
    lastSync: "2 min ago",
  },
  {
    id: "cloud-storage",
    name: "Cloud Object Storage",
    category: "Storage",
    status: "idle",
    lastSync: "3 hr ago",
  },
];

const statusVariant: Record<string, "success" | "warning" | "primary"> = {
  connected: "success",
  idle: "primary",
  error: "warning",
};

export function IntegrationHub() {
  return (
    <Card>
      <div className="mb-5 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-foreground/45">Integration Hub</p>
          <h2 className="mt-2 text-xl font-semibold">Active connectors</h2>
        </div>
        <Badge variant="success">{connectors.filter((c) => c.status === "connected").length} live</Badge>
      </div>
      <div className="space-y-3">
        {connectors.map((connector) => (
          <div
            key={connector.id}
            className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border/80 bg-card/45 p-4"
          >
            <div>
              <p className="text-sm font-medium">{connector.name}</p>
              <p className="mt-1 text-xs text-foreground/50">{connector.category}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-foreground/40">{connector.lastSync}</span>
              <Badge variant={statusVariant[connector.status] ?? "primary"}>{connector.status}</Badge>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
