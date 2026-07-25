import { MainLayout } from "@/components/layout/MainLayout";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";

export default function SecurityPage() {
  return (
    <MainLayout>
      <Card>
        <Badge variant="danger">Security Center</Badge>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight">Identity and access security</h1>
        <p className="mt-3 text-sm text-foreground/60 sm:text-base">
          Monitor sessions, token rotation, RBAC posture, suspicious activity, and audit history.
        </p>
      </Card>
      <div className="grid gap-4 md:grid-cols-3">
        {[
          ["MFA Coverage", "67%"],
          ["Active sessions", "14"],
          ["Audit events", "321"],
        ].map(([label, value]) => (
          <Card key={label}>
            <p className="text-xs uppercase tracking-[0.2em] text-foreground/45">{label}</p>
            <p className="mt-2 text-2xl font-semibold">{value}</p>
          </Card>
        ))}
      </div>
    </MainLayout>
  );
}
