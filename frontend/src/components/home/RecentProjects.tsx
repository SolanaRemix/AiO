import { ArrowUpRight, Layers3 } from "lucide-react";
import { recentProjects } from "@/lib/constants";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";

export function RecentProjects() {
  return (
    <Card>
      <div className="mb-5 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-foreground/45">Recent projects</p>
          <h2 className="mt-2 text-xl font-semibold">Delivery rooms with live orchestration</h2>
        </div>
        <Badge variant="success">4 synced</Badge>
      </div>
      <div className="space-y-4">
        {recentProjects.map((project) => (
          <div key={project.id} className="rounded-3xl border border-border/80 bg-card/45 p-4 transition hover:border-primary/35 hover:bg-card/70">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="rounded-xl bg-primary/10 p-2 text-primary">
                    <Layers3 className="h-4 w-4" />
                  </div>
                  <h3 className="text-lg font-semibold">{project.name}</h3>
                </div>
                <p className="max-w-2xl text-sm text-foreground/60">{project.summary}</p>
                <div className="flex flex-wrap gap-2">
                  {project.stack.map((item) => (
                    <Badge key={item}>{item}</Badge>
                  ))}
                </div>
              </div>
              <div className="space-y-2 text-right">
                <Badge variant={project.status === "Active" ? "success" : project.status === "Review" ? "warning" : "primary"}>{project.status}</Badge>
                <p className="text-sm text-foreground/55">{project.lastActivity}</p>
                <p className="text-sm text-foreground/55">{project.agents} agents attached</p>
              </div>
            </div>
            <div className="mt-4">
              <div className="mb-2 flex items-center justify-between text-xs text-foreground/50">
                <span>Completion</span>
                <span>{project.progress}%</span>
              </div>
              <div className="h-2 rounded-full bg-foreground/10">
                <div className="h-2 rounded-full bg-primary" style={{ width: `${project.progress}%` }} />
              </div>
            </div>
            <div className="mt-4 flex items-center justify-end text-sm text-primary">
              <span>Open workspace</span>
              <ArrowUpRight className="ml-1 h-4 w-4" />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
