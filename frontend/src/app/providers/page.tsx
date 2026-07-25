import { MainLayout } from "@/components/layout/MainLayout";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { IntegrationHub } from "@/components/providers/IntegrationHub";
import { ProviderRegistry } from "@/components/providers/ProviderRegistry";
import { RouterDashboard } from "@/components/providers/RouterDashboard";

export default function ProvidersPage() {
  return (
    <MainLayout>
      <Card>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <Badge variant="primary">Providers</Badge>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight">
              AI provider registry &amp; integration hub
            </h1>
            <p className="mt-3 max-w-3xl text-sm text-foreground/60 sm:text-base">
              Configure AI providers, manage API keys, set routing priorities, monitor health,
              and connect enterprise data sources through the unified integration layer.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              ["Providers", "3 configured"],
              ["Connectors", "5 active"],
              ["Router uptime", "99.97%"],
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
      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <ProviderRegistry />
        <IntegrationHub />
      </div>
      <RouterDashboard />
    </MainLayout>
  );
}
