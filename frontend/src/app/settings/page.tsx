import Link from "next/link";
import { MainLayout } from "@/components/layout/MainLayout";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";

export default function SettingsPage() {
  return (
    <MainLayout>
      <Card>
        <Badge variant="primary">Settings</Badge>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight">Enterprise identity and control center</h1>
        <p className="mt-3 text-sm text-foreground/60 sm:text-base">
          Configure user profile, AI preferences, notifications, connected integrations, and security posture.
        </p>
      </Card>
      <div className="grid gap-4 md:grid-cols-3">
        {[
          ["Profile", "/profile", "Manage avatar, name, and account metadata"],
          ["Notifications", "/notifications", "View build, deployment, and security alerts"],
          ["Security", "/security", "Review sessions, access controls, and audit trails"],
        ].map(([title, href, detail]) => (
          <Link key={title} href={href}>
            <Card className="h-full transition hover:border-primary/40">
              <p className="text-lg font-semibold">{title}</p>
              <p className="mt-2 text-sm text-foreground/55">{detail}</p>
            </Card>
          </Link>
        ))}
      </div>
    </MainLayout>
  );
}
