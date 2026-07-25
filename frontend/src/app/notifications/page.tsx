import { MainLayout } from "@/components/layout/MainLayout";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";

export default function NotificationsPage() {
  return (
    <MainLayout>
      <Card>
        <Badge variant="warning">Alerts</Badge>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight">Enterprise notification center</h1>
        <p className="mt-3 text-sm text-foreground/60 sm:text-base">
          Build failures, security issues, failed agents, deployment problems, merge conflicts, and performance alerts.
        </p>
      </Card>
      <div className="space-y-3">
        {[
          ["Build failure", "Payment API test stage failed"],
          ["Security issue", "Dependency advisory requires patching"],
          ["Merge conflict", "Branch release/1.0.4 needs manual resolution"],
        ].map(([title, detail]) => (
          <Card key={title}>
            <p className="text-sm font-semibold">{title}</p>
            <p className="mt-1 text-sm text-foreground/60">{detail}</p>
          </Card>
        ))}
      </div>
    </MainLayout>
  );
}
