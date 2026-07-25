import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";

const providers = [
  {
    id: "openai",
    name: "OpenAI Compatible",
    type: "cloud",
    models: ["gpt-4.1", "gpt-4o", "gpt-4o-mini"],
    health: "healthy",
    latency: "312ms",
    priority: 1,
    requestCount: 4821,
    enabled: true,
  },
  {
    id: "anthropic",
    name: "Anthropic Compatible",
    type: "cloud",
    models: ["claude-3-7-sonnet", "claude-3-5-haiku"],
    health: "degraded",
    latency: "490ms",
    priority: 2,
    requestCount: 1203,
    enabled: false,
  },
  {
    id: "google",
    name: "Google Compatible",
    type: "cloud",
    models: ["gemini-1.5-pro", "gemini-1.5-flash"],
    health: "healthy",
    latency: "275ms",
    priority: 3,
    requestCount: 2047,
    enabled: true,
  },
];

const healthVariant: Record<string, "success" | "warning" | "danger"> = {
  healthy: "success",
  degraded: "warning",
  unavailable: "danger",
};

export function ProviderRegistry() {
  return (
    <Card>
      <div className="mb-5 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-foreground/45">AI Providers</p>
          <h2 className="mt-2 text-xl font-semibold">Provider registry</h2>
        </div>
        <Badge variant="primary">{providers.length} configured</Badge>
      </div>
      <div className="space-y-3">
        {providers.map((provider) => (
          <div
            key={provider.id}
            className="rounded-2xl border border-border/80 bg-card/45 p-4"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium">{provider.name}</p>
                  <Badge variant={provider.enabled ? "success" : "primary"}>
                    {provider.enabled ? "Enabled" : "Disabled"}
                  </Badge>
                </div>
                <p className="mt-1 text-xs text-foreground/50">
                  Priority {provider.priority} · {provider.type} · {provider.models.length} models
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-foreground/40">{provider.latency}</span>
                <span className="text-xs text-foreground/40">{provider.requestCount.toLocaleString()} reqs</span>
                <Badge variant={healthVariant[provider.health] ?? "primary"}>{provider.health}</Badge>
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {provider.models.map((model) => (
                <span
                  key={model}
                  className="rounded-lg border border-border/60 bg-card/60 px-2 py-0.5 text-xs text-foreground/60"
                >
                  {model}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
