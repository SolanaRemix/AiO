import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";

const routerStats = [
  { label: "Requests routed", value: "8,071", delta: "+12% this hour" },
  { label: "Avg latency", value: "318ms", delta: "Within SLO" },
  { label: "Circuit breaks", value: "2", delta: "Last 24 hours" },
  { label: "Cost today", value: "$4.28", delta: "Under budget" },
];

const routingLog = [
  { provider: "OpenAI Compatible", model: "gpt-4o", latency: "290ms", tokens: 1840, status: "success" },
  { provider: "Google Compatible", model: "gemini-1.5-flash", latency: "261ms", tokens: 920, status: "success" },
  { provider: "OpenAI Compatible", model: "gpt-4o-mini", latency: "180ms", tokens: 412, status: "success" },
  { provider: "Anthropic Compatible", model: "claude-3-5-haiku", latency: "—", tokens: 0, status: "fallback" },
  { provider: "OpenAI Compatible", model: "gpt-4.1", latency: "480ms", tokens: 3200, status: "success" },
];

export function RouterDashboard() {
  return (
    <div className="space-y-6">
      <Card>
        <div className="mb-5">
          <p className="text-xs uppercase tracking-[0.22em] text-foreground/45">API Router</p>
          <h2 className="mt-2 text-xl font-semibold">Routing intelligence</h2>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {routerStats.map((stat) => (
            <div key={stat.label} className="rounded-2xl border border-border/80 bg-card/45 p-4">
              <p className="text-sm text-foreground/55">{stat.label}</p>
              <p className="mt-3 text-2xl font-semibold">{stat.value}</p>
              <p className="mt-2 text-xs text-success">{stat.delta}</p>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <div className="mb-5 flex items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-foreground/45">Request log</p>
            <h2 className="mt-2 text-xl font-semibold">Recent routed requests</h2>
          </div>
        </div>
        <div className="space-y-2">
          {routingLog.map((entry, index) => (
            <div
              key={index}
              className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border/80 bg-card/40 px-4 py-3"
            >
              <div className="min-w-0">
                <p className="text-sm font-medium">{entry.model}</p>
                <p className="mt-0.5 text-xs text-foreground/50">{entry.provider}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-foreground/40">{entry.tokens > 0 ? `${entry.tokens.toLocaleString()} tokens` : "—"}</span>
                <span className="text-xs text-foreground/40">{entry.latency}</span>
                <Badge variant={entry.status === "success" ? "success" : "warning"}>
                  {entry.status}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
