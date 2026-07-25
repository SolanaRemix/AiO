import { MainLayout } from "@/components/layout/MainLayout";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";

export default function ProfilePage() {
  return (
    <MainLayout>
      <Card>
        <Badge variant="primary">Profile</Badge>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight">Profile and preference dashboard</h1>
        <p className="mt-3 text-sm text-foreground/60 sm:text-base">
          Manage avatar, identity data, AI defaults, notification settings, and security controls.
        </p>
      </Card>
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <p className="text-sm font-semibold">Identity</p>
          <p className="mt-2 text-sm text-foreground/60">Avatar · Name · Email · Connected integrations</p>
        </Card>
        <Card>
          <p className="text-sm font-semibold">AI and notifications</p>
          <p className="mt-2 text-sm text-foreground/60">Model defaults · Memory mode · Alert channels</p>
        </Card>
      </div>
    </MainLayout>
  );
}
