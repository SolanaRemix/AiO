import { MainLayout } from "@/components/layout/MainLayout";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { projectHistory, quickActions, recentProjects } from "@/lib/constants";

export default function Home() {
  return (
    <MainLayout>
      <Card>
        <Badge variant="primary">Dashboard</Badge>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight">AiO Project Intelligence Dashboard</h1>
        <p className="mt-3 max-w-3xl text-sm text-foreground/60 sm:text-base">
          Full visibility into projects, development progress, agent activity, workflow status, alerts, and deployments.
        </p>
      </Card>

      <div className="grid gap-4 xl:grid-cols-2">
        {recentProjects.map((project) => (
          <Card key={project.id}>
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-lg font-semibold">{project.name}</p>
                <p className="mt-1 text-sm text-foreground/60">{project.summary}</p>
              </div>
              <Badge variant={project.status === "Active" ? "success" : project.status === "Review" ? "warning" : "primary"}>
                {project.status}
              </Badge>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <p className="text-foreground/60">Completion</p>
              <p className="text-right font-medium">{project.progress}%</p>
              <p className="text-foreground/60">Active agents</p>
              <p className="text-right font-medium">{project.agents}</p>
              <p className="text-foreground/60">Last modified</p>
              <p className="text-right font-medium">{project.lastActivity}</p>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <p className="text-xs uppercase tracking-[0.2em] text-foreground/45">Activity timeline</p>
          <div className="mt-3 space-y-3">
            {projectHistory.map((entry) => (
              <div key={entry.title} className="rounded-2xl border border-border/80 bg-card/50 p-3">
                <p className="text-sm font-semibold">{entry.title}</p>
                <p className="mt-1 text-sm text-foreground/60">{entry.detail}</p>
                <p className="mt-1 text-xs text-foreground/45">{entry.time}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <p className="text-xs uppercase tracking-[0.2em] text-foreground/45">Quick actions</p>
          <div className="mt-3 space-y-3">
            {quickActions.slice(0, 3).map((action) => (
              <div key={action.title} className="rounded-2xl border border-border/80 bg-card/50 p-3">
                <p className="text-sm font-semibold">{action.title}</p>
                <p className="mt-1 text-sm text-foreground/60">{action.detail}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </MainLayout>
  );
}
