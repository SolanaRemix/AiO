import { MainLayout } from "@/components/layout/MainLayout";
import { ProjectHistory } from "@/components/home/ProjectHistory";
import { RecentProjects } from "@/components/home/RecentProjects";
import { Templates } from "@/components/home/Templates";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";

export default function ProjectsPage() {
  return (
    <MainLayout>
      <Card>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <Badge variant="primary">Projects</Badge>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight">Portfolio delivery command center</h1>
            <p className="mt-3 max-w-3xl text-sm text-foreground/60 sm:text-base">Track readiness, staffing, execution quality, and risk across every enterprise initiative.</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              ["Active programs", "24"],
              ["Launch risk", "Low"],
              ["Review gates", "7 open"],
            ].map(([label, value]) => (
              <div key={label} className="rounded-2xl border border-border/80 bg-card/50 px-4 py-3">
                <p className="text-xs uppercase tracking-[0.2em] text-foreground/45">{label}</p>
                <p className="mt-2 text-xl font-semibold">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </Card>
      <RecentProjects />
      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <Templates />
        <ProjectHistory />
      </div>
    </MainLayout>
  );
}
